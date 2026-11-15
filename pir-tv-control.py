#!/usr/bin/env python3
"""PIR motion -> TV power over IR.

The TV only understands one RC5 code (0x10c) and that code TOGGLES power. There
is no feedback from the TV, so `tv_on` is only what this script believes.

Rules that keep the TV from coming on at night:

  * NIGHT 23:00-08:00   -> nothing is sent on its own: motion, inactivity and
                           the evening shutdown are blocked. Every send goes
                           through send_ir(), which checks the clock. The only
                           exceptions are the two explicit commands below: the
                           alarm and the tv_off button.
  * 22:45-23:00         -> motion no longer turns the TV on (evening cutoff).
  * 22:59               -> if the TV is believed on it is switched off. This is
                           the last signal of the day.
  * 15 min no motion    -> switch off.
  * 20 min no motion    -> believed state is reset to OFF without sending
                           anything (the TV is off by then either way), so a
                           stale "on" cannot survive the night.
  * tv_off button       -> SIGUSR1 (pir-tv-off.service): switch off right
                           away, also inside the night window (the user asked
                           for it), and ignore motion until 08:00.
  * alarm               -> SIGUSR2 (MMM-TouchAlarm, a few minutes before the
                           alarm): switch on, also inside the night window.
                           It starts an "alarm session": until the TV is off
                           again or the night window ends, the inactivity
                           switch-off may send at night too, so the believed
                           state cannot drift from the real one.

tv_on and the button lock are written to a state file so a service restart
does not lose them. While the TV is on the file is refreshed every few
minutes, because a saved "on" older than the reset window counts as stale.
"""
import json
import os
import signal
import subprocess
import time
from datetime import datetime, time as dtime, timedelta
from pathlib import Path

from gpiozero import MotionSensor

# Config
PIR_GPIO = 27
IR_COMMAND = ["/usr/bin/ir-ctl", "-d", "/dev/lirc0", "-S", "rc5:0x10c"]
NIGHT_START = dtime(23, 0)  # from here on no IR at all
NIGHT_END = dtime(8, 0)  # from here on normal operation
INACTIVITY_OFF_SECONDS = 15 * 60  # no motion -> switch off
STATE_RESET_SECONDS = 20 * 60  # no motion -> believed state := off, nothing sent
STATE_SAVE_SECONDS = 5 * 60  # refresh the state file this often while the TV is on
EVENING_CUTOFF = dtime(22, 45)  # no motion turn-on from here (NIGHT_START - 15 min)
EVENING_SHUTDOWN = dtime(22, 59)  # switch off if still on, last signal of the day
BUTTON_DEBOUNCE_SECONDS = 10
STATE_FILE = Path(os.environ.get("STATE_DIRECTORY", "/var/lib/pir-tv-control")) / "state.json"
# Logged with every event only. If this turns out to flip with TV power it can
# become real feedback later.
HDMI_STATUS_FILE = Path("/sys/class/drm/card1-HDMI-A-2/status")


def log(msg):
    print(f"[pir-tv] {msg}", flush=True)


def fmt(ts):
    return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")


def hdmi_status():
    try:
        return HDMI_STATUS_FILE.read_text().strip()
    except OSError:
        return "?"


def is_night(now):
    t = now.time()
    return t >= NIGHT_START or t < NIGHT_END


def next_night_end(now):
    unlock = now.replace(hour=NIGHT_END.hour, minute=NIGHT_END.minute, second=0, microsecond=0)
    if now >= unlock:
        unlock += timedelta(days=1)
    return unlock


class TvController:
    def __init__(self):
        self.tv_on = False
        self.lock_until = 0.0  # motion ignored until this timestamp (tv_off button)
        self.last_motion = time.time()
        self.idle_off_done = False  # inactivity off already attempted for this idle period
        self.evening_shutdown_date = None  # date on which the evening shutdown succeeded
        self.last_button = 0.0
        self.alarm_session = False  # TV switched on by the alarm inside the night window
        self.last_save = 0.0  # when the state file was last written
        # Set from the gpiozero thread / signal handlers, consumed by tick().
        self.motion_pending = False
        self.button_pending = False
        self.alarm_pending = False

    # --- persistence -------------------------------------------------------

    def load_state(self):
        try:
            data = json.loads(STATE_FILE.read_text())
        except (OSError, ValueError):
            log("No saved state, starting with TV believed off")
            return
        age = time.time() - float(data.get("saved_at", 0))
        self.lock_until = float(data.get("lock_until", 0))
        # A saved "on" older than the reset window is stale: the TV is off by now.
        self.tv_on = bool(data.get("tv_on")) and age < STATE_RESET_SECONDS
        self.alarm_session = bool(data.get("alarm_session")) and self.tv_on
        log(f"Loaded state saved {age:.0f}s ago: tv_on={self.tv_on} alarm_session={self.alarm_session} "
            f"lock_until={fmt(self.lock_until)}")

    def save_state(self):
        data = {"tv_on": self.tv_on, "alarm_session": self.alarm_session,
                "lock_until": self.lock_until, "saved_at": time.time()}
        try:
            STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
            tmp = STATE_FILE.with_suffix(".tmp")
            tmp.write_text(json.dumps(data))
            tmp.replace(STATE_FILE)
            self.last_save = data["saved_at"]
        except OSError as exc:
            log(f"Could not save state: {exc}")

    # --- the only place that talks to the TV --------------------------------

    def send_ir(self, reason, now, allow_night=False):
        """Send the power toggle. Refuses inside the night window unless an
        explicit command asked for it (allow_night): the alarm or the tv_off
        button. Everything autonomous stays silent at night."""
        if is_night(now) and not allow_night:
            log(f"BLOCKED ({reason}): {now:%H:%M:%S} is inside night window "
                f"{NIGHT_START:%H:%M}-{NIGHT_END:%H:%M}, no IR sent")
            return False
        try:
            subprocess.run(IR_COMMAND, check=True, timeout=10, capture_output=True)
        except (OSError, subprocess.SubprocessError) as exc:
            stderr = (getattr(exc, "stderr", None) or b"").decode(errors="replace").strip()
            log(f"IR FAILED ({reason}): {exc} {stderr}")
            return False
        log(f"IR SENT ({reason}) hdmi={hdmi_status()}")
        return True

    def turn_on(self, reason, now, allow_night=False):
        if self.tv_on:
            return False
        if not self.send_ir(f"on: {reason}", now, allow_night):
            return False
        self.tv_on = True
        self.idle_off_done = False
        log("TV ON")
        self.save_state()
        return True

    def turn_off(self, reason, now, allow_night=False):
        if not self.tv_on:
            log(f"OFF skipped ({reason}): TV believed off")
            return False
        if not self.send_ir(f"off: {reason}", now, allow_night):
            return False
        self.tv_on = False
        log("TV OFF")
        self.save_state()
        return True

    # --- events ------------------------------------------------------------

    def handle_motion(self, now):
        self.last_motion = now.timestamp()
        self.idle_off_done = False
        if self.tv_on:
            log("MOTION")
            return
        if is_night(now):
            log("MOTION ignored (night block)")
            return
        if now.timestamp() < self.lock_until:
            log(f"MOTION ignored (manual lock until {fmt(self.lock_until)})")
            return
        if now.time() >= EVENING_CUTOFF:
            log(f"MOTION ignored (evening cutoff, no turn-on after {EVENING_CUTOFF:%H:%M})")
            return
        log("MOTION")
        self.turn_on("motion", now)

    def handle_button(self, now):
        ts = now.timestamp()
        if ts - self.last_button < BUTTON_DEBOUNCE_SECONDS:
            log(f"BUTTON ignored (pressed again within {BUTTON_DEBOUNCE_SECONDS}s)")
            return
        self.last_button = ts
        self.lock_until = next_night_end(now).timestamp()
        log(f"BUTTON tv_off: motion locked until {fmt(self.lock_until)}")
        # The button means "the TV is on, switch it off": trust the user over
        # the believed state, this is the way to fix an inverted state. As an
        # explicit command it may send inside the night window too; only the
        # autonomous sends are blocked there.
        if not self.tv_on:
            log("BUTTON: TV believed off, sending toggle anyway")
        if self.send_ir("off: tv_off button", now, allow_night=True):
            self.tv_on = False
            log("TV OFF")
        self.save_state()

    def handle_alarm(self, now):
        """SIGUSR2 from MMM-TouchAlarm: wake-up, make sure the TV is on. The
        only thing allowed to send inside the night window."""
        # Counts as motion: a fresh inactivity window, so the TV stays on
        # long enough to wake up in front of it.
        self.last_motion = now.timestamp()
        self.idle_off_done = False
        if self.tv_on:
            log("ALARM wake-up: TV already believed on, nothing sent")
            return
        log("ALARM wake-up (signal)")
        if self.turn_on("alarm", now, allow_night=True) and is_night(now):
            self.alarm_session = True
            log("ALARM session: inactivity switch-off allowed inside the night window")
            self.save_state()

    def tick(self, now):
        if self.alarm_pending:
            self.alarm_pending = False
            self.handle_alarm(now)
        if self.button_pending:
            self.button_pending = False
            self.handle_button(now)
        if self.motion_pending:
            self.motion_pending = False
            self.handle_motion(now)

        # An alarm session ends when the TV is off again or the night window is over
        if self.alarm_session and (not self.tv_on or not is_night(now)):
            self.alarm_session = False
            log("ALARM session ended")
            self.save_state()

        # Keep the saved "on" fresh, so a restart does not take it for stale
        if self.tv_on and now.timestamp() - self.last_save >= STATE_SAVE_SECONDS:
            self.save_state()

        idle = now.timestamp() - self.last_motion
        if self.tv_on and not self.idle_off_done and idle >= INACTIVITY_OFF_SECONDS:
            self.idle_off_done = True
            log(f"INACTIVITY {INACTIVITY_OFF_SECONDS // 60} min")
            self.turn_off("inactivity", now, allow_night=self.alarm_session)
        if self.tv_on and idle >= STATE_RESET_SECONDS:
            self.tv_on = False
            log(f"STATE RESET -> off (no motion for {STATE_RESET_SECONDS // 60} min, "
                f"TV is off by now) hdmi={hdmi_status()}")
            self.save_state()
        if (self.tv_on and not is_night(now) and now.time() >= EVENING_SHUTDOWN
                and self.evening_shutdown_date != now.date()):
            log("EVENING SHUTDOWN")
            if self.turn_off("evening shutdown", now):
                self.evening_shutdown_date = now.date()

    # --- wiring ------------------------------------------------------------

    def _on_motion(self):
        self.motion_pending = True

    def _on_sigusr1(self, signum, frame):
        self.button_pending = True

    def _on_sigusr2(self, signum, frame):
        self.alarm_pending = True

    def run(self):
        self.load_state()
        pir = MotionSensor(PIR_GPIO)
        pir.when_motion = self._on_motion
        signal.signal(signal.SIGUSR1, self._on_sigusr1)
        signal.signal(signal.SIGUSR2, self._on_sigusr2)
        log(f"Started. tv_on={self.tv_on} alarm_session={self.alarm_session} "
            f"night={NIGHT_START:%H:%M}-{NIGHT_END:%H:%M} (exceptions: alarm SIGUSR2, tv_off button SIGUSR1) "
            f"cutoff={EVENING_CUTOFF:%H:%M} shutdown={EVENING_SHUTDOWN:%H:%M} "
            f"off={INACTIVITY_OFF_SECONDS // 60}min reset={STATE_RESET_SECONDS // 60}min "
            f"hdmi={hdmi_status()}")
        while True:
            self.tick(datetime.now())
            time.sleep(1)


if __name__ == "__main__":
    TvController().run()

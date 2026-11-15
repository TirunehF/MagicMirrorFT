#!/usr/bin/env bash
set -euo pipefail

CEC_DEV="${CEC_DEV:-/dev/cec1}"
TV_ADDR="${TV_ADDR:-0}"

usage() {
  cat << 'USAGE'
Usage: tv-cec.sh <command>

Commands:
  on off toggle
  menu home back info source
  up down left right ok
  volup voldown mute
  chup chdown
  status topology
USAGE
}

run_cec() {
  sudo cec-ctl -s -d"$CEC_DEV" --playback -t"$TV_ADDR" "$@"
}

key() {
  run_cec --user-control-pressed "ui-cmd=$1" --user-control-released
}

cmd="${1:-}"

case "$cmd" in
  on)
    run_cec --image-view-on
    ;;
  off)
    run_cec --standby
    ;;
  toggle)
    key power-toggle-function
    ;;
  menu)
    key device-root-menu
    ;;
  home)
    key contents-menu
    ;;
  back)
    key back
    ;;
  info)
    key display-information
    ;;
  source)
    key input-select
    ;;
  up)
    key up
    ;;
  down)
    key down
    ;;
  left)
    key left
    ;;
  right)
    key right
    ;;
  ok)
    key select
    ;;
  volup)
    key volume-up
    ;;
  voldown)
    key volume-down
    ;;
  mute)
    key mute
    ;;
  chup)
    key channel-up
    ;;
  chdown)
    key channel-down
    ;;
  status)
    run_cec --give-device-power-status
    ;;
  topology)
    sudo cec-ctl -d"$CEC_DEV" --playback -S
    ;;
  ""|-h|--help|help)
    usage
    ;;
  *)
    echo "Unknown command: $cmd" >&2
    usage
    exit 1
    ;;
esac

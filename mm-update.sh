#!/usr/bin/env bash
# Bring this checkout up to date with GitHub and restart MagicMirror when
# something changed. A timer on the mirror runs it every few minutes; it is
# safe to run by hand.
#
#   ./mm-update.sh
#
# What it does, and what it refuses to do:
#   - It fast-forwards the current branch from "origin" and nothing else.
#   - It leaves the checkout alone when tracked files were edited on the
#     mirror itself. Commit or discard those edits first.
#   - It leaves an update alone that changes npm packages (package.json or
#     package-lock.json); that kind needs "npm run install-mm", by hand.
#   - After the restart MagicMirror must answer on its port. If it does not,
#     the previous commit comes back, and the timer does not try that update
#     again until a newer one is pushed.
# It prints something only when it changes something or refuses to.
#
# Settings, from the environment:
#   MM_URL        where MagicMirror answers (default http://localhost:8080/)
#   MM_PM2_NAME   its name in PM2 (default mm)
#   MM_WAIT       seconds to wait for it after a restart (default 90)
set -euo pipefail

main() {
  local dir url app wait_s state branch old new
  dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
  url=${MM_URL:-http://localhost:8080/}
  app=${MM_PM2_NAME:-mm}
  wait_s=${MM_WAIT:-90}
  state=$dir/.git/mm-update
  cd "$dir"

  branch=$(git symbolic-ref --quiet --short HEAD) || refuse "This checkout is not on a branch; not updating."
  old=$(git rev-parse HEAD)
  # No answer from GitHub is not an error: the timer asks again in a few minutes.
  new=$(git ls-remote origin "refs/heads/$branch" 2>/dev/null | cut -f1) || exit 0
  if [ -z "$new" ] || [ "$new" = "$old" ]; then settled; fi
  if [ "$(cat "$state.failed" 2>/dev/null)" = "$new" ]; then exit 0; fi

  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    refuse "Tracked files were edited on the mirror; not updating until they are committed or discarded (git status)."
  fi
  git fetch --quiet origin "$branch" 2>/dev/null || exit 0
  new=$(git rev-parse FETCH_HEAD)
  if git merge-base --is-ancestor "$new" "$old"; then settled; fi          # the mirror is ahead: nothing to pull
  if ! git merge-base --is-ancestor "$old" "$new"; then
    refuse "origin/$branch does not continue from the commit on the mirror (${old:0:8}); not updating."
  fi
  if ! git diff --quiet "$old" "$new" -- '*package.json' '*package-lock.json'; then
    refuse "Update ${new:0:8} changes npm packages; apply it by hand: git pull && npm run install-mm && pm2 restart $app"
  fi

  echo "Updating ${old:0:8} -> ${new:0:8}"
  git merge --quiet --ff-only "$new"
  pm2 restart "$app" >/dev/null
  if answers; then
    echo "MagicMirror is running ${new:0:8}."
    rm -f "$state.failed" "$state.said"
    exit 0
  fi

  echo "MagicMirror did not answer on $url; going back to ${old:0:8}." >&2
  printf '%s\n' "$new" > "$state.failed"
  git reset --quiet --hard "$old"
  pm2 restart "$app" >/dev/null
  if answers; then
    echo "Rolled back. MagicMirror is running ${old:0:8} again." >&2
  else
    echo "The previous version does not answer either. Look at: pm2 logs $app" >&2
  fi
  exit 1
}

# True once MagicMirror answers.
answers() {
  local i
  for ((i = 0; i < wait_s; i += 3)); do
    if curl -fs -o /dev/null -m 5 "$url"; then return 0; fi
    sleep 3
  done
  return 1
}

# Nothing to do: forget what was said before, so that a later refusal is reported again.
settled() {
  rm -f "$state.said"
  exit 0
}

# Say why nothing happens, once, not every few minutes.
refuse() {
  if [ "$(cat "$state.said" 2>/dev/null)" != "$1" ]; then
    echo "$1" >&2
    printf '%s\n' "$1" > "$state.said"
  fi
  exit 0
}

# The whole file is parsed before anything runs, so an update may replace it.
main "$@"
exit

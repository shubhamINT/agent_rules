#!/bin/sh
# Claude Code hook that enforces the SDD workflow. Reads the event JSON on stdin.
#   PreToolUse (Write|Edit|MultiEdit|NotebookEdit): a source edit needs an approved
#     task in agent-tracking/INDEX.md; feature/change also need the spec first.
#   Stop: a feature/change task that is in-progress may not stop before
#     "Verdict: Converged" is in its progress.md.
# Exit 2 blocks and the stderr text goes to the model. Fails open if python3 is
# missing or the JSON is unreadable. SDD_GUARD=off in the user's environment
# disables it. ponytail: Bash writes (sed -i, >) are not seen; CI covers them.
[ "${SDD_GUARD:-}" = off ] && exit 0
command -v python3 >/dev/null 2>&1 || { echo "sdd-hook: python3 missing, guard off" >&2; exit 0; }
here=$(cd "$(dirname "$0")" && pwd)
pfx=$(basename "$(dirname "$here")"); pfx=${pfx%-workflow}   # e.g. onespace-be
in=$(cat)
field() { printf '%s' "$in" | python3 -c 'import json,sys
d=json.load(sys.stdin)
for k in sys.argv[1].split("."):
    d=d.get(k) if isinstance(d,dict) else None
print("" if d is None else d)' "$1" 2>/dev/null; }

proj=${CLAUDE_PROJECT_DIR:-$(field cwd)}
[ -n "$proj" ] && [ -d "$proj" ] || exit 0
SDD_ROOT=$proj; export SDD_ROOT
tasks=$(sh "$here/sdd-check.sh" status 2>/dev/null)

case $(field hook_event_name) in
PreToolUse)
  fp=$(field tool_input.file_path); [ -n "$fp" ] || fp=$(field tool_input.notebook_path)
  [ -n "$fp" ] || exit 0
  case $fp in /*) ;; *) fp=$proj/$fp ;; esac
  case $fp in "$proj"/*) rel=${fp#"$proj"/} ;; *) exit 0 ;; esac   # outside the project: allow
  case $rel in agent-tracking/*|specs/*|*.md) exit 0 ;; esac
  case /$rel in */.agents/*|*/.claude/*) exit 0 ;; esac
  printf '%s\n' "$tasks" | grep -qE '^TASK [^ ]+ [^ ]+ (approved|in-progress) plan=yes spec=yes' && exit 0
  line=$(printf '%s\n' "$tasks" | grep -E '^TASK [^ ]+ [^ ]+ (approved|in-progress) ' | head -1)
  if [ -z "$line" ]; then
    echo "SDD guard: no approved task. Load ${pfx}-workflow, agree scope, get the plan approved, then edit source. For a trivial edit, add one row to agent-tracking/INDEX.md (type trivial, status in-progress). Edited: $rel" >&2
  else
    set -- $line
    case $line in
      *plan=no*) echo "SDD guard: task $2 is $4 but agent-tracking/plans/$2/tasks.md is not marked '**Status:** approved (date, by name)'. Get approval first. Edited: $rel" >&2 ;;
      *) echo "SDD guard: task $2 is a $3 task, so the spec comes first. No specs/*/spec.md names $2 in its change log. Run ${pfx}-specify (new) or ${pfx}-change (existing), then edit source. Edited: $rel" >&2 ;;
    esac
  fi
  exit 2 ;;
Stop)
  case $(field stop_hook_active) in True|true) exit 0 ;; esac
  line=$(printf '%s\n' "$tasks" | grep -E '^TASK [^ ]+ (feature|change) in-progress .* verdict=no' | head -1)
  [ -n "$line" ] || exit 0
  set -- $line
  echo "SDD guard: task $2 is in-progress and has no 'Verdict: Converged' in agent-tracking/plans/$2/progress.md. Run ${pfx}-converge, write the evidence table and the verdict, then the report. If you are blocked, set the INDEX status to blocked and tell the user." >&2
  exit 2 ;;
esac
exit 0

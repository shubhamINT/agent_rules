#!/bin/sh
# Registers sdd-hook.sh in the project's .claude/settings.json (PreToolUse + Stop).
# For npx skills and manual installs; a plugin install already ships the hook.
# usage: sh install-hook.sh [--dry-run] [project-dir]
# Merges, never overwrites: other settings and hooks are kept, an invalid file is
# left untouched, the old file is backed up, and a second run changes nothing.
set -u
dry=0; proj=
for a in "$@"; do case $a in --dry-run) dry=1 ;; *) proj=$a ;; esac; done
proj=$(cd "${proj:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}" && pwd) || exit 2
here=$(cd "$(dirname "$0")" && pwd)
case $here in
  "$proj"/*) rel=${here#"$proj"/} ;;
  *) echo "install-hook: $here is outside $proj. A plugin install already has the hook; nothing to do." >&2; exit 2 ;;
esac
command -v python3 >/dev/null 2>&1 || { echo "install-hook: python3 missing. Add the hook by hand: see the pack README, Enforcement." >&2; exit 2; }
skill=$(basename "$(dirname "$here")")
SDD_PROJ=$proj SDD_REL=$rel/sdd-hook.sh SDD_SKILL=$skill SDD_DRY=$dry python3 - <<'PY'
import json, os, shutil, sys, time
proj, rel, skill = os.environ['SDD_PROJ'], os.environ['SDD_REL'], os.environ['SDD_SKILL']
dry = os.environ['SDD_DRY'] == '1'
arg = '${CLAUDE_PROJECT_DIR}/' + rel   # braces: Claude Code only expands ${NAME}
suffix = skill + '/scripts/sdd-hook.sh'
path = os.path.join(proj, '.claude', 'settings.json')
data = {}
if os.path.exists(path):
    try:
        data = json.load(open(path))
    except Exception as e:
        sys.exit('install-hook: %s is not valid JSON (%s). Fix it first; nothing written.' % (path, e))
if not isinstance(data, dict) or not isinstance(data.get('hooks', {}), dict):
    sys.exit('install-hook: %s has an unexpected shape (top level and "hooks" must be objects); nothing written.' % path)
hooks = data.setdefault('hooks', {})
# Fail open: sh exits 2 (= block) when the script is missing, so test the file first.
entry = {'type': 'command', 'command': 'sh',
         'args': ['-c', '[ -f "$1" ] && exec sh "$1"; exit 0', 'sdd-hook', arg], 'timeout': 15}
wanted = [('PreToolUse', {'matcher': 'Write|Edit|MultiEdit|NotebookEdit', 'hooks': [entry]}),
          ('Stop', {'hooks': [entry]})]
added, kept = [], []
for event, block in wanted:
    lst = hooks.setdefault(event, [])
    if not isinstance(lst, list):
        sys.exit('install-hook: hooks.%s is not a list; nothing written.' % event)
    has = any(isinstance(a, str) and a.endswith(suffix)
              for b in lst if isinstance(b, dict)
              for h in b.get('hooks', []) if isinstance(h, dict)
              for a in h.get('args', []))
    if has:
        kept.append(event)
    else:
        lst.append(block)
        added.append(event)
if not added:
    print('install-hook: already installed (%s); nothing changed.' % ', '.join(kept))
    sys.exit(0)
out = json.dumps(data, indent=2) + '\n'
if dry:
    print('install-hook: dry run, would write %s:\n%s' % (path, out))
    sys.exit(0)
os.makedirs(os.path.dirname(path), exist_ok=True)
if os.path.exists(path):
    bak = path + '.bak-' + time.strftime('%Y%m%d%H%M%S')
    shutil.copy2(path, bak)
    print('install-hook: backed up the old file to %s' % bak)
open(path, 'w').write(out)
print('install-hook: added %s -> %s' % (' and '.join(added), arg))
print('Run /hooks in Claude Code to confirm; it may ask you to trust the project hooks.')
PY

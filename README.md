# INT Agent Rules

Rule packs for coding agents: skills plus an `AGENTS.md` for each project and
stack. Every pack installs as a Claude Code plugin or with `npx skills`.

## Packs

| Pack                                               | Plugin name          | Skill prefix     | Covers                                       |
| -------------------------------------------------- | -------------------- | ---------------- | -------------------------------------------- |
| [`onespace-backend/`](onespace-backend/README.md) | `onespace-backend` | `onespace-be-` | OneSpace backend services (Python + Node.js) |

Each pack's README lists its skills and explains how its workflow runs.

## Install

### Option 1: Claude Code plugin

Use this option for Claude Code. Updates come through the plugin manager.

Add the marketplace once:

```
/plugin marketplace add shubhamINT/agent_rules
```

Then install the packs you need:

```
/plugin install onespace-backend@int-agent-rules
```

A plugin installs every skill in its pack. To choose single skills, use
option 2.

To install for a whole team, commit this to the project's `.claude/settings.json`.
Claude Code then offers the marketplace and plugin to everyone who trusts the
project folder:

```json
{
  "extraKnownMarketplaces": {
    "int-agent-rules": {
      "source": { "source": "github", "repo": "shubhamINT/agent_rules" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "onespace-backend@int-agent-rules": true
  }
}
```

`autoUpdate` turns on auto-update for everyone. The Claude Code docs show this
field in managed settings. If a project `.claude/settings.json` does not apply
it, each user turns it on once: run `/plugin`, open **Marketplaces**, select
`int-agent-rules`, then select **Enable auto-update**.

### Option 2: `npx skills`

Use this option for Claude Code, Codex, Cursor and other agents. You choose the
skills, the agent, and the scope (project or global).

```bash
npx skills add shubhamINT/agent_rules --list                    # show all skills
npx skills add shubhamINT/agent_rules                           # interactive picker
npx skills add shubhamINT/agent_rules --skill onespace-be-audit-code -a claude-code
npx skills add shubhamINT/agent_rules -g                        # global (all projects)
```

### Option 3: Manual copy

```bash
git clone https://github.com/shubhamINT/agent_rules.git
mkdir -p <repo>/.agents
cp -r agent_rules/onespace-backend/.agents/skills <repo>/.agents/
```

### Then: add `AGENTS.md`

The plugin and `npx skills` install skills only. Put the pack's `AGENTS.md` at
the root of your repo:

```bash
curl -o AGENTS.md https://raw.githubusercontent.com/shubhamINT/agent_rules/master/onespace-backend/AGENTS.md
```

If the repo already has an `AGENTS.md`, keep your repo-specific notes at the top
and paste the pack's sections below them.

## Update

| Installed with | Update command                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Plugin         | Automatic when auto-update is on: every push to `master` is a new version, applied at the next launch or after `/reload-plugins`. Manual: `/plugin marketplace update int-agent-rules` |
| `npx skills` | `npx skills update`                                        |
| Manual copy    | `git pull`, then copy the skills again                                                                  |
| `AGENTS.md`  | Run the `curl` command again, but keep your repo's `## Project structure` section                      |

## Add a new pack (maintainers)

1. Create `<pack>/` with `AGENTS.md`, `README.md` and `.agents/skills/`.
2. Give every skill a unique prefix, such as `onespace-fe-`. Use the prefix in
   the folder name, in the `name:` field of `SKILL.md`, and in every reference
   to the skill. Otherwise `npx skills` installs from two packs overwrite each other.
3. Add `<pack>/.claude-plugin/plugin.json`:

   ```json
   {
     "name": "<pack>",
     "description": "...",
     "skills": "./.agents/skills/"
   }
   ```
4. Add the pack to the `plugins` array in `.claude-plugin/marketplace.json`,
   and add a row to the table above.
5. Check both manifests: `claude plugin validate .` and
   `claude plugin validate <pack>`.

Do not add a `version` field to `plugin.json`. Without it, Claude Code uses the
git commit SHA as the version, so every push to `master` reaches plugin users.
Push to `master` only when a change is ready.

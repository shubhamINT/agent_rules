# Token Economy

Context is a budget. Every token spent on filler, a re-read file, or a
400-line log pushes out something that matters, and costs money. Quality comes
from evidence, not from volume. Spend tokens on what changes the result:
scope, root cause, design decisions, verification.

In an agent session most tokens are **input**: files read, tool output,
screenshots. Output text is the smallest share. So the biggest savings come from
reading less and building less. Short replies come last.

## 1. Read cheap (biggest lever)

- Search, then read: find the symbol with grep or glob, then read the range
  around it. Do not read whole files to find one function. Before you edit a
  file, read enough of it to understand it (imports, callers, neighbours):
  saving tokens never means editing code you have not read.
- Read a file once. Do not re-read a file you just read or edited, unless it
  changed on disk or it is no longer in your context (after a summary or a
  long gap).
- Trim tool output at the source: `tail -40`, `grep -n`, `head`, a quiet or
  dot reporter for tests, one test file instead of the suite while iterating.
  Quote only the decisive line.
- A pipe hides the exit code (`cmd | tail` returns `tail`'s status). Use
  `set -o pipefail`, or redirect to a file, check `$?`, then read the tail.
- Delegate broad sweeps (many files, "where is X used") to a subagent. It
  returns compressed findings (`SUBAGENTS.md`), not file dumps.
- Do not reload a skill or reference already loaded in this session.

**Screenshots are the most expensive input.** Each image costs roughly
1,000–1,600 tokens, and a tall full-page shot is downscaled to about 1,568 px
on its long edge, so it costs full price and loses detail.

- Read `report.json` from `shoot.mjs` (or `errors.json` and `console.json`
  from `capture.mjs`) before any image. A failed check needs no image to
  confirm.
- While iterating, shoot only the page and width you are working on, plus
  375 px. Shoot every width and theme only for the "before" set and the final
  verify.
- Use `--no-full-page` when you need detail in one area.
- Read each image once. Do not re-shoot a page that did not change.

## 2. Build less

Less code is fewer tokens to write, read, review, and fix. Before writing,
stop at the first step that works:

1. Does it need to exist? No caller today means skip it, and say so in one line.
2. Does the platform do it? Use CSS over JS, a native element over a library
   (`<dialog>`, `<details>`, `<input type="date">`).
3. Does the repo already have it? Use the existing component, hook, token, or
   dependency (`reuse-search-first`).
4. Only then write the smallest diff that works (`minimal-no-speculative`).

Take the first option that works. Weighing all four is itself wasted thinking.
When two options are the same size, take the one that is correct on edge
cases. "Build less" is about code, not about the agreed result: approved
features, loading states, motion, responsive polish, and tests are needed,
not extra. Premium design is the agreed result; do not trim it to save code.

## 3. Think to the point

- Think in short notes: facts, decision, next action. Do not restate the
  request, narrate tool calls, or draft the reply twice.
- Decide once. Settled decisions live in `scope.md` and `plan.md`; do not
  re-argue them.
- Think longer only where it pays: root cause, design direction, a risky
  trade-off. Mechanical steps (rename, copy a template, run a check) need
  none.
- The host's reasoning-effort setting is the real control over thinking
  length, and it belongs to the user. For long mechanical tasks you may
  suggest a lower setting. Do not change it yourself.

## 4. Reply short

- Chat: result first. No preamble, recap, pleasantries, hedging, or tool
  narration. Tables and lists over paragraphs. State each fact once.
- Keep exact: identifiers, paths, commands, numbers, units, error strings, and
  negations (not, never, only, except).
- Use plain full sentences for security warnings, irreversible actions,
  questions with options, and multi-step instructions where clipped grammar
  could be misread.
- The user's own style instructions win over this section.

Files that persist (`scope.md`, `plan.md`, reports, README, `AGENTS.md`,
commit messages, code comments) stay in normal prose for human readers. They
should still be concise: tables over paragraphs, no filler.

## Never cut

Saving tokens by skipping a step costs more tokens later. Never trim:

- scope questions and plan approval
- the reproduction of a bug
- the final verify at every agreed width and theme, with every image read
- evidence (`file:line`, command output) behind a claim
- security, accessibility, and error handling

---
name: hirebot-fe-explain
description: >
  Explain how something in the codebase works for a reader who has not seen it:
  scope interview, read-only trace with `file:line` evidence, and one HTML page
  with diagrams. Use when the user asks "how does X work", "explain this",
  "walk me through this flow", "I am new to this code", or wants to understand
  something before changing it. Changes no source and never starts before the
  scope is agreed.
---

# Explain

A reader who finishes the page can say what the code does, where it does it, and
what breaks if they change it. This skill produces that understanding, not
changes.

<gate>
`hirebot-fe-workflow` is loaded (do not re-read it) and `scope.md` holds the agreed
answers to the questions below. Scope missing? Ask first and read nothing beyond
the repo tree.
</gate>

## Scope questions

Ask in one message, with a recommended default for each:

1. **Subject**: a page, flow, widget, hook, or file to explain. Name the entry point if you know it.
2. **Reader**: new developer (default), reviewer, tester, or non-technical stakeholder.
3. **Question**: how it works (default), why it is built this way, or how to change it safely.
4. **Depth**: `overview` (one page of flow), `flow` (default: entry to exit, every hop), or `deep` (flow plus data shapes, concurrency, and failure paths).
5. **Lens**: pick what matters from screens and routes, component tree, state and data fetching, every rendered state, forms and validation, styling and tokens. Default: component tree and data flow.
6. **Format**: HTML (default) or Markdown.

## Steps

1. **Locate.** Search for the entry points of the subject. Several matches? Name them and let the user pick.
2. **Trace.** Follow the route to its components, then each component to the hooks, stores, and API calls it uses, down to what renders for loading, empty, error, and loaded. Note `file:line` for every hop as you read.
3. **Check the spec.** A `specs/<NNN-topic>/spec.md` for this subject? Read it and list where code and spec disagree. None? Say so on the page.
4. **Read the tests.** They show expected behaviour. Run only read-only commands (tests, type check, `--help`); start no service and touch no real data.
5. **Write the page** from `templates/explain.html` to `agent-tracking/reports/<slug>.html` (Markdown: the same sections in `.md`). Slug: `YYYY-MM-DD-explain-<topic>`. Draw a flowchart of route, components, data, and rendered states that matches the code hop by hop.
6. **Check it.** Every behaviour claim has a `file:line` you read in this task. Each diagram node exists in the code. Delete the template's top comment block; then `grep -n '{{' <page>` finds nothing. No secret values on the page.
7. **Finish.** Set the INDEX row `done` with the report link. Tell the user in at most five lines what the subject is, the path to the page, and what stayed unverified.

<hard-rules>
- Source is read-only. The only files you write are under `agent-tracking/`.
- Describe only code you read in this task. Mark a deduction `inferred` and anything unread `unverified`. Never describe code from its name alone.
- A trace that dead-ends (dynamic dispatch, config-driven wiring) is reported as a dead end with the place it stops. Do not guess past it.
- Env var and key names go on the page; their values never do.
- Explain what is, not what should be. A problem you notice goes under Observations with the task type that handles it (`audit`, `debug`, `change`). Do not fix it and do not argue for a redesign.
</hard-rules>

<output>
One page, sections in this order: Where it lives, How it flows (diagram plus numbered walk), Data and state, Why it is built this way, Edge cases and failure modes, Changing it safely, Terms, Unverified and observations. Drop a section the agreed depth does not need. The header carries the date, the commit, the reader, and the depth, so the reader knows when it was true.
</output>

The reader wants to change what was explained? The next task is `hirebot-fe-change`, which
needs a spec for the subject: reconstruct one if none exists.

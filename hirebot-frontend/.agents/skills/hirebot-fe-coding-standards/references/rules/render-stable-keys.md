---
title: Stable keys
impact: MEDIUM
impactDescription: list items keep their state and animations
tags: render, lists
---

# Stable keys

Keys identify an item across renders. Array indexes change when a list is
sorted, filtered, or prepended, so React reuses the wrong DOM and state
(inputs keep the old text, animations jump).

**Incorrect:** `{candidates.map((c, i) => <CandidateRow key={i} … />)}`

**Correct:** `{candidates.map((c) => <CandidateRow key={c.id} … />)}`

Index keys are fine only for static lists that never reorder.

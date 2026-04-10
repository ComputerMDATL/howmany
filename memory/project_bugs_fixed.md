---
name: Initial bugs fixed at launch
description: Bugs found and fixed when app was first deployed to Vercel
type: project
---

Three bugs were fixed at initial Vercel launch (2026-04-10):

1. **Wrong model name** (`route.js:52`): `claude-sonnet-4-20250514` → `claude-sonnet-4-5-20250514`. Was causing every question to return a fallback error response.
2. **Outdated SDK** (`package.json`): `@anthropic-ai/sdk ^0.24.0` → `^0.39.0`. Needed for `web_search_20250305` tool support.
3. **Invalid Tailwind class** (`QuestionInput.jsx:63`): Removed `justify-content` (not a valid Tailwind class).

**Why:** App was silently returning fallback cards for all questions due to invalid model ID.
**How to apply:** If questions ever start returning fallback responses again, check model name validity first.

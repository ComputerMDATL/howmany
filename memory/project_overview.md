---
name: HowMany project overview
description: What the app does, its stack, and deployment status
type: project
---

"How Many?" is a stateless Next.js 14 (App Router) web app that answers quantitative questions ("How many sheets of paper in a tree?") using Claude with built-in web search. Deployed on Vercel.

**Stack:** Next.js 14, React 18, Tailwind CSS, @anthropic-ai/sdk, no database, no auth.

**Key files:**
- `app/api/ask/route.js` — entire backend (serverless function, calls Anthropic API)
- `app/components/` — UI components (AnswerCard, QuestionInput, SharePanel, etc.)
- `app/lib/visualizer.js` — Canvas 2D visualizer (5 templates)
- `app/lib/shareCard.js` — OG share card renderer (1200×630)

**Why:** App answers "how many" questions with math steps, a canvas visual, and a fun fact.
**How to apply:** When suggesting changes, keep in mind the app is stateless and serverless — no DB, no sessions.

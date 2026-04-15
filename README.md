# Ask how Many? — Next.js + Tailwind + Claude

> Ask anything. Get a real answer with the math shown.

A kid-friendly web app that answers quantity questions — *"How many sheets of paper in a tree?"*, *"How tall is Mount Everest in feet?"*, *"How many calories in a slice of pizza?"* — with a full breakdown: the math, a visualizer, and a fun fact.

Single codebase. One deployment. No separate backend server.

---

## How it works

1. User types (or speaks) a "how many" question
2. The request hits `/api/ask` — a Next.js serverless function on Vercel
3. Claude Sonnet streams a structured JSON answer back to the browser
4. The frontend renders the answer card with math steps, a canvas visualizer, and a fun fact

Claude classifies every question as **conversion** (pure unit math), **research** (real-world data from training knowledge), or **fallback** (can't be answered with a number). The response is always structured JSON — never free-form text.

---

## File structure

```
howmany/
├── app/
│   ├── api/
│   │   ├── ask/route.js          The entire answer backend — Claude Sonnet, streaming
│   │   └── questions/route.js    Dynamic chip question generator — Claude Haiku
│   ├── components/
│   │   ├── Header.jsx            Logo + tagline
│   │   ├── ExampleChips.jsx      Chip question buttons (dynamically generated)
│   │   ├── QuestionInput.jsx     Text input + ? button + mic button
│   │   ├── LoadingState.jsx      Spinner + rotating thought messages
│   │   ├── AnswerCard.jsx        Answer + 3 tabs: math / visualizer / fun fact
│   │   ├── FallbackCard.jsx      Shown when question can't be answered
│   │   ├── Stars.jsx             Background star animation
│   │   ├── AdBanner.jsx          Ad slot (banner)
│   │   ├── Interstitial.jsx      Full-screen interstitial ad (every 3 questions)
│   │   ├── SharePanel.jsx        Share card builder + download / copy link
│   │   └── Toast.jsx             Temporary notification popup
│   ├── hooks/
│   │   ├── useAsk.js             Fetch logic, streaming reader, state, retry, abort
│   │   └── useInterstitial.js    Ad counter + countdown timer
│   ├── lib/
│   │   ├── visualizer.js         5 canvas visualizer templates
│   │   └── shareCard.js          1200×630 OG share card renderer
│   ├── globals.css               Tailwind directives + custom font import
│   ├── layout.jsx                Root layout + metadata + AdSense script slot
│   └── page.jsx                  Home page — orchestrates all components
├── tailwind.config.js            Custom colors, fonts, animations
├── next.config.js
├── postcss.config.js
└── .env.local                    Your Anthropic API key (never committed)
```

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

Create `.env.local` in the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at **console.anthropic.com → API Keys → Create Key**.

### 3. Run

```bash
npm run dev
```

Open **http://localhost:3000**.

> There is no separate backend to start. The API routes at `app/api/` run automatically as part of Next.js — one terminal, one command.

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "your message"
git push
```

### 2. Import to Vercel

1. **vercel.com → New Project** → import your GitHub repo
2. Leave all settings as default (Vercel auto-detects Next.js)
3. Before deploying, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key
4. Click **Deploy**

Every `git push` to `main` auto-deploys. No separate backend, no `vercel.json` rewrites needed.

---

## Architecture details

### Answer generation — `app/api/ask/route.js`

- **Model**: `claude-sonnet-4-6`
- **Method**: `client.messages.stream()` — response streams to the browser as plain text, then the client JSON-parses it when the stream closes
- **Prompt caching**: the system prompt (≈700 tokens, never changes) uses `cache_control: { type: 'ephemeral' }` — Anthropic caches it server-side so repeated calls within 5 minutes skip re-encoding it
- **No web search tool**: removed. Claude's training knowledge covers every kid-friendly quantity question reliably. The web search tool was causing failures by returning empty results for well-known facts (piano keys, bones, etc.)
- **max_tokens: 900** — typical JSON responses are 400–600 tokens; 900 gives headroom without waste
- **maxDuration: 30** — allows up to 30-second serverless function runtime on Vercel

**Response format** (raw JSON from Claude):
```json
{
  "answer": "3.785",
  "unit": "liters",
  "subtitle": "One US gallon holds exactly 3.785 liters",
  "type": "conversion",
  "range": null,
  "visualType": "stack",
  "steps": [{ "n": 1, "text": "1 US gallon = <strong>231 cubic inches</strong>" }],
  "comparisons": [{ "label": "1 gallon", "value": 3785, "color": "#F5C842" }],
  "funFact": "The UK gallon is 20% bigger than the US gallon!",
  "sources": ["US NIST", "BIPM"]
}
```

### Chip question generation — `app/api/questions/route.js`

- **Model**: `claude-haiku-4-5-20251001` (fast, cheap, sufficient for this task)
- **Called on every page load** — no caching, so every visit gets a fresh unique set
- **50 topic categories** in the prompt — Haiku picks 10 at random each call (wild animals, deep sea, dinosaurs, space, food, sports records, weather, microscopic world, etc.)
- **Today's date** is injected into the prompt for seasonal questions (e.g., Halloween facts in October)
- Falls back to a hardcoded static pool silently on any error — chips still appear instantly

### Frontend streaming — `app/hooks/useAsk.js`

The hook branches on `Content-Type` after `fetch('/api/ask')`:

- `text/plain` → normal answers stream in as chunks, buffered, then JSON-parsed when the stream closes. Loading thought updates to *"Writing the answer…"* while streaming.
- `application/json` → only returned on server-side setup failures (rate limits, API down). Parsed directly.

Auto-retries once on transient errors. AbortController cancels in-flight requests when the user cancels or asks a new question.

### Visualizer types — `app/lib/visualizer.js`

Claude picks one of 5 canvas templates per answer:

| Type | Used for |
|---|---|
| `stack` | Countable objects (bottles, sheets of paper) |
| `ruler` | Human-scale distances (height, length) |
| `people` | Capacity (how many people fit somewhere) |
| `journey` | Large distances (Moon, cities) |
| `starfield` | Billions and beyond (stars, cells) |

---

## Tailwind custom tokens

Defined in `tailwind.config.js`:

| Token | Value | Use |
|---|---|---|
| `text-gold` | `#F5C842` | Primary accent, headings |
| `text-teal` | `#00C9A7` | Secondary accent |
| `text-coral` | `#FF6B6B` | Warnings, mic active |
| `text-cream` | `#F0EAD6` | Body text |
| `text-muted` | `#8B8FA8` | Placeholder, labels |
| `bg-card` | dark card | Answer card background |
| `bg-card2` | darker card | Input, inner cards |
| `rounded-app` | large radius | Input + cards |
| `animate-slideUp` | slide + fade in | Answer card entrance |
| `animate-shake` | horizontal shake | Input validation error |

---

## AdSense setup (when ready)

1. Apply at **adsense.google.com** (approval takes 1–7 days)
2. Uncomment the AdSense script in `app/layout.jsx`
3. Replace the mock ad divs in `AdBanner.jsx` with real `<ins>` tags
4. **Always include** `data-tag-for-child-directed-treatment="1"` on every ad slot (COPPA — this is a kids app)
5. In AdSense dashboard → Brand safety → Block: Dating, Alcohol, Gambling, Political, Violence

The interstitial ad fires every 3 questions (`useInterstitial.js` — `EVERY = 3`). The 5-second countdown is enforced before the skip button appears.

---

## Common issues

**"ANTHROPIC_API_KEY is not defined"**
→ Make sure `.env.local` exists and contains your key. Restart `npm run dev` after creating the file.

**Answers not loading in production**
→ Check that `ANTHROPIC_API_KEY` is set in Vercel → your project → Settings → Environment Variables.

**Chip questions not refreshing**
→ The `/api/questions` endpoint is called on every page load with `Cache-Control: no-store`. If you see the same chips, check that Vercel isn't caching the route at the edge (should not be, given the header).

**Voice input not working**
→ Speech recognition requires Chrome or Edge. The mic button automatically dims on unsupported browsers.

**Question returns a fallback unexpectedly**
→ Check the question is a genuine quantity question ("how many", "how far", "how tall", etc.). Off-topic questions, very vague questions, and non-numeric questions intentionally return the fallback card with suggestions.

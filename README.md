# How Many? 🌟 — Next.js + Tailwind

> Ask anything. Get a real answer with the math shown.

Single codebase. One deployment. No separate backend server.

---

## Project structure

```
howmany-next/
├── app/
│   ├── api/ask/route.js      ← The entire backend (replaces Render/Express)
│   ├── components/
│   │   ├── Stars.jsx         Background animation
│   │   ├── Header.jsx        Logo + tagline + ExampleChips + LoadingState + FallbackCard + Toast
│   │   ├── QuestionInput.jsx Text input + mic button
│   │   ├── AnswerCard.jsx    Answer + 3 tabs (math / visualizer / fact)
│   │   ├── AdBanner.jsx      Ad slot 1 (banner) + Interstitial (slot 2)
│   │   └── SharePanel.jsx    Share card builder + download
│   ├── hooks/
│   │   ├── useAsk.js         API call logic, abort, retry, state
│   │   └── useInterstitial.js Ad counter + countdown
│   ├── lib/
│   │   ├── visualizer.js     5 Canvas visualizer templates
│   │   └── shareCard.js      1200×630 OG share card renderer
│   ├── globals.css           Tailwind directives + font import
│   ├── layout.jsx            Root layout + metadata + AdSense slot
│   └── page.jsx              Home page
├── tailwind.config.js        Custom colors + fonts + animations
├── next.config.js
├── postcss.config.js
└── .env.local.example        Copy to .env.local and add your key
```

---

## Local setup — 3 steps

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at **console.anthropic.com** → API Keys → Create Key.
You'll need to add billing credits (prepaid, ~$10 lasts a long time in dev).

### 3. Run it

```bash
npm run dev
```

Open **http://localhost:3000** — the full app is running.

> Note: Unlike the previous Vite version, there is no separate backend
> to start. The API route at `app/api/ask/route.js` runs automatically
> as part of Next.js. One terminal, one command.

---

## Deploy to Vercel — 3 steps

This is much simpler than the previous version (no Render needed).

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — How Many? Next.js"
git remote add origin https://github.com/YOUR_USERNAME/howmany-next.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to **vercel.com** → New Project
2. Import your GitHub repo
3. Leave all settings as default (Vercel auto-detects Next.js)
4. Before clicking Deploy, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
5. Click **Deploy**

### 3. Done ✅

Your app is live. Every `git push` to `main` auto-deploys.
No Render. No separate backend. No `vercel.json` rewrites needed.

---

## How the backend works (the key concept)

In your other project (pbt-next + pbs-api), the frontend calls a separate
Express server on Render. Here, the "backend" is just one file:

```
app/api/ask/route.js
```

When Vercel deploys your Next.js app, that file becomes a **serverless
function** — it runs server-side, has access to your environment variables,
and the API key never reaches the browser. It's the same security model
as your pbs-api, just built into the same project.

When would you split them? If you later add a database (MongoDB), user
accounts, or complex server logic — then extract it to a separate service
exactly like your other project.

---

## Adding AdSense (when ready)

1. Apply at **adsense.google.com** (approval takes 1–7 days)
2. Uncomment the AdSense script in `app/layout.jsx`
3. Replace mock ad divs in `AdBanner.jsx` and `AnswerCard.jsx` with real `<ins>` tags
4. **Always include** `data-tag-for-child-directed-treatment="1"` on every ad slot (COPPA requirement)
5. In AdSense dashboard → Brand safety → Block: Dating, Alcohol, Gambling, Political, Violence

---

## Tailwind cheat sheet (new to it?)

This project uses Tailwind's utility classes instead of CSS files.
Instead of writing `color: #F5C842` in CSS, you write `text-gold` in JSX.

The custom colors, fonts, and animations are defined in `tailwind.config.js`.
Everything else uses standard Tailwind — the docs at **tailwindcss.com** are excellent.

A few patterns you'll see throughout this project:

| What it does | Tailwind class |
|---|---|
| Gold text | `text-gold` |
| Card background | `bg-card` |
| Muted text | `text-muted` |
| Rounded (big) | `rounded-[22px]` |
| Flex row centered | `flex items-center gap-3` |
| Hover transition | `hover:bg-gold2 transition-all` |
| Slide-up animation | `animate-slideUp` |
| Responsive hide | `hidden md:block` |

---

## Common issues

**"Module not found" errors**
→ Run `npm install` — make sure all dependencies are installed.

**"ANTHROPIC_API_KEY is not defined"**
→ Make sure `.env.local` exists and has your key. Restart `npm run dev` after adding it.

**Answers not loading in production**
→ Check that `ANTHROPIC_API_KEY` is set in your Vercel project settings
  (Vercel dashboard → your project → Settings → Environment Variables).

**Voice input not working**
→ Voice requires Chrome or Edge. The mic button dims automatically on
  unsupported browsers.

**Render sleeping (old version only)**
→ Not relevant to this Next.js version — Vercel serverless functions
  have no cold-start issue for API routes.

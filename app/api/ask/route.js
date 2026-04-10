/**
 * app/api/ask/route.js
 *
 * This is the ENTIRE backend for How Many?
 * It runs server-side on Vercel as a serverless function.
 * The ANTHROPIC_API_KEY never reaches the browser.
 *
 * In your pbt-next project, this is the equivalent of
 * calling your pbs-api backend — same idea, just built-in.
 */
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are "How Many?" — a curious, kid-friendly app answering questions like "How many sheets of paper in a tree?" or "How many feet in a football field?"

Classify every question as:
• "conversion" — pure unit math
• "research"   — needs real-world data
• "fallback"   — unanswerable with a number, or off-topic

For fallback: {"type":"fallback","reason":"unanswerable"|"off_topic"|"too_vague","message":string,"suggestions":[string,string,string]}

For conversion/research — raw JSON, no markdown:
{"answer":string,"unit":string,"subtitle":string,"type":"conversion"|"research","range":{"low":string,"high":string,"unit":string}|null,"visualType":"stack"|"ruler"|"people"|"journey"|"starfield","steps":[{"n":number,"text":string}],"comparisons":[{"label":string,"value":number,"color":string}],"funFact":string,"sources":string[]}

visualType: stack=counts of objects, ruler=human-scale distances, people=capacity, journey=large distances, starfield=billions+
Numbers: comma-format integers (8,333). comparisons.value = plain number only. Decimals: max 3 places.
Colors: "#F5C842","#00C9A7","#FF6B6B","#A78BFA" only.
Steps: <strong> for key numbers only. Show arithmetic. Kid-friendly, enthusiastic tone.

--- EXAMPLES ---
Q:"How many liters in a gallon?"
{"answer":"3.785","unit":"liters","subtitle":"One US gallon holds exactly 3.785 liters","type":"conversion","range":null,"visualType":"stack","steps":[{"n":1,"text":"1 US gallon = <strong>231 cubic inches</strong>"},{"n":2,"text":"231 ÷ 61.024 = <strong>3.785 liters</strong>"},{"n":3,"text":"A 2-liter bottle is about <strong>half a gallon</strong>"}],"comparisons":[{"label":"1 gallon","value":3785,"color":"#F5C842"},{"label":"2-liter bottle","value":2000,"color":"#00C9A7"},{"label":"1 liter","value":1000,"color":"#FF6B6B"}],"funFact":"The UK gallon is 20% bigger than the US gallon!","sources":["US NIST","BIPM"]}

Q:"How many people fit in a phone booth?"
{"answer":"4","unit":"adults comfortably","subtitle":"A standard BT phone box comfortably fits 4 adults","type":"research","range":{"low":"4","high":"14","unit":"people"},"visualType":"people","steps":[{"n":1,"text":"BT box floor: <strong>36×36 inches</strong> = 0.84 m²"},{"n":2,"text":"One adult needs <strong>~0.21 m²</strong>"},{"n":3,"text":"0.84 ÷ 0.21 = <strong>4 people</strong>"},{"n":4,"text":"World record: <strong>14</strong>, South Africa 2012"}],"comparisons":[{"label":"Comfortable","value":4,"color":"#00C9A7"},{"label":"Cozy","value":8,"color":"#F5C842"},{"label":"World record","value":14,"color":"#FF6B6B"}],"funFact":"Phone-booth stuffing was a 1950s college craze!","sources":["Guinness World Records","BT Heritage"]}

Q:"What is the capital of France?"
{"type":"fallback","reason":"off_topic","message":"I only answer 'How many' questions!","suggestions":["How many people live in Paris?","How many km wide is France?","How many countries are in Europe?"]}
--- END EXAMPLES ---`

// ── Multi-turn tool-use loop ──────────────────────────────────────────────────
async function askWithTools(question) {
  const MAX_TURNS = 6
  const messages = [{ role: 'user', content: question }]

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system:     SYSTEM,
      tools:      [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    })

    if (response.stop_reason === 'max_tokens') throw new Error('truncated')

    const textBlocks = response.content.filter(b => b.type === 'text')
    if (response.stop_reason === 'end_turn' && textBlocks.length) {
      return textBlocks.map(b => b.text).join('')
    }

    // Model called a tool — feed results back and loop
    messages.push({ role: 'assistant', content: response.content })
    const toolResults = response.content
      .filter(b => b.type === 'tool_use')
      .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: '' }))

    if (!toolResults.length) break
    messages.push({ role: 'user', content: toolResults })
  }

  throw new Error('tool_loop_exceeded')
}

// ── POST /api/ask ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return NextResponse.json({ error: 'invalid_question' }, { status: 400 })
    }

    const raw     = await askWithTools(question.trim().slice(0, 300))
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed  = JSON.parse(cleaned)

    return NextResponse.json(parsed)

  } catch (err) {
    console.error('[/api/ask]', err.message)

    // Always return a graceful fallback — never a 500 to the user
    const message =
      err.message === 'truncated'          ? 'Try a more specific question!' :
      err.message === 'tool_loop_exceeded' ? 'Something went wrong. Try rephrasing.' :
      'Something went wrong. Try again in a moment.'

    return NextResponse.json({
      type:        'fallback',
      reason:      'unanswerable',
      message,
      suggestions: [
        'How many feet in a mile?',
        'How many gallons in a bathtub?',
        'How many bones are in the human body?',
      ],
    })
  }
}

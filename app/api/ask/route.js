/**
 * app/api/ask/route.js
 *
 * This is the ENTIRE backend for Ask how Many?
 * It runs server-side on Vercel as a serverless function.
 * The ANTHROPIC_API_KEY never reaches the browser.
 */
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are "Ask how many?" — a curious, kid-friendly app answering quantity questions like "How many sheets of paper in a tree?", "How many feet in a football field?", or "How much does a blue whale weigh?"

Accept any question answerable with a number and units — "how many", "how much", "how far", "how tall", "how heavy", "how long", etc.

Classify every question as:
• "conversion" — pure unit math
• "research"   — needs real-world data
• "fallback"   — cannot be answered with a number, or is not a quantity/measurement question

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

// Cached system block — Anthropic caches the prompt after first use (5-min TTL)
const SYSTEM_BLOCK = [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }]

// ── Tool loop: run web-search turns, return answer or accumulated messages ────
async function runToolPhase(question) {
  const MAX_TOOL_TURNS = 5
  const messages = [{ role: 'user', content: question }]

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 900,
      system:     SYSTEM_BLOCK,
      tools:      [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    })

    if (response.stop_reason === 'max_tokens') throw new Error('truncated')

    const textBlocks = response.content.filter(b => b.type === 'text')
    const toolBlocks = response.content.filter(b => b.type === 'tool_use')

    // Model answered with text (no tool use) — return directly
    if (response.stop_reason === 'end_turn' && textBlocks.length) {
      return { directAnswer: textBlocks.map(b => b.text).join(''), messages: null }
    }

    // Feed tool results back and continue
    messages.push({ role: 'assistant', content: response.content })
    const toolResults = toolBlocks.map(b => ({
      type: 'tool_result', tool_use_id: b.id, content: '',
    }))
    if (!toolResults.length) throw new Error('tool_loop_exceeded')
    messages.push({ role: 'user', content: toolResults })
  }

  // All turns used tools — return accumulated messages for streaming final turn
  return { directAnswer: null, messages }
}

// ── Suggest related questions (Haiku — fast, cheap, sufficient) ───────────────
async function getRelatedSuggestions(question) {
  const FALLBACK = [
    'How many feet in a mile?',
    'How many gallons in a bathtub?',
    'How many bones are in the human body?',
  ]
  if (!question?.trim()) return FALLBACK
  try {
    const res = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages:   [{
        role:    'user',
        content: `Return ONLY a JSON array of 3 short "How many" questions related to this topic: "${question}"\nFormat: ["How many X?","How many Y?","How many Z?"]`,
      }],
    })
    const text  = res.content[0]?.text ?? ''
    const match = text.match(/\[[\s\S]*?\]/)
    if (match) {
      const parsed = JSON.parse(match[0])
      if (Array.isArray(parsed) && parsed.length >= 3) return parsed.slice(0, 3)
    }
  } catch (e) {
    console.error('[getRelatedSuggestions] error:', e.message)
  }
  return FALLBACK
}

// ── POST /api/ask ─────────────────────────────────────────────────────────────
export async function POST(request) {
  let question = ''
  try {
    const body = await request.json()
    question   = body.question ?? ''

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return NextResponse.json({ error: 'invalid_question' }, { status: 400 })
    }

    const { directAnswer, messages } = await runToolPhase(question.trim().slice(0, 300))

    // Fast path: model answered without web search (conversions, well-known facts)
    if (directAnswer) {
      const cleaned = directAnswer.replace(/```json|```/g, '').trim()
      return NextResponse.json(JSON.parse(cleaned))
    }

    // Research path: stream the final answer turn (after all tool results accumulated)
    const stream  = client.messages.stream({
      model:      'claude-sonnet-4-6',
      max_tokens: 900,
      system:     SYSTEM_BLOCK,
      messages,
      // No tools — force text-only response for the final answer
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type':      'text/plain; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    })

  } catch (err) {
    console.error('[/api/ask]', err.message, err.status ?? '', err.error ?? '')

    const message =
      err.message === 'truncated'          ? 'Try a more specific question!' :
      err.message === 'tool_loop_exceeded' ? 'Something went wrong. Try rephrasing.' :
      'Something went wrong. Try again in a moment.'

    const suggestions = await getRelatedSuggestions(question)

    return NextResponse.json({
      type: 'fallback',
      reason: 'error',
      message,
      suggestions,
    })
  }
}

/**
 * app/api/questions/route.js
 *
 * GET /api/questions
 * Returns { questions: [{emoji, q}, ...] } — 20 fresh chip questions.
 * Uses claude-haiku for speed; falls back to the static pool on any error.
 * Vercel edge caches the result for 1 hour (stale-while-revalidate 24h).
 */
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Static fallback — updated pool (same as Header.jsx QUESTION_POOL)
const STATIC_POOL = [
  { emoji: '📄', q: 'How many sheets of paper are in a tree?' },
  { emoji: '🏈', q: 'How many feet in a football field?' },
  { emoji: '🥛', q: 'How many liters are in a gallon?' },
  { emoji: '🌕', q: 'How many miles away is the Moon?' },
  { emoji: '✨', q: 'How many stars are in the Milky Way?' },
  { emoji: '🦷', q: 'How many teeth does a great white shark have?' },
  { emoji: '❤️', q: 'How many times does the heart beat in a day?' },
  { emoji: '🌊', q: 'How many gallons of water are in the ocean?' },
  { emoji: '🍕', q: 'How many calories are in a slice of pizza?' },
  { emoji: '🏋️', q: 'How many pounds does an elephant weigh?' },
  { emoji: '📚', q: 'How many words are in the Harry Potter series?' },
  { emoji: '💧', q: 'How many drops of water are in a teaspoon?' },
  { emoji: '🏔️', q: 'How tall is Mount Everest in feet?' },
  { emoji: '🌡️', q: 'How many degrees Fahrenheit is boiling water?' },
  { emoji: '🩸', q: 'How many blood cells are in the human body?' },
  { emoji: '🧠', q: 'How many neurons are in the human brain?' },
  { emoji: '🌍', q: 'How many people are on Earth?' },
  { emoji: '🦴', q: 'How many bones are in the human body?' },
  { emoji: '🏊', q: 'How many gallons of water are in an Olympic swimming pool?' },
  { emoji: '🌳', q: 'How many trees are on Earth?' },
]

const GENERATION_PROMPT = `Generate exactly 20 kid-friendly "How many" questions with these rules:

1. Every question must have a single definitive numeric answer (not "it depends")
2. Cover varied topics: nature, space, human body, food, sports, geography, science, animals
3. Answers should be in a range kids can relate to — avoid anything over 1 trillion
4. No questions about violence, politics, or things that are highly variable
5. Each needs one relevant emoji

GOOD examples: "How many bones are in the human body?", "How many liters in a gallon?", "How many calories in a banana?", "How many moons does Jupiter have?"
BAD examples: "How many volts in a lightning bolt?" (too variable), "How many ants on Earth?" (too large/vague)

Return ONLY a JSON array, no markdown, no explanation:
[{"emoji":"🦴","q":"How many bones are in the human body?"},{"emoji":"🥛","q":"How many liters are in a gallon?"},...18 more]`

async function generateQuestions() {
  const MAX_TURNS = 2
  const messages  = [{ role: 'user', content: GENERATION_PROMPT }]

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 800,
      tools:      [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    })

    const textBlocks = response.content.filter(b => b.type === 'text')
    const toolBlocks = response.content.filter(b => b.type === 'tool_use')

    if (response.stop_reason === 'end_turn' && textBlocks.length) {
      const text  = textBlocks.map(b => b.text).join('')
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed) && parsed.length >= 10) {
          // Validate shape: each item must have emoji and q strings
          const valid = parsed.filter(
            item => item && typeof item.emoji === 'string' && typeof item.q === 'string'
          )
          if (valid.length >= 10) return valid.slice(0, 20)
        }
      }
      throw new Error('invalid_format')
    }

    messages.push({ role: 'assistant', content: response.content })
    const toolResults = toolBlocks.map(b => ({
      type: 'tool_result', tool_use_id: b.id, content: '',
    }))
    if (!toolResults.length) break
    messages.push({ role: 'user', content: toolResults })
  }

  throw new Error('generation_failed')
}

export async function GET() {
  try {
    const questions = await generateQuestions()
    return NextResponse.json({ questions }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[/api/questions]', err.message)
    return NextResponse.json(
      { questions: STATIC_POOL, source: 'static' },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    )
  }
}

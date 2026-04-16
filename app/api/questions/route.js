/**
 * app/api/questions/route.js
 *
 * GET /api/questions
 * Returns { questions: [{emoji, q}, ...] } — 20 fresh chip questions every call.
 * No caching — Haiku generates a new varied set each page load.
 * Falls back to the static pool on any error.
 */
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Static fallback — shown while the API call is in progress or on error
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

// Full topic menu — Haiku picks 10 at random each call, guaranteeing variety
const TOPIC_MENU = [
  'Wild Animals & Predators', 'Ocean & Deep Sea Creatures', 'Insects & Bugs', 'Birds & Flight',
  'Dinosaurs & Prehistoric Life', 'Pets & Domestic Animals', 'Reptiles & Amphibians',
  'Space & Planets', 'Stars & Galaxies', 'Black Holes & Astronomy',
  'Human Body & Biology', 'Brain & Senses', 'Bones & Muscles', 'Heart & Blood',
  'Food & Cooking', 'Candy & Sweets', 'Fast Food & Snacks', 'Fruits & Vegetables',
  'Sports Records & Championships', 'Olympic Games', 'Ball Sports', 'Extreme Sports',
  'World Records & Guinness', 'Tallest & Biggest Things', 'Smallest & Tiniest Things',
  'Geography & Countries', 'Mountains & Deserts', 'Rivers & Oceans',
  'History & Ancient Civilizations', 'Castles & Kingdoms',
  'Movies & Blockbusters', 'Video Games', 'Music & Instruments', 'Books & Authors',
  'Science & Experiments', 'Chemistry & Elements', 'Electricity & Energy',
  'Vehicles & Speed Records', 'Rockets & Space Travel', 'Ships & Submarines',
  'Buildings & Architecture', 'Bridges & Tunnels',
  'Money & Economics', 'Technology & Computers', 'Robots & AI',
  'Plants & Flowers', 'Rainforests & Jungles', 'Weather & Natural Disasters',
  'Microscopic World', 'Atoms & Particles',
]

function buildPrompt(lang = 'en') {
  const locale = lang === 'es' ? 'es-ES' : 'en-US'
  const today = new Date().toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // Shuffle and pick 10 topic categories for this call
  const shuffled = [...TOPIC_MENU].sort(() => Math.random() - 0.5)
  const chosen   = shuffled.slice(0, 10).join(', ')

  if (lang === 'es') {
    return `Hoy es ${today}.

Genera exactamente 20 preguntas de cantidad divertidas y sorprendentes para niños curiosos de 8 a 14 años.

Concéntrate SOLO en estas 10 áreas temáticas (2 preguntas cada una): ${chosen}

Reglas:
- Cada pregunta debe tener UNA respuesta numérica específica y verificable
- Las respuestas deben estar entre 2 y 500 mil millones (nada más grande, nada cero)
- Varía los inicios: "¿Cuántos", "¿Cuántas", "¿A qué distancia", "¿Cuánto mide", "¿Cuánto pesa", "¿Con qué velocidad"
- Haz que las preguntas sean sorprendentes o deliciosas — no las obvias y aburridas
- Sin violencia, muerte, guerras ni temas de miedo
- Cada pregunta necesita un emoji relevante
- Escribe todas las preguntas en español

Devuelve SOLO un array JSON, sin markdown, sin explicación:
[{"emoji":"🦈","q":"¿Cuántos dientes pierde un tiburón en su vida?"},{"emoji":"🎸","q":"¿Cuántas cuerdas tiene una guitarra estándar?"},...18 más]`
  }

  return `Today is ${today}.

Generate exactly 20 fun, surprising quantity questions for curious kids aged 8–14.

Focus ONLY on these 10 topic areas (2 questions each): ${chosen}

Rules:
- Every question must have ONE specific, checkable numeric answer
- Answers must be between 2 and 500 billion (nothing larger, nothing zero)
- Vary question starters: "How many", "How far", "How tall", "How long", "How fast", "How heavy", "How much"
- Make questions feel surprising or delightful — not the obvious boring ones
- No violence, death, wars, or scary topics
- Each question needs one relevant emoji

Return ONLY a JSON array, no markdown, no explanation:
[{"emoji":"🦈","q":"How many teeth does a shark grow in its lifetime?"},{"emoji":"🎸","q":"How many strings does a standard guitar have?"},...18 more]`
}

async function generateQuestions(lang = 'en') {
  const response = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages:   [{ role: 'user', content: buildPrompt(lang) }],
  })

  const text  = response.content.filter(b => b.type === 'text').map(b => b.text).join('')
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('no_json')

  const parsed = JSON.parse(match[0])
  const valid  = parsed.filter(
    item => item && typeof item.emoji === 'string' && typeof item.q === 'string' && item.q.trim().length > 5
  )
  if (valid.length < 10) throw new Error('too_few_questions')

  return valid.slice(0, 20)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en'

  try {
    const questions = await generateQuestions(lang)
    // No caching — every page load gets a fresh, unique set
    return NextResponse.json({ questions }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[/api/questions]', err.message)
    return NextResponse.json(
      { questions: STATIC_POOL, source: 'static' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }
}

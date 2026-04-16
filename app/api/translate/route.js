/**
 * app/api/translate/route.js
 *
 * POST { answer, lang }
 *
 * Translates only the human-readable text fields of a stored answer object
 * using Claude Haiku (fast, cheap).  Numbers, HTML tags, colors, and
 * comparisons.value are untouched — only words change.
 *
 * Returns the same shape as the original answer so the caller can spread it
 * over the existing state: { ...oldAnswer, ...translatedFields }
 */
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const maxDuration = 15

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { answer, lang } = await request.json()
    if (!answer || !lang) return NextResponse.json({ error: 'missing_fields' }, { status: 400 })

    const targetLang = lang === 'es' ? 'Spanish' : 'English'

    // Pull out only the fields that contain human-readable text
    const toTranslate = {
      subtitle:     answer.subtitle   ?? '',
      unit:         answer.unit       ?? '',
      funFact:      answer.funFact    ?? '',
      steps:        (answer.steps     ?? []).map(s => ({ n: s.n, text: s.text })),
      comparisons:  (answer.comparisons ?? []).map(c => ({ label: c.label, value: c.value, color: c.color })),
      ...(answer.range ? {
        range: { low: answer.range.low, high: answer.range.high, unit: answer.range.unit ?? '' }
      } : {}),
    }

    const prompt = `Translate the following JSON to ${targetLang}.

STRICT RULES — follow exactly:
- Translate ONLY the human-readable words
- Preserve every number exactly as-is (e.g. 3.785 stays 3.785)
- Preserve every HTML tag exactly as-is (<strong>, </strong>, <em>, </em>)
- Preserve every color hex code exactly as-is (#F5C842 etc.)
- "value" fields inside comparisons are numbers — do NOT translate them
- "n" fields inside steps are numbers — do NOT translate them
- Return ONLY the translated JSON object, no markdown, no explanation

${JSON.stringify(toTranslate)}`

    const res = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text  = res.content[0]?.text ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no_json')

    const translated = JSON.parse(match[0])

    // Reattach non-text fields that Haiku shouldn't have touched
    // (belt-and-suspenders: use original values if Haiku mangled them)
    const safeComparisons = (translated.comparisons ?? toTranslate.comparisons).map((c, i) => ({
      ...answer.comparisons[i],
      label: c.label ?? answer.comparisons[i]?.label,
    }))

    const safeSteps = (translated.steps ?? toTranslate.steps).map((s, i) => ({
      n:    answer.steps[i]?.n ?? s.n,
      text: s.text ?? answer.steps[i]?.text,
    }))

    return NextResponse.json({
      subtitle:    translated.subtitle    ?? answer.subtitle,
      unit:        translated.unit        ?? answer.unit,
      funFact:     translated.funFact     ?? answer.funFact,
      steps:       safeSteps,
      comparisons: safeComparisons,
      ...(answer.range && translated.range ? {
        range: {
          low:  answer.range.low,
          high: answer.range.high,
          unit: translated.range.unit ?? answer.range.unit,
        }
      } : {}),
    })

  } catch (err) {
    console.error('[/api/translate]', err.message)
    return NextResponse.json({ error: 'translation_failed' }, { status: 500 })
  }
}

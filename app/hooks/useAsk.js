'use client'

import { useState, useRef, useCallback } from 'react'

const THOUGHTS = [
  'Crunching the numbers…',
  'Consulting the universe…',
  'Doing the math…',
  'Researching real-world data…',
  'Checking sources…',
  'Calculating with care…',
]

export function useAsk() {
  const [state, setState] = useState({
    status:  'idle',   // idle | loading | answer | fallback
    answer:  null,
    fallback: null,
    thought: THOUGHTS[0],
    isRetry: false,
  })

  const controllerRef   = useRef(null)
  const thoughtTimerRef = useRef(null)

  const ask = useCallback(async (question, isRetry = false) => {
    question = question.trim()
    if (question.length < 3) return

    // Cancel any in-flight request
    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal

    clearInterval(thoughtTimerRef.current)
    setState(prev => ({
      ...prev,
      status:  'loading',
      answer:  isRetry ? prev.answer : null,
      fallback: null,
      isRetry,
      thought: THOUGHTS[0],
    }))

    let ti = 0
    thoughtTimerRef.current = setInterval(() => {
      ti = (ti + 1) % THOUGHTS.length
      setState(prev => ({ ...prev, thought: THOUGHTS[ti] }))
    }, 2200)

    try {
      // /api/ask is a Next.js API route in the same project — no CORS, no Render
      const res = await fetch('/api/ask', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body:    JSON.stringify({ question }),
      })

      clearInterval(thoughtTimerRef.current)
      if (!res.ok) throw new Error('http_' + res.status)

      let data
      const contentType = res.headers.get('Content-Type') ?? ''

      if (contentType.includes('text/plain')) {
        // Streaming response — all normal answers arrive as a streamed JSON string
        setState(prev => ({ ...prev, thought: 'Writing the answer…' }))
        const reader  = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
        }
        const cleaned = buffer.replace(/```json|```/g, '').trim()
        data = JSON.parse(cleaned)
      } else {
        // JSON response — only for server-side setup errors (rate limits, API down, etc.)
        data = await res.json()
      }

      if (data.type === 'fallback') {
        // Auto-retry once on transient server errors (distinct from genuine model fallbacks)
        if (!isRetry && data.reason === 'error') {
          ask(question, true)
          return
        }
        setState(prev => ({ ...prev, status: 'fallback', fallback: data, isRetry: false }))
      } else {
        setState(prev => ({ ...prev, status: 'answer', answer: data, isRetry: false }))
      }

    } catch (err) {
      clearInterval(thoughtTimerRef.current)
      if (err.name === 'AbortError') return

      if (!isRetry && err.message === 'parse') {
        ask(question, true)
        return
      }

      const message =
        err.message === 'http_429' ? "Too many questions right now — try again in a moment!" :
        err.message === 'truncated' ? "Try a more specific question!" :
        "Something went wrong. Try rephrasing."

      setState(prev => ({
        ...prev,
        status:  'fallback',
        isRetry: false,
        fallback: {
          type:    'fallback',
          reason:  'unanswerable',
          message,
          suggestions: [
            'How many feet in a mile?',
            'How many gallons in a bathtub?',
            'How many bones in the human body?',
          ],
        },
      }))
    }
  }, [])

  const reset = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort()
    clearInterval(thoughtTimerRef.current)
    setState({ status: 'idle', answer: null, fallback: null, thought: THOUGHTS[0], isRetry: false })
  }, [])

  return { ...state, ask, reset }
}

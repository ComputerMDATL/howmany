'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { translations } from '../lib/i18n'

export function useAsk() {
  const { lang } = useLang()

  // Keep lang in a ref so the async ask callback can always read the latest value
  // without needing to be recreated on every lang change.
  const langRef = useRef(lang)
  useEffect(() => { langRef.current = lang }, [lang])

  const getThoughts = () => translations[langRef.current]?.thoughts ?? translations.en.thoughts
  const tr = (key) => translations[langRef.current]?.[key] ?? translations.en[key] ?? key

  const [state, setState] = useState({
    status:   'idle',   // idle | loading | answer | fallback
    answer:   null,
    fallback: null,
    thought:  translations.en.thoughts[0],
    isRetry:  false,
  })

  const controllerRef   = useRef(null)
  const thoughtTimerRef = useRef(null)

  const ask = useCallback(async (question, isRetry = false) => {
    question = question.trim()
    if (question.length < 3) return

    const thoughts = getThoughts()

    // Cancel any in-flight request
    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal

    clearInterval(thoughtTimerRef.current)
    setState(prev => ({
      ...prev,
      status:   'loading',
      answer:   isRetry ? prev.answer : null,
      fallback: null,
      isRetry,
      thought:  thoughts[0],
    }))

    let ti = 0
    thoughtTimerRef.current = setInterval(() => {
      ti = (ti + 1) % getThoughts().length
      setState(prev => ({ ...prev, thought: getThoughts()[ti] }))
    }, 2200)

    try {
      const res = await fetch('/api/ask', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body:    JSON.stringify({ question, lang: langRef.current }),
      })

      clearInterval(thoughtTimerRef.current)
      if (!res.ok) throw new Error('http_' + res.status)

      let data
      const contentType = res.headers.get('Content-Type') ?? ''

      if (contentType.includes('text/plain')) {
        // Streaming response
        setState(prev => ({ ...prev, thought: tr('writingAnswer') }))
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
        data = await res.json()
      }

      if (data.type === 'fallback') {
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
        err.message === 'http_429' ? tr('err_too_many') :
        err.message === 'truncated' ? tr('err_too_specific') :
        tr('err_went_wrong')

      setState(prev => ({
        ...prev,
        status:   'fallback',
        isRetry:  false,
        fallback: {
          type:        'fallback',
          reason:      'unanswerable',
          message,
          suggestions: tr('err_suggestions'),
        },
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort()
    clearInterval(thoughtTimerRef.current)
    setState({
      status:  'idle',
      answer:  null,
      fallback: null,
      thought: translations[langRef.current]?.thoughts[0] ?? translations.en.thoughts[0],
      isRetry: false,
    })
  }, [])

  return { ...state, ask, reset }
}

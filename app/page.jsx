'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { LanguageProvider, useLang } from './context/LanguageContext'
import { useAsk }          from './hooks/useAsk'
import { useInterstitial } from './hooks/useInterstitial'
import Stars          from './components/Stars'
import Header         from './components/Header'
import QuestionInput  from './components/QuestionInput'
import ExampleChips   from './components/ExampleChips'
import LoadingState   from './components/LoadingState'
import FallbackCard   from './components/FallbackCard'
import AnswerCard     from './components/AnswerCard'
import AdBanner       from './components/AdBanner'
import Interstitial   from './components/Interstitial'
import SharePanel     from './components/SharePanel'
import Toast          from './components/Toast'

// LanguageProvider must wrap everything so hooks inside can read the context.
// HomeInner is a separate component so useAsk / useInterstitial are called
// *inside* the provider boundary.
export default function Home() {
  return (
    <LanguageProvider>
      <HomeInner />
    </LanguageProvider>
  )
}

function HomeInner() {
  const { status, answer, fallback, thought, isRetry, ask, reset, patchAnswer } = useAsk()
  const interstitial = useInterstitial()
  const [currentQ,   setCurrentQ]  = useState('')
  const [inputValue, setInputValue] = useState('')
  const [shareOpen,  setShareOpen] = useState(false)
  const [toast,     setToast]     = useState(null)
  const inputRef = useRef(null)

  const { lang, t } = useLang()
  const isFirstLang = useRef(true)
  useEffect(() => {
    if (isFirstLang.current) { isFirstLang.current = false; return }
    if (!currentQ) return

    if (status === 'answer' && answer) {
      // Translate the stored result in-place via Haiku (~0.5s) — no need to
      // redo the math. Fall back to a full re-ask if translation fails.
      fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ answer, lang }),
      })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(patch => patchAnswer(patch))
        .catch(() => ask(currentQ))
    } else if (status === 'fallback') {
      // Suggestions are question strings — re-ask so they're naturally phrased
      ask(currentQ)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }, [])

  const handleAsk = useCallback((q) => {
    const trimmed = q.trim()
    if (trimmed.length < 3) return
    setCurrentQ(trimmed)
    setInputValue(trimmed)
    setShareOpen(false)
    ask(trimmed)
  }, [ask])

  const handleCancel = useCallback(() => {
    reset()
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [reset])

  const handleReset = useCallback(() => {
    interstitial.maybeShow(() => {
      reset()
      setShareOpen(false)
      setCurrentQ('')
      setInputValue('')
      setTimeout(() => inputRef.current?.focus(), 100)
    })
  }, [interstitial, reset])

  return (
    <>
      <Stars />
      <Toast message={toast} />
      <Interstitial {...interstitial} />

      <main className="relative z-10 max-w-[680px] mx-auto px-4 pb-16 pt-5">
        <Header onReset={handleReset} />

        {(() => {
          const [p1, p2, p3, p4] = t('intro')
          return (
            <div className="w-full mb-5 mt-2 text-[14px] leading-snug">
              <p className="text-cream/70">
                {p1.before}
                <span className="text-gold font-semibold text-[28px]">&ldquo;{p1.q1}&rdquo;</span>{' '}
                {p1.mid}
                <span className="text-teal font-semibold text-[21px]">&ldquo;{p1.q2}&rdquo;</span>?
                {' '}{p1.after}<span className="text-gold font-bold text-[25px]">{p1.brand}</span>{p1.end}
                <span className="text-coral font-semibold text-[28px]">{p1.ai}</span>{p1.fin}
              </p>

              <p className="text-cream/70 mt-2">
                {p2.before}<span className="text-teal font-semibold text-[21px]">{p2.math}</span>{p2.mid}
                <span className="text-gold font-semibold text-[25px]">{p2.diagram}</span>{p2.mid2}
                <span className="text-coral font-semibold text-[28px]">{p2.fact}</span>{p2.end}
              </p>

              <p className="text-cream/70 mt-2">
                {p3.before}<span className="text-gold font-semibold text-[21px]">{p3.conv}</span>{p3.mid}
                <span className="text-teal font-semibold text-[25px]">{p3.compare}</span>{p3.mid2}
                <span className="text-coral font-semibold text-[21px]">{p3.qty}</span>{p3.mid3}
                <span className="text-gold font-semibold text-[28px]">{p3.en}</span>{p3.mid4}
                <span className="text-teal font-semibold text-[25px]">{p3.es}</span>{p3.end}
              </p>

              <p className="text-cream/70 mt-2">
                {p4.before}<span className="text-coral font-semibold text-[21px]">{p4.cta}</span>{p4.mid}
                <span className="text-gold font-semibold text-[28px]">{p4.free}</span>{p4.end}
              </p>
            </div>
          )
        })()}

        <QuestionInput
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onAsk={handleAsk}
          disabled={status === 'loading'}
        />
        <ExampleChips onAsk={handleAsk} />

        {status === 'loading' && (
          <LoadingState thought={thought} isRetry={isRetry} onCancel={handleCancel} />
        )}

        {status === 'fallback' && fallback && (
          <FallbackCard data={fallback} onAsk={handleAsk} onReset={handleReset} />
        )}

        {status === 'answer' && answer && (
          <>
            <AnswerCard
              question={currentQ}
              answer={answer}
              onReset={handleReset}
              onShare={() => setShareOpen(o => !o)}
              interstitial={interstitial}
            />
            <AdBanner />
            {shareOpen && (
              <SharePanel
                question={currentQ}
                answer={answer}
                onClose={() => setShareOpen(false)}
                onToast={showToast}
              />
            )}
          </>
        )}
      </main>
    </>
  )
}

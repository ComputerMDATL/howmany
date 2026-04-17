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

  const { lang } = useLang()
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

        <div className="w-full mb-5 mt-2 text-[14px] leading-relaxed">
          <p className="text-cream/70">
            Have you ever asked a question like{' '}
            <span className="text-gold font-semibold">&ldquo;How many pizzas could fill a swimming pool?&rdquo;</span>{' '}
            or{' '}
            <span className="text-teal font-semibold">&ldquo;How many steps is it to the moon?&rdquo;</span>?
            {' '}That&rsquo;s exactly what <span className="text-gold font-bold text-[15px]">HowMany</span> is here for!
            Type in any question about numbers, sizes, distances, or amounts — and our{' '}
            <span className="text-coral font-semibold">AI brain</span> figures it out instantly, for free!
          </p>

          <p className="text-cream/70 mt-3">
            You don&rsquo;t just get a number — you get the{' '}
            <span className="text-teal font-semibold">full math breakdown</span>, shown step by step so you can actually see how it works.
            Plus a{' '}
            <span className="text-gold font-semibold">cool diagram</span> to help you picture the size,
            and a{' '}
            <span className="text-coral font-semibold">fun fact</span> that will blow your mind!
            It&rsquo;s like having a super-smart calculator that also tells stories.
          </p>

          <p className="text-cream/70 mt-3">
            You can ask about{' '}
            <span className="text-gold font-semibold">unit conversions</span>{' '}
            (miles to kilometers, pounds to kilograms — easy!),{' '}
            <span className="text-teal font-semibold">real-world comparisons</span>{' '}
            (how heavy is a blue whale? how tall is the Eiffel Tower in bananas?),
            or any wild{' '}
            <span className="text-coral font-semibold">quantity question</span>{' '}
            your brain can dream up.
            HowMany works in <span className="text-gold font-semibold">English</span> and <span className="text-teal font-semibold">Spanish</span> — just tap the flag at the top to switch!
          </p>

          <p className="text-cream/70 mt-3">
            Not sure where to start?{' '}
            <span className="text-coral font-semibold">Tap one of the example questions</span> below and see the magic happen.
            No sign-up, no accounts, <span className="text-gold font-semibold">totally free</span> — just big questions and even bigger answers. Let&rsquo;s go! 🚀
          </p>
        </div>

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

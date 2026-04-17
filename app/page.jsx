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

        <div className="w-full mb-5 mt-2">
          <p className="text-[13.5px] leading-relaxed text-cream/60">
            <strong className="text-cream/80">HowMany</strong> is a free, instant answer engine for quantity and measurement questions — powered by AI.
            Ever wondered how many gallons of water are in the ocean, how many steps it takes to walk a mile, or how many times your heart beats in a year?
            Just type your question and HowMany breaks it down step by step, showing you the real math behind the answer so you actually understand where the number comes from.
          </p>
          <p className="text-[13.5px] leading-relaxed text-cream/60 mt-3">
            Each answer includes a full mathematical breakdown, a visual diagram to make the scale easy to grasp, and a fun fact to put the number in perspective.
            Whether you&rsquo;re a student trying to understand unit conversions, a teacher looking for a quick classroom tool, or just a curious person who loves numbers, HowMany gives you clear, accurate answers in seconds.
          </p>
          <p className="text-[13.5px] leading-relaxed text-cream/60 mt-3">
            HowMany handles three kinds of questions: <strong className="text-cream/75">unit conversions</strong> (like inches to centimeters or miles to kilometers),
            <strong className="text-cream/75"> research questions</strong> that involve real-world quantities (like the weight of an elephant or the distance to the moon),
            and <strong className="text-cream/75">comparison questions</strong> that put big numbers into everyday context.
            The app works in both English and Spanish — tap the flag in the top corner to switch languages at any time.
          </p>
          <p className="text-[13.5px] leading-relaxed text-cream/60 mt-3">
            Not sure what to ask? Tap any of the example questions below the input box to see HowMany in action.
            Every answer is generated fresh by AI, so you can ask virtually anything involving numbers, quantities, sizes, distances, weights, volumes, or time.
            There are no accounts, no sign-ups, and no paywalls — HowMany is completely free to use.
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

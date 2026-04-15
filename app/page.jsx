'use client'

import { useState, useRef, useCallback } from 'react'
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

export default function Home() {
  const { status, answer, fallback, thought, isRetry, ask, reset } = useAsk()
  const interstitial = useInterstitial()
  const [currentQ,   setCurrentQ]  = useState('')
  const [inputValue, setInputValue] = useState('')
  const [shareOpen,  setShareOpen] = useState(false)
  const [toast,     setToast]     = useState(null)
  const inputRef = useRef(null)

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

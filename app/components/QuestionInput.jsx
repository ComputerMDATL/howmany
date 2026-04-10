'use client'
import { forwardRef, useState, useRef, useEffect } from 'react'

const QuestionInput = forwardRef(function QuestionInput({ onAsk, disabled }, ref) {
  const [value,     setValue]     = useState('')
  const [shaking,   setShaking]   = useState(false)
  const [listening, setListening] = useState(false)
  const recRef      = useRef(null)
  const supported   = useRef(false)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR  = window.SpeechRecognition || window.webkitSpeechRecognition
      const rec = new SR()
      rec.lang = 'en-US'; rec.interimResults = false
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript
        setListening(false); setValue(t); onAsk(t)
      }
      rec.onend  = () => setListening(false)
      rec.onerror= () => setListening(false)
      recRef.current   = rec
      supported.current = true
    }
  }, [onAsk])

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 500) }

  const submit = () => {
    const v = value.trim()
    if (v.length < 3) { shake(); return }
    onAsk(v)
  }

  return (
    <div className="relative mb-2.5">
      <input
        ref={ref}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="How many sheets of paper are in a tree?"
        maxLength={300}
        disabled={disabled}
        className={[
          'w-full bg-card2 border border-gold/20 rounded-app',
          'px-5 py-4 pr-14 font-body text-[15px] text-cream',
          'placeholder:text-muted outline-none input-gold',
          'transition-all duration-200',
          disabled ? 'opacity-60' : '',
          shaking  ? 'animate-shake' : '',
        ].join(' ')}
      />
      <button
        onClick={() => {
          if (!supported.current) return
          if (listening) { recRef.current.stop(); setListening(false); return }
          setListening(true); recRef.current.start()
        }}
        title={supported.current ? 'Tap to speak' : 'Voice requires Chrome or Edge'}
        className={[
          'absolute right-2.5 top-1/2 -translate-y-1/2',
          'w-9 h-9 rounded-full border-none flex items-center text-sky text-base',
          'flex items-center justify-center transition-all',
          listening        ? 'bg-coral animate-pulse'  : 'bg-gold hover:bg-gold2 hover:scale-105',
          !supported.current ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        🎤
      </button>
    </div>
  )
})

export default QuestionInput

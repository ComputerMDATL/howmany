'use client'
import { forwardRef, useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

const QuestionInput = forwardRef(function QuestionInput({ onAsk, disabled, value, onChange }, ref) {
  const { lang, t } = useLang()
  const [shaking,   setShaking]   = useState(false)
  const [listening, setListening] = useState(false)
  const [qLeft,     setQLeft]     = useState(null)
  const recRef    = useRef(null)
  const supported = useRef(false)
  const mirrorRef = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR  = window.SpeechRecognition || window.webkitSpeechRecognition
      const rec = new SR()
      rec.lang           = lang === 'es' ? 'es-ES' : 'en-US'
      rec.interimResults = false
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript
        setListening(false); onChange(transcript); onAsk(transcript)
      }
      rec.onend  = () => setListening(false)
      rec.onerror= () => setListening(false)
      recRef.current    = rec
      supported.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, onAsk])

  // Measure rendered text width and position the '?' button right after it.
  useEffect(() => {
    if (!mirrorRef.current || !wrapRef.current || !value.trim()) {
      setQLeft(null)
      return
    }
    mirrorRef.current.textContent = value
    const textW = mirrorRef.current.offsetWidth
    const wrapW = wrapRef.current.offsetWidth
    // Keep clear of mic button: right-2.5 (10px) + w-9 (36px) + gap (6px) + btn width (28px)
    const maxLeft = wrapW - 10 - 36 - 6 - 28
    setQLeft(Math.min(20 + textW + 6, maxLeft))  // 20px = px-5 left padding
  }, [value])

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 500) }

  const submit = () => {
    const v = value.trim()
    if (v.length < 3) { shake(); return }
    onAsk(v)
  }

  return (
    <div ref={wrapRef} className="relative mb-2.5">

      {/* Hidden mirror — same font as the input — used only for width measurement */}
      <span
        ref={mirrorRef}
        aria-hidden
        className="font-body text-[15px] absolute invisible whitespace-pre pointer-events-none"
        style={{ top: '-9999px', left: 0 }}
      />

      <input
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder={t('placeholder')}
        maxLength={300}
        disabled={disabled}
        className={[
          'w-full bg-card2 border border-gold/20 rounded-app',
          'px-5 py-4 pr-20 font-body text-[15px] text-cream',
          'placeholder:text-muted outline-none input-gold',
          'transition-all duration-200',
          disabled ? 'opacity-60' : '',
          shaking  ? 'animate-shake' : '',
        ].join(' ')}
      />

      {/* ? button — trails the cursor as the user types */}
      <button
        tabIndex={-1}
        onClick={() => {
          if (!value.trimEnd().endsWith('?')) onChange(value.trimEnd() + '?')
          ref?.current?.focus()
        }}
        title="Add question mark"
        style={qLeft !== null ? { left: `${qLeft}px` } : undefined}
        className={[
          'absolute top-1/2 -translate-y-1/2',
          'w-7 h-7 rounded-full flex items-center justify-center',
          'text-gold font-bold text-sm border border-gold/40 bg-card2',
          'hover:bg-gold/20 hover:border-gold/70 cursor-pointer',
          'transition-[left,opacity,transform] duration-100',
          qLeft !== null ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none right-[3.2rem]',
        ].join(' ')}
      >
        ?
      </button>

      <button
        onClick={() => {
          if (!supported.current) return
          if (listening) { recRef.current.stop(); setListening(false); return }
          setListening(true); recRef.current.start()
        }}
        title={supported.current ? t('voiceTitle') : t('voiceUnsupported')}
        className={[
          'absolute right-2.5 top-1/2 -translate-y-1/2',
          'w-9 h-9 rounded-full border-none flex items-center text-sky text-base',
          'flex items-center justify-center transition-all',
          listening         ? 'bg-coral animate-pulse'  : 'bg-gold hover:bg-gold2 hover:scale-105',
          !supported.current ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        🎤
      </button>
    </div>
  )
})

export default QuestionInput

'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'

// ─── Header ──────────────────────────────────────────────────────────────────
export function Header({ onReset }) {
  const { lang, toggleLang, t } = useLang()

  return (
    <div className="text-center py-7">
      <h1
        onClick={onReset}
        className={[
          'font-display text-5xl font-black text-gold tracking-tight leading-none',
          onReset ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
        ].join(' ')}
      >
        Ask how{' '}
        <span className="font-normal italic text-cream">many</span>
        ?
      </h1>
      <p className="text-sm text-muted mt-1.5 tracking-wide">
        {t('subtitle')}
      </p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-teal/10 border border-teal/20 rounded-full px-3 py-0.5 text-[10px] text-teal font-semibold">
          ✓ v6 · Next.js + Tailwind
        </span>

        {/* EN | ES language toggle */}
        <button
          onClick={toggleLang}
          title={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
          className="inline-flex items-center bg-card2 border border-white/[0.12] rounded-full overflow-hidden text-[10px] font-semibold cursor-pointer hover:border-gold/40 transition-colors"
        >
          <span className={[
            'px-2.5 py-0.5 transition-colors',
            lang === 'en' ? 'bg-gold text-sky' : 'text-muted',
          ].join(' ')}>EN</span>
          <span className={[
            'px-2.5 py-0.5 transition-colors',
            lang === 'es' ? 'bg-gold text-sky' : 'text-muted',
          ].join(' ')}>ES</span>
        </button>
      </div>
    </div>
  )
}
export default Header

// ─── ExampleChips ─────────────────────────────────────────────────────────────
const QUESTION_POOL_EN = [
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

const QUESTION_POOL_ES = [
  { emoji: '📄', q: '¿Cuántas hojas de papel hay en un árbol?' },
  { emoji: '🏈', q: '¿Cuántos pies hay en un campo de fútbol americano?' },
  { emoji: '🥛', q: '¿Cuántos litros hay en un galón?' },
  { emoji: '🌕', q: '¿A cuántas millas está la Luna?' },
  { emoji: '✨', q: '¿Cuántas estrellas hay en la Vía Láctea?' },
  { emoji: '🦷', q: '¿Cuántos dientes tiene un gran tiburón blanco?' },
  { emoji: '❤️', q: '¿Cuántas veces late el corazón en un día?' },
  { emoji: '🌊', q: '¿Cuántos galones de agua hay en el océano?' },
  { emoji: '🍕', q: '¿Cuántas calorías hay en una porción de pizza?' },
  { emoji: '🏋️', q: '¿Cuántas libras pesa un elefante?' },
  { emoji: '📚', q: '¿Cuántas palabras hay en la saga de Harry Potter?' },
  { emoji: '💧', q: '¿Cuántas gotas de agua hay en una cucharadita?' },
  { emoji: '🏔️', q: '¿Cuántos pies de altura tiene el Monte Everest?' },
  { emoji: '🌡️', q: '¿A cuántos grados Fahrenheit hierve el agua?' },
  { emoji: '🩸', q: '¿Cuántas células sanguíneas hay en el cuerpo humano?' },
  { emoji: '🧠', q: '¿Cuántas neuronas hay en el cerebro humano?' },
  { emoji: '🌍', q: '¿Cuántas personas hay en la Tierra?' },
  { emoji: '🦴', q: '¿Cuántos huesos hay en el cuerpo humano?' },
  { emoji: '🏊', q: '¿Cuántos galones de agua caben en una piscina olímpica?' },
  { emoji: '🌳', q: '¿Cuántos árboles hay en la Tierra?' },
]

export function ExampleChips({ onAsk }) {
  const { lang, t } = useLang()
  const staticPool = lang === 'es' ? QUESTION_POOL_ES : QUESTION_POOL_EN
  const [pool, setPool] = useState(staticPool)
  const [reshuffleKey, setReshuffleKey] = useState(0)
  // Fetched questions are staged here and only applied on the next Re-shuffle
  // click — so the initial chips never jump after the API responds.
  const fetchedRef = useRef(null)

  // Re-fetch whenever lang changes. AbortController cancels any in-flight
  // request from the previous language so stale results never overwrite.
  useEffect(() => {
    const controller = new AbortController()
    setPool(staticPool)
    fetchedRef.current = null
    fetch(`/api/questions?lang=${lang}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ questions }) => {
        if (Array.isArray(questions) && questions.length >= 6) {
          fetchedRef.current = questions  // stage — don't display yet
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') { /* silently keep the static pool */ }
      })
    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const handleReshuffle = () => {
    if (fetchedRef.current) {
      setPool(fetchedRef.current)  // swap in the fresh set on first shuffle
      fetchedRef.current = null
    }
    setReshuffleKey(k => k + 1)
  }

  const chips = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, reshuffleKey])

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] text-muted font-semibold tracking-widest uppercase">
          {t('tryAsking')}
        </p>
        <button
          onClick={handleReshuffle}
          className="text-[10px] text-muted/60 hover:text-gold transition-colors cursor-pointer"
          title="Shuffle questions"
        >
          {t('reshuffle')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map(c => (
          <button
            key={c.q}
            onClick={() => onAsk(c.q)}
            className="bg-gold/[0.08] border border-gold/25 rounded-full px-3.5 py-1.5 text-xs text-cream font-body cursor-pointer hover:bg-gold/20 hover:border-gold/60 transition-all"
          >
            {c.emoji} {c.q}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── LoadingState ─────────────────────────────────────────────────────────────
export function LoadingState({ thought, isRetry, onCancel }) {
  const { t } = useLang()
  return (
    <div className="text-center py-12">
      <div className="w-11 h-11 border-[3px] border-gold/10 border-t-gold rounded-full animate-spin mx-auto mb-3.5" />
      <p className="text-muted text-sm italic">
        {isRetry ? t('tryingAgain') : t('lookingUp')}
      </p>
      <p className="text-gold text-xs mt-1.5 min-h-[17px]">{thought}</p>
      <button
        onClick={onCancel}
        className="mt-5 bg-transparent border border-white/[0.13] text-muted rounded-full py-2 px-5 font-body text-xs cursor-pointer hover:border-cream hover:text-cream transition-all"
      >
        {t('cancel')}
      </button>
    </div>
  )
}

// ─── FallbackCard ─────────────────────────────────────────────────────────────
export function FallbackCard({ data, onAsk, onReset }) {
  const { t } = useLang()

  const FB_META = {
    off_topic:    { icon: t('fb_icon_off_topic'),    title: t('fb_off_topic')    },
    unanswerable: { icon: t('fb_icon_unanswerable'), title: t('fb_unanswerable') },
    too_vague:    { icon: t('fb_icon_too_vague'),    title: t('fb_too_vague')    },
    default:      { icon: t('fb_icon_default'),      title: t('fb_default')      },
  }

  const meta = FB_META[data.reason] || FB_META.default
  return (
    <div className="animate-slideUp bg-card border border-white/10 rounded-[22px] overflow-hidden">
      <div className="p-5 pb-4 flex gap-3.5 border-b border-white/[0.06]">
        <span className="text-3xl flex-shrink-0">{meta.icon}</span>
        <div>
          <p className="font-display text-xl font-bold text-cream leading-tight mb-1">{meta.title}</p>
          <p className="text-sm text-muted leading-relaxed">{data.message}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[10px] text-muted font-semibold tracking-widest uppercase mb-2.5">
          {data.reason === 'off_topic' ? t('things_i_can_answer') : t('try_one_of_these')}
        </p>
        {(data.suggestions || []).map((s, i) => (
          <button
            key={i}
            onClick={() => onAsk(s)}
            className="flex items-center gap-2 w-full bg-card2 border border-gold/15 rounded-xl px-3.5 py-2.5 mb-2 text-cream font-body text-sm cursor-pointer hover:border-gold hover:bg-gold/[0.06] hover:translate-x-0.5 transition-all text-left"
          >
            <span>💡</span>
            <span className="flex-1">{s}</span>
            <span className="text-gold">→</span>
          </button>
        ))}
      </div>
      <div className="px-5 py-3.5 border-t border-white/[0.06]">
        <button
          onClick={onReset}
          className="w-full bg-transparent border border-white/[0.13] text-muted rounded-full py-2.5 px-4 font-body text-xs cursor-pointer hover:border-cream hover:text-cream transition-all"
        >
          {t('ask_another')}
        </button>
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message }) {
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-teal text-sky px-5 py-2.5 rounded-full text-sm font-semibold z-50 pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ transform: `translateX(-50%) translateY(${message ? '0' : '70px'})` }}
    >
      {message}
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
export function Header({ onReset }) {
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
        Ask anything. Get a real answer with the math shown.
      </p>
      <div className="mt-2">
        <span className="inline-flex items-center gap-1.5 bg-teal/10 border border-teal/20 rounded-full px-3 py-0.5 text-[10px] text-teal font-semibold">
          ✓ v6 · Next.js + Tailwind
        </span>
      </div>
    </div>
  )
}
export default Header

// ─── ExampleChips ─────────────────────────────────────────────────────────────
import { useMemo } from 'react'

const QUESTION_POOL = [
  { emoji: '📄', q: 'How many sheets of paper are in a tree?' },
  { emoji: '🏈', q: 'How many feet in a football field?' },
  { emoji: '🥛', q: 'How many liters are in a gallon?' },
  { emoji: '🌕', q: 'How many miles away is the Moon?' },
  { emoji: '✨', q: 'How many stars are in the Milky Way?' },
  { emoji: '🦷', q: 'How many teeth does a great white shark have?' },
  { emoji: '❤️', q: 'How many times does the heart beat in a day?' },
  { emoji: '🌊', q: 'How many gallons of water are in the ocean?' },
  { emoji: '🍕', q: 'How many calories are in a slice of pizza?' },
  { emoji: '🐜', q: 'How many ants are on Earth?' },
  { emoji: '📚', q: 'How many words are in the Harry Potter series?' },
  { emoji: '💧', q: 'How many drops of water are in a teaspoon?' },
  { emoji: '🏔️', q: 'How tall is Mount Everest in feet?' },
  { emoji: '⚡', q: 'How many volts are in a lightning bolt?' },
  { emoji: '🩸', q: 'How many blood cells are in the human body?' },
  { emoji: '🧠', q: 'How many neurons are in the human brain?' },
  { emoji: '🌍', q: 'How many people are on Earth?' },
  { emoji: '🦴', q: 'How many bones are in the human body?' },
  { emoji: '🏊', q: 'How many gallons of water are in an Olympic swimming pool?' },
  { emoji: '🌳', q: 'How many trees are on Earth?' },
]

export function ExampleChips({ onAsk }) {
  const chips = useMemo(() => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6)
  }, [])

  return (
    <div className="mb-5">
      <p className="text-[10px] text-muted font-semibold tracking-widest uppercase mb-2">
        Try asking:
      </p>
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
  return (
    <div className="text-center py-12">
      <div className="w-11 h-11 border-[3px] border-gold/10 border-t-gold rounded-full animate-spin mx-auto mb-3.5" />
      <p className="text-muted text-sm italic">
        {isRetry ? 'Trying again…' : 'Looking that up...'}
      </p>
      <p className="text-gold text-xs mt-1.5 min-h-[17px]">{thought}</p>
      <button
        onClick={onCancel}
        className="mt-5 bg-transparent border border-white/[0.13] text-muted rounded-full py-2 px-5 font-body text-xs cursor-pointer hover:border-cream hover:text-cream transition-all"
      >
        Cancel
      </button>
    </div>
  )
}

// ─── FallbackCard ─────────────────────────────────────────────────────────────
const FB_META = {
  off_topic:    { icon: '🧭', title: "That's not a 'how many' question!" },
  unanswerable: { icon: '🤔', title: 'That one stumped me...' },
  too_vague:    { icon: '🔍', title: 'Can you be more specific?' },
  default:      { icon: '😅', title: "Hmm, couldn't answer that" },
}

export function FallbackCard({ data, onAsk, onReset }) {
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
          {data.reason === 'off_topic' ? 'Things I can answer:' : 'Try one of these:'}
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
          Ask another
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

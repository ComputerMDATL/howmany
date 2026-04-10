// ─── Header ──────────────────────────────────────────────────────────────────
export function Header() {
  return (
    <div className="text-center py-7">
      <h1 className="font-display text-5xl font-black text-gold tracking-tight leading-none">
        How{' '}
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
const CHIPS = [
  { emoji: '📄', label: 'sheets in a tree?',  q: 'How many sheets of paper are in a tree?' },
  { emoji: '🏈', label: 'football field?',     q: 'How many feet in a football field?' },
  { emoji: '📞', label: 'phone booth?',        q: 'How many people fit in a phone booth?' },
  { emoji: '🥛', label: 'liters in a gallon?', q: 'How many liters in a gallon?' },
  { emoji: '🌕', label: 'miles to the Moon?',  q: 'How many miles to the Moon?' },
  { emoji: '✨', label: 'Milky Way stars?',     q: 'How many stars in the Milky Way?' },
]

export function ExampleChips({ onAsk }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {CHIPS.map(c => (
        <button
          key={c.q}
          onClick={() => onAsk(c.q)}
          className="bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-muted font-body cursor-pointer hover:bg-gold/10 hover:border-gold/40 hover:text-gold transition-all whitespace-nowrap"
        >
          {c.emoji} {c.label}
        </button>
      ))}
    </div>
  )
}

// ─── LoadingState ─────────────────────────────────────────────────────────────
export function LoadingState({ thought, isRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-11 h-11 border-[3px] border-gold/10 border-t-gold rounded-full animate-spin mx-auto mb-3.5" />
      <p className="text-muted text-sm italic">
        {isRetry ? 'Trying again…' : 'Looking that up...'}
      </p>
      <p className="text-gold text-xs mt-1.5 min-h-[17px]">{thought}</p>
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

export function FallbackCard({ data, onAsk }) {
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

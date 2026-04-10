/**
 * AdBanner.jsx  — AD SLOT 1: banner below answer card
 * Interstitial  — AD SLOT 2: fullscreen every 3rd reset
 *
 * IN PRODUCTION: Replace mock content with real AdSense <ins> tags.
 * Always include data-tag-for-child-directed-treatment="1" (COPPA).
 */
'use client'
import { useMemo } from 'react'

const BANNER_ADS = [
  { icon: '🔭', title: 'Sky Map — Explore the Night Sky',  sub: 'Point your phone up. See every star, planet & constellation.', cta: 'Free Download' },
  { icon: '🧪', title: 'MEL Science Kits',                  sub: 'Monthly science experiments delivered to your door.',          cta: 'Learn More'    },
  { icon: '📚', title: 'Khan Academy Kids',                  sub: 'Free learning for ages 2–8. Math, reading, and more.',        cta: 'Try Free'      },
  { icon: '🌍', title: 'National Geographic Kids',           sub: 'Wild facts, amazing animals, science & geography.',           cta: 'Explore'       },
]

export function AdBanner() {
  const ad = useMemo(() => BANNER_ADS[Math.floor(Math.random() * BANNER_ADS.length)], [])

  return (
    <div className="mt-3 animate-fadeIn">
      {/* Replace this div with AdSense <ins> tag in production */}
      <div className="bg-card2 border border-white/[0.08] rounded-xl px-3.5 py-2.5 flex items-center gap-3 min-h-[72px]">
        <span className="text-[9px] text-muted font-semibold tracking-widest uppercase bg-white/[0.06] px-1.5 py-0.5 rounded flex-shrink-0">
          Ad
        </span>
        <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/15 flex items-center justify-center text-xl flex-shrink-0">
          {ad.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-cream mb-0.5 truncate">{ad.title}</p>
          <p className="text-[11px] text-muted leading-snug line-clamp-2">{ad.sub}</p>
        </div>
        <button className="bg-gold text-sky border-none rounded-lg px-3.5 py-1.5 font-body text-xs font-semibold cursor-pointer flex-shrink-0 hover:bg-gold2 transition-colors">
          {ad.cta}
        </button>
      </div>
    </div>
  )
}

export default AdBanner

// ─── Interstitial ─────────────────────────────────────────────────────────────
const INT_ADS = [
  { icon: '🚀', title: "Did you know NASA has a free app?",  sub: 'Explore the solar system, track the ISS, and watch rocket launches live.',  cta: 'Get NASA App — Free', color: '#00C9A7' },
  { icon: '🔬', title: 'Curiosity Stream',                   sub: 'Thousands of documentaries about science, nature, history, and space.',      cta: 'Try 30 Days Free',   color: '#6B8CFF' },
  { icon: '🦁', title: 'Smithsonian Channel',                sub: 'Real science. Real stories. Wild planet, amazing animals.',                  cta: 'Watch Now',          color: '#F5C842' },
]

export function Interstitial({ visible, countdown, canSkip, skip }) {
  if (!visible) return null
  const ad = INT_ADS[Math.floor(Date.now() / 10000) % INT_ADS.length]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5">
      <div className="animate-slideUp bg-card border border-white/10 rounded-[20px] w-full max-w-sm overflow-hidden">

        {/* Progress bar */}
        <div className="h-0.5 bg-white/[0.06]">
          <div
            className="h-full bg-gold transition-all duration-100 linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
          <span className="text-[10px] text-muted font-semibold tracking-widest uppercase">
            Advertisement
          </span>
          <span className={`text-xs font-medium ${canSkip ? 'text-teal' : 'text-muted'}`}>
            {canSkip ? 'Ready!' : `Skip in ${countdown}s`}
          </span>
          <button
            onClick={skip}
            disabled={!canSkip}
            className={[
              'text-xs font-body px-2 py-1 rounded-md transition-colors',
              canSkip
                ? 'text-cream cursor-pointer hover:bg-white/10'
                : 'text-muted cursor-not-allowed opacity-40',
            ].join(' ')}
          >
            Skip ✕
          </button>
        </div>

        {/* Ad content */}
        <div className="px-5 py-6 text-center">
          <div
            className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl mx-auto mb-3.5 border"
            style={{ background: `${ad.color}22`, borderColor: `${ad.color}44` }}
          >
            {ad.icon}
          </div>
          <p className="font-display text-[22px] font-bold text-cream mb-1.5 leading-tight">
            {ad.title}
          </p>
          <p className="text-[13px] text-muted leading-relaxed mb-5">{ad.sub}</p>
          <button
            onClick={skip}
            className="w-full border-none rounded-full py-3 font-body text-sm font-semibold cursor-pointer text-sky transition-opacity hover:opacity-90"
            style={{ background: ad.color }}
          >
            {ad.cta}
          </button>
        </div>
      </div>
    </div>
  )
}

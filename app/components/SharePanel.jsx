'use client'
import { useState, useRef, useEffect } from 'react'
import { drawShareCard, SHARE_STYLES } from '../lib/shareCard'

const SWATCH_BG = [
  'linear-gradient(135deg,#0B1A2E,#1E2D47)',
  'linear-gradient(135deg,#120228,#2a0d52)',
  'linear-gradient(135deg,#062015,#0d3d25)',
  'linear-gradient(135deg,#150700,#3d1800)',
  'linear-gradient(135deg,#F8F4EC,#E8E4D8)',
]

export default function SharePanel({ question, answer, onClose, onToast }) {
  const [styleIdx, setStyleIdx] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (canvasRef.current) {
        drawShareCard(canvasRef.current, { question, answer, styleIndex: styleIdx })
      }
    })
  }, [question, answer, styleIdx])

  const handleDownload = () => {
    const slug = (question || 'answer')
      .slice(0, 40)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
    const a = document.createElement('a')
    a.download = `howmany-${slug}.png`
    a.href = canvasRef.current.toDataURL('image/png')
    a.click()
  }

  const handleCopyLink = () => {
    const url = `https://howmany.app/?q=${encodeURIComponent(question.slice(0, 200))}`
    navigator.clipboard.writeText(url).catch(() => {})
    onToast('Link copied! 🔗')
  }

  return (
    <div className="animate-slideUp bg-card border border-gold/15 rounded-[22px] overflow-hidden mt-3">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <p className="text-[13px] font-semibold text-cream">Share card</p>
        <button
          onClick={onClose}
          className="text-muted hover:text-cream text-base font-body bg-transparent border-none cursor-pointer px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="px-5 pb-5 pt-4">
        {/* Preview label */}
        <p className="text-[10px] text-muted font-semibold tracking-widest uppercase mb-2">
          Preview — 1200 × 630 (OG card size)
        </p>

        {/* Canvas preview */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={630}
          className="w-full h-auto block rounded-xl border border-white/[0.06]"
        />

        {/* Style swatches */}
        <div className="flex items-center gap-2 my-3">
          {SWATCH_BG.map((bg, i) => (
            <button
              key={i}
              onClick={() => setStyleIdx(i)}
              className="w-7 h-7 rounded-full flex-shrink-0 border-2 transition-all cursor-pointer"
              style={{
                background: bg,
                borderColor: styleIdx === i ? 'white' : 'transparent',
                transform: styleIdx === i ? 'scale(1.18)' : 'scale(1)',
              }}
            />
          ))}
          <span className="text-[11px] text-muted ml-1.5">Pick a style</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={handleDownload}
            className="flex-1 bg-gold text-sky border-none rounded-full py-2.5 px-4 font-body text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-gold2 hover:scale-[1.02] transition-all"
          >
            ⬇ Download PNG
          </button>
          <button
            onClick={handleCopyLink}
            className="bg-transparent border border-white/15 text-muted rounded-full py-2.5 px-4 font-body text-xs cursor-pointer whitespace-nowrap hover:border-cream hover:text-cream transition-all"
          >
            🔗 Copy link
          </button>
        </div>
      </div>
    </div>
  )
}

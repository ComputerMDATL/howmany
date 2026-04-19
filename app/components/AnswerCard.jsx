'use client'
import { useState, useRef, useEffect } from 'react'
import { drawVisualizer } from '../lib/visualizer'
import { useLang } from '../context/LanguageContext'

function TabAd({ slotId }) {
  useEffect(() => {
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])
  return (
    <div className="mt-3">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 100 }}
        data-ad-client="ca-pub-6335883588140435"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

function safeHtml(s) {
  const d = document.createElement('div')
  d.textContent = String(s ?? '')
  return d.innerHTML
    .replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>')
    .replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>')
}

export default function AnswerCard({ question, answer, onReset, onShare }) {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('steps')
  const canvasRef  = useRef(null)
  const [caption,  setCaption]   = useState('')

  const TABS = [
    { id: 'steps',  label: t('tab_math')   },
    { id: 'visual', label: t('tab_visual') },
    { id: 'fact',   label: t('tab_fact')   },
  ]

  // Reset to first tab whenever a new answer arrives
  useEffect(() => { setActiveTab('steps') }, [answer])

  // Draw visualizer only when that tab is active
  useEffect(() => {
    if (activeTab !== 'visual') return
    document.fonts.ready.then(() => {
      if (canvasRef.current) {
        const cap = drawVisualizer(canvasRef.current, answer)
        setCaption(cap)
      }
    })
  }, [activeTab, answer])

  return (
    <div className="animate-slideUp bg-card border border-gold/[0.12] rounded-[22px] overflow-hidden">

      {/* ── Answer top ── */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <p className="text-[11px] text-muted tracking-widest uppercase mb-2">
          {question.replace(/\?$/, '')}
        </p>
        <p className="font-display text-5xl font-black text-gold leading-none mb-1.5">
          {answer.answer}
        </p>
        <p className="text-sm text-cream/80 leading-relaxed">
          {answer.unit ? `${answer.unit} — ` : ''}{answer.subtitle}
        </p>
        {answer.type === 'research' && answer.range && (
          <span className="inline-flex items-center gap-1.5 mt-2 bg-teal/10 border border-teal/[0.22] rounded-full px-3 py-1 text-[11px] text-teal">
            {t('est_range')} {answer.range.low}–{answer.range.high} {answer.range.unit || ''}
          </span>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-white/[0.06]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex-1 py-2.5 px-1.5 text-center text-xs font-medium font-body',
              'border-b-2 transition-all cursor-pointer',
              activeTab === tab.id
                ? 'text-gold border-gold'
                : 'text-muted border-transparent hover:text-cream',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      <div className="px-5 py-5">

        {/* Steps */}
        {activeTab === 'steps' && (
          <div>
            {(answer.steps || []).map(s => (
              <div key={s.n} className="flex gap-3 mb-4 last:mb-0 items-start">
                <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/[0.22] flex items-center justify-center text-[11px] font-semibold text-gold flex-shrink-0 mt-0.5">
                  {s.n}
                </div>
                <p
                  className="text-[13px] text-cream/80 leading-relaxed [&_strong]:text-cream [&_strong]:font-semibold [&_em]:text-teal [&_em]:not-italic"
                  dangerouslySetInnerHTML={{ __html: safeHtml(s.text) }}
                />
              </div>
            ))}
            <TabAd key="steps" slotId="9232067343" />
          </div>
        )}

        {/* Visual */}
        {activeTab === 'visual' && (
          <div>
            <canvas
              ref={canvasRef}
              height={160}
              className="w-full h-auto block rounded-lg"
            />
            {caption && (
              <p className="text-[11px] text-muted mt-2.5 leading-relaxed">{caption}</p>
            )}
            <TabAd key="visual" slotId="5188867248" />
          </div>
        )}

        {/* Fun fact */}
        {activeTab === 'fact' && (
          <div>
            <div className="bg-teal/[0.06] border border-teal/[0.18] rounded-xl px-4 py-3.5">
              <p className="text-[10px] text-teal font-semibold tracking-widest uppercase mb-1.5">
                {t('did_you_know')}
              </p>
              <p className="text-[13px] text-cream/82 leading-relaxed">{answer.funFact}</p>
            </div>

            {(answer.sources || []).length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-white/[0.06]">
                <p className="text-[10px] text-muted font-semibold tracking-widest uppercase mb-2">
                  {t('sources')}
                </p>
                {answer.sources.map((s, i) => (
                  <div key={i} className="flex gap-1.5 items-start mb-1">
                    <div className="w-1 h-1 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                    <p className="text-[11px] text-muted">{s}</p>
                  </div>
                ))}
              </div>
            )}

            <TabAd key="fact" slotId="7481048157" />
          </div>
        )}
      </div>

      {/* ── Action bar ── */}
      <div className="px-5 py-3.5 border-t border-white/[0.06] flex items-center gap-2.5">
        <button
          onClick={onShare}
          className="flex-1 bg-gold text-sky border-none rounded-full py-2.5 px-4 font-body text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-gold2 hover:scale-[1.02] transition-all"
        >
          {t('share_answer')}
        </button>
        <button
          onClick={onReset}
          className="bg-transparent border border-white/[0.13] text-muted rounded-full py-2.5 px-4 font-body text-xs cursor-pointer whitespace-nowrap hover:border-cream hover:text-cream transition-all"
        >
          {t('ask_another')}
        </button>
      </div>
    </div>
  )
}

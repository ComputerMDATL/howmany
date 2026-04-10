export const SHARE_STYLES = [
  { bg1: '#0B1A2E', bg2: '#1E2D47', acc: '#F5C842', txt: '#F8F4EC', muted: 'rgba(248,244,236,0.5)', border: 'rgba(245,200,66,0.2)',   dark: true  },
  { bg1: '#120228', bg2: '#2a0d52', acc: '#C084FC', txt: '#F8F4EC', muted: 'rgba(248,244,236,0.5)', border: 'rgba(192,132,252,0.25)', dark: true  },
  { bg1: '#062015', bg2: '#0d3d25', acc: '#00C9A7', txt: '#F8F4EC', muted: 'rgba(248,244,236,0.5)', border: 'rgba(0,201,167,0.25)',   dark: true  },
  { bg1: '#150700', bg2: '#3d1800', acc: '#F59842', txt: '#F8F4EC', muted: 'rgba(248,244,236,0.5)', border: 'rgba(245,152,66,0.25)',  dark: true  },
  { bg1: '#F8F4EC', bg2: '#EDE8DC', acc: '#0B1A2E', txt: '#0B1A2E', muted: 'rgba(11,26,46,0.45)',  border: 'rgba(11,26,46,0.12)',    dark: false },
]

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function drawShareCard(canvasEl, { question = '', answer = null, styleIndex = 0 }) {
  const W = 1200, H = 630
  const st  = SHARE_STYLES[styleIndex]
  const ctx = canvasEl.getContext('2d')
  ctx.clearRect(0, 0, W, H)

  const g = ctx.createLinearGradient(0, 0, W * 0.7, H)
  g.addColorStop(0, st.bg1); g.addColorStop(1, st.bg2)
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

  if (st.dark) {
    for (let i = 0; i < 80; i++) {
      const x = (Math.sin(i * 127.1) * 0.5 + 0.5) * W
      const y = (Math.sin(i * 311.7) * 0.5 + 0.5) * H * 0.65
      const r = 0.6 + (Math.sin(i * 53.3) * 0.5 + 0.5) * 1.6
      const a = 0.15 + (Math.sin(i * 91.7) * 0.5 + 0.5) * 0.55
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
    }
  }

  ctx.save(); ctx.globalAlpha = 0.06
  ctx.beginPath(); ctx.arc(W - 60, H * 0.15, 300, 0, Math.PI * 2)
  ctx.fillStyle = st.acc; ctx.fill(); ctx.restore()

  ctx.fillStyle = st.acc; ctx.globalAlpha = 0.55
  ctx.fillRect(0, 0, W, 4); ctx.globalAlpha = 1

  ctx.font = "900 40px 'Fraunces', serif"; ctx.fillStyle = st.acc
  ctx.fillText('How', 60, 62)
  const hw = ctx.measureText('How ').width
  ctx.font = "italic 400 40px 'Fraunces', serif"; ctx.fillStyle = st.txt
  ctx.fillText('many', 60 + hw, 62)
  ctx.font = "900 40px 'Fraunces', serif"; ctx.fillStyle = st.acc
  ctx.fillText('?', 60 + hw + ctx.measureText('many').width, 62)

  ctx.font = "500 30px 'DM Sans', sans-serif"; ctx.fillStyle = st.muted
  let qLine = question || 'How many?'
  while (ctx.measureText(qLine).width > W - 120 && qLine.length > 10) qLine = qLine.slice(0, -1)
  if (qLine.length < question.length) qLine = qLine.trimEnd() + '…'
  ctx.fillText(qLine, 60, 138)

  let fs = 130; ctx.font = `900 ${fs}px 'Fraunces', serif`
  const aStr = answer?.answer || '—'
  while (ctx.measureText(aStr).width > W - 130 && fs > 50) {
    fs -= 8; ctx.font = `900 ${fs}px 'Fraunces', serif`
  }
  ctx.fillStyle = st.acc; ctx.fillText(aStr, 60, 138 + fs * 0.9)

  if (answer?.unit) {
    ctx.font = "500 28px 'DM Sans', sans-serif"
    ctx.fillStyle = st.txt; ctx.globalAlpha = 0.75
    ctx.fillText(answer.unit, 64, 138 + fs * 0.9 + 42)
    ctx.globalAlpha = 1
  }

  const fact = answer?.funFact || ''
  if (fact) {
    const pX = 60, pY = H - 136, pW = W - 120, pH = 76
    rr(ctx, pX, pY, pW, pH, 14)
    ctx.fillStyle = st.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; ctx.fill()
    ctx.strokeStyle = st.border; ctx.lineWidth = 1; ctx.stroke()
    ctx.font = "600 13px 'DM Sans', sans-serif"; ctx.fillStyle = st.acc
    ctx.fillText('DID YOU KNOW?', pX + 20, pY + 26)
    ctx.font = "400 17px 'DM Sans', sans-serif"; ctx.fillStyle = st.txt; ctx.globalAlpha = 0.82
    let fl = fact
    while (ctx.measureText(fl).width > pW - 48 && fl.length > 15) fl = fl.slice(0, -1)
    if (fl.length < fact.length) fl = fl.trimEnd() + '…'
    ctx.fillText(fl, pX + 20, pY + 56); ctx.globalAlpha = 1
  }

  ctx.font = "500 18px 'DM Sans', sans-serif"; ctx.fillStyle = st.muted
  ctx.fillText('howmany.app', 60, H - 34)
  ctx.fillStyle = st.acc; ctx.globalAlpha = 0.12
  ctx.fillRect(W - 6, 0, 6, H); ctx.globalAlpha = 1
}

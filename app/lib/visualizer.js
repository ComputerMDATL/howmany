/**
 * lib/visualizer.js
 * Draws the "Picture it" canvas — 5 templates.
 * Pure Canvas 2D, no dependencies.
 */

function rrCtx(ctx, x, y, w, h, r) {
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

const TEMPLATES = {
  stack(ctx, W, H, comps) {
    const maxV = Math.max(...comps.map(c => c.value), 1)
    const bH = 24, gap = 9, lW = 150, sX = 4, mBW = W - sX - lW - 8
    comps.forEach((c, i) => {
      const y  = 8 + i * (bH + gap)
      const bW = Math.max(4, (c.value / maxV) * mBW)
      ctx.fillStyle = c.color || 'rgba(255,255,255,0.1)'
      rrCtx(ctx, sX, y, bW, bH, 5); ctx.fill()
      ctx.font = '400 11px "DM Sans", sans-serif'
      ctx.fillStyle = 'rgba(11,26,46,0.9)'
      if (bW > 45) ctx.fillText(c.value.toLocaleString(), sX + 7, y + bH / 2 + 4)
      ctx.fillStyle = 'rgba(248,244,236,0.55)'
      ctx.fillText(c.label, sX + mBW + 8, y + bH / 2 + 4)
    })
    return 'Bar widths are proportional to the values.'
  },
  ruler(ctx, W, H, comps) {
    const rY = H / 2, rX = 16, rW = W - 32
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; rrCtx(ctx, rX, rY - 5, rW, 10, 5); ctx.fill()
    ctx.fillStyle = 'rgba(245,200,66,0.15)';  rrCtx(ctx, rX, rY - 5, rW, 10, 5); ctx.fill()
    for (let t = 0; t <= 10; t++) {
      const px = rX + (t / 10) * rW
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(px, rY - 10); ctx.lineTo(px, rY + 10); ctx.stroke()
    }
    ctx.strokeStyle = '#F5C842'; ctx.lineWidth = 2
    ;[rX, rX + rW].forEach((px, i) => {
      ctx.beginPath(); ctx.moveTo(px, rY - 14); ctx.lineTo(px, rY + 14); ctx.stroke()
      ctx.font = '500 11px "DM Sans", sans-serif'; ctx.fillStyle = '#F5C842'
      ctx.textAlign = i === 0 ? 'left' : 'right'
      ctx.fillText(comps[i]?.label || '', px + (i === 0 ? 2 : -2), rY + 26)
    })
    ctx.textAlign = 'center'; ctx.font = '400 11px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(248,244,236,0.4)'
    ctx.fillText('← to scale →', rX + rW / 2, rY - 20)
    ctx.textAlign = 'left'
    return 'Ruler drawn to scale across the full width.'
  },
  people(ctx, W, H, comps) {
    const comf = comps[0]?.value || 4
    const mx   = comps[comps.length - 1]?.value || 14
    const pW = 16, pH = 28, gap = 4
    const cols = Math.floor((W - 32) / (pW + gap))
    const rows = Math.ceil(mx / cols)
    const sX = 16, sY = (H - rows * (pH + gap)) / 2
    for (let i = 0; i < mx; i++) {
      const col = Math.floor(i / rows), row = i % rows
      const x = sX + col * (pW + gap), y = sY + row * (pH + gap)
      ctx.fillStyle = i < comf ? '#00C9A7' : 'rgba(255,255,255,0.12)'
      ctx.beginPath(); ctx.arc(x + pW / 2, y + 5, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillRect(x + pW / 2 - 3, y + 10, 6, 9)
      ctx.fillRect(x + pW / 2 - 3, y + 20, 2.5, 8)
      ctx.fillRect(x + pW / 2 + 0.5, y + 20, 2.5, 8)
    }
    ctx.font = '400 10px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(248,244,236,0.45)'
    ctx.fillText(`Teal = ${comf} comfortable   Gray = ${mx} world record`, 16, H - 8)
    return 'Each figure = one person. Teal = comfortable, gray = max.'
  },
  journey(ctx, W, H, comps) {
    const maxV = Math.max(...comps.map(c => c.value), 1)
    const bH = 24, gap = 9, lW = 160, sX = 4, mBW = W - sX - lW - 8
    comps.forEach((c, i) => {
      const y  = 8 + i * (bH + gap)
      const bW = Math.max(4, (c.value / maxV) * mBW)
      ctx.fillStyle = c.color || 'rgba(255,255,255,0.1)'
      rrCtx(ctx, sX, y, bW, bH, 5); ctx.fill()
      ctx.font = '400 11px "DM Sans", sans-serif'
      ctx.fillStyle = 'rgba(11,26,46,0.9)'
      if (bW > 50) ctx.fillText(c.value.toLocaleString(), sX + 7, y + bH / 2 + 4)
      ctx.fillStyle = 'rgba(248,244,236,0.55)'
      ctx.fillText(c.label, sX + mBW + 8, y + bH / 2 + 4)
    })
    return 'Bars proportional — compares to relatable distances.'
  },
  starfield(ctx, W, H, _comps, answer) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; rrCtx(ctx, 0, 0, W, H, 8); ctx.fill()
    for (let i = 0; i < 500; i++) {
      const x = (Math.sin(i * 127.1) * 0.5 + 0.5) * W
      const y = (Math.sin(i * 311.7) * 0.5 + 0.5) * H
      const r = 0.3 + (Math.sin(i * 53.3) * 0.5 + 0.5) * 1.1
      const a = 0.1 + (Math.sin(i * 91.7) * 0.5 + 0.5) * 0.7
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
    }
    for (let i = 0; i < 10; i++) {
      const x = (Math.sin(i * 251.3) * 0.5 + 0.5) * W
      const y = (Math.sin(i * 173.9) * 0.5 + 0.5) * H
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(245,200,66,0.8)'; ctx.fill()
    }
    ctx.textAlign = 'center'
    ctx.font = '700 22px "Fraunces", serif'; ctx.fillStyle = '#F5C842'
    ctx.fillText(answer?.answer || '', W / 2, H / 2 - 4)
    ctx.font = '400 11px "DM Sans", sans-serif'; ctx.fillStyle = 'rgba(248,244,236,0.5)'
    ctx.fillText(answer?.unit || '', W / 2, H / 2 + 14)
    ctx.textAlign = 'left'
    return 'Each dot represents many millions — the scale is impossible to show literally.'
  },
}

export function drawVisualizer(canvasEl, ans) {
  if (!canvasEl) return ''
  const vt    = ans.visualType || 'stack'
  const comps = (ans.comparisons || []).map(c => ({
    ...c,
    value: Number(String(c.value).replace(/,/g, '')) || 0,
  }))
  const dpr = window.devicePixelRatio || 1
  const CW  = canvasEl.offsetWidth || 600
  const CH  = 160
  canvasEl.width  = CW * dpr
  canvasEl.height = CH * dpr
  const ctx = canvasEl.getContext('2d')
  ctx.scale(dpr, dpr)
  return (TEMPLATES[vt] || TEMPLATES.stack)(ctx, CW, CH, comps, ans)
}

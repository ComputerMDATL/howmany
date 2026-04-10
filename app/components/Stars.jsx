'use client'
import { useMemo } from 'react'

export default function Stars() {
  const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
    id:    i,
    size:  Math.random() * 2.2 + 0.5,
    left:  Math.random() * 100,
    top:   Math.random() * 100,
    d:     2 + Math.random() * 4,
    delay: -(Math.random() * 5),
    lo:    0.05 + Math.random() * 0.12,
    hi:    0.35 + Math.random() * 0.55,
  })), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            width:  s.size,
            height: s.size,
            left:   `${s.left}%`,
            top:    `${s.top}%`,
            '--d':     `${s.d}s`,
            '--delay': `${s.delay}s`,
            '--lo':    s.lo,
            '--hi':    s.hi,
          }}
        />
      ))}
    </div>
  )
}

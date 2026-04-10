'use client'

import { useState, useRef, useCallback } from 'react'

const EVERY = 3

export function useInterstitial() {
  const countRef  = useRef(0)
  const [visible,   setVisible]   = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [canSkip,   setCanSkip]   = useState(false)
  const timerRef   = useRef(null)
  const onDoneRef  = useRef(null)

  const maybeShow = useCallback((onDone) => {
    countRef.current += 1
    if (countRef.current % EVERY !== 0) { onDone(); return }

    onDoneRef.current = onDone
    setVisible(true)
    setCountdown(5)
    setCanSkip(false)

    let sec = 5
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      sec -= 1
      setCountdown(sec)
      if (sec <= 0) { clearInterval(timerRef.current); setCanSkip(true) }
    }, 1000)
  }, [])

  const skip = useCallback(() => {
    if (!canSkip) return
    clearInterval(timerRef.current)
    setVisible(false)
    onDoneRef.current?.()
  }, [canSkip])

  const untilNext    = EVERY - (countRef.current % EVERY)
  const showingCounter = untilNext < EVERY

  return { visible, countdown, canSkip, skip, maybeShow, showingCounter, untilNext }
}

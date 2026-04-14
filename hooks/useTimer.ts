'use client'

import { useEffect, useState } from 'react'

export function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  const start = () => setIsActive(true)
  const pause = () => setIsActive(false)
  const resume = () => setIsActive(true)
  const reset = () => {
    setIsActive(false)
    setElapsed(0)
  }

  const formatTime = () => {
    const hours = Math.floor(elapsed / 3600)
    const minutes = Math.floor((elapsed % 3600) / 60)
    const seconds = elapsed % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    elapsed,
    isActive,
    start,
    pause,
    resume,
    reset,
    formatTime,
  }
}

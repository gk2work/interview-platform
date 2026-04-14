'use client'

import { useEffect, useRef, useState } from 'react'

export function useAudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const [isVisualizing, setIsVisualizing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const initializeVisualizer = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = context.createAnalyser()
        const source = context.createMediaStreamSource(stream)

        source.connect(analyser)
        analyzerRef.current = analyser
        analyser.fftSize = 256

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
          if (!analyzerRef.current || !isVisualizing) {
            animationRef.current = null
            return
          }

          analyzerRef.current.getByteFrequencyData(dataArray)

          const ctx = canvas.getContext('2d')
          if (!ctx) return

          ctx.fillStyle = '#0A0F1C'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const barWidth = (canvas.width / bufferLength) * 2.5
          let barHeight
          let x = 0

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * canvas.height

            ctx.fillStyle = '#3B82F6'
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

            x += barWidth + 1
          }

          animationRef.current = requestAnimationFrame(draw)
        }

        if (isVisualizing) {
          draw()
        }
      } catch (error) {
        console.error('Error initializing audio visualizer:', error)
      }
    }

    if (isVisualizing) {
      initializeVisualizer()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisualizing])

  const start = () => setIsVisualizing(true)
  const stop = () => setIsVisualizing(false)

  return {
    canvasRef,
    start,
    stop,
    isVisualizing,
  }
}

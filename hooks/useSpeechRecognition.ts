'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null

interface UseSpeechRecognitionReturn {
  transcript: string
  interimTranscript: string
  isListening: boolean
  startListening: (onEnd?: () => void) => void
  stopListening: () => void
  error: string | null
  isSupported: boolean
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  // Called when recognition finally stops (only when stopListening is called explicitly)
  const onEndRef = useRef<(() => void) | null>(null)
  // When true, auto-restart recognition on silence so the mic stays open
  const autoRestartRef = useRef(false)
  const isSupported = SpeechRecognition !== null

  useEffect(() => {
    if (!isSupported) return

    recognitionRef.current = new SpeechRecognition()
    const recognition = recognitionRef.current

    // continuous = false so we get clean result events; we manage looping ourselves
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const segment = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += segment + ' '
        } else {
          interim += segment
        }
      }

      setInterimTranscript(interim)
      if (final) setTranscript(prev => prev + final)
    }

    recognition.onerror = (event: any) => {
      // 'no-speech' and 'aborted' are expected — not user-facing errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Mic error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')

      if (autoRestartRef.current) {
        // Keep the mic alive — restart silently
        try {
          recognition.start()
          setIsListening(true)
        } catch {
          // ignore if already starting
        }
      } else {
        // Explicit stop — fire the completion callback
        const cb = onEndRef.current
        onEndRef.current = null
        cb?.()
      }
    }

    return () => {
      autoRestartRef.current = false
      recognition.abort()
    }
  }, [isSupported])

  const startListening = useCallback(
    (onEnd?: () => void) => {
      if (!isSupported || !recognitionRef.current) return
      onEndRef.current = onEnd || null
      autoRestartRef.current = true
      setTranscript('')
      setInterimTranscript('')
      try {
        recognitionRef.current.start()
      } catch {
        // already started
      }
    },
    [isSupported]
  )

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return
    autoRestartRef.current = false // disable auto-restart so onend fires the callback
    try {
      recognitionRef.current.stop()
    } catch {
      // ignore
    }
  }, [isSupported])

  return {
    transcript,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    error,
    isSupported,
  }
}

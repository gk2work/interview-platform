'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSpeechSynthesisReturn {
  speak: (text: string, onEnd?: () => void) => void
  stop: () => void
  isSpeaking: boolean
  voices: SpeechSynthesisVoice[]
  isSupported: boolean
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  // Use a ref so speak() always has the latest voices without being recreated
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const onEndCallbackRef = useRef<(() => void) | null>(null)
  // Tracks intentional cancellation so a cancelled utterance's onend
  // doesn't continue the chunk chain or fire the completion callback
  const cancelledRef = useRef(false)
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!isSupported) return

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices()
      voicesRef.current = available
      setVoices(available)
    }

    updateVoices()
    window.speechSynthesis.onvoiceschanged = updateVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [isSupported])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!isSupported) return

      // Mark previous chain as cancelled before cancelling so its onend won't continue
      cancelledRef.current = true
      window.speechSynthesis.cancel()
      cancelledRef.current = false

      setIsSpeaking(true)
      onEndCallbackRef.current = onEnd || null

      // Split into sentences to avoid Chrome's 15-second utterance cut-off
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

      const speakChunk = (index: number) => {
        if (cancelledRef.current) return

        if (index >= sentences.length) {
          setIsSpeaking(false)
          const cb = onEndCallbackRef.current
          onEndCallbackRef.current = null
          cb?.()
          return
        }

        const utterance = new SpeechSynthesisUtterance(sentences[index].trim())
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0

        const englishVoice =
          voicesRef.current.find(v => v.lang.startsWith('en-US')) || voicesRef.current[0]
        if (englishVoice) utterance.voice = englishVoice

        utterance.onend = () => {
          if (!cancelledRef.current) speakChunk(index + 1)
        }

        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          // 'interrupted' is thrown when cancel() is called — expected, not an error
          if (event.error !== 'interrupted') {
            console.error('Speech synthesis error:', event.error)
            setIsSpeaking(false)
          }
        }

        window.speechSynthesis.speak(utterance)
      }

      speakChunk(0)
    },
    [isSupported]
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    onEndCallbackRef.current = null
  }, [isSupported])

  return { speak, stop, isSpeaking, voices, isSupported }
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { useTimer } from '@/hooks/useTimer'
import { useInterviewSession } from '@/hooks/useInterviewSession'
import { Square, PhoneOff } from 'lucide-react'

const SILENCE_TIMEOUT_MS = 12000 // 12 seconds of mic-open time before auto-submit

export default function InterviewPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const { session, messages, isLoading, loadSession, sendMessage } = useInterviewSession()
  const { transcript, interimTranscript, isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition()
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
  const { formatTime, start: startTimer } = useTimer()

  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [statusText, setStatusText] = useState('Loading interview...')

  // ── Refs ─────────────────────────────────────────────────────────────────
  // Use a ref (not state) so setting it never triggers a re-render / re-running effects
  const hasAutoStartedRef = useRef(false)
  // Silence timer — stored in a ref so it's stable across renders
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Prevent double-submission if both the silence timer and onEnd callback fire
  const isSubmittingRef = useRef(false)
  // Mirror transcript/interimTranscript so handleSendMessage always reads the latest value
  // (avoids stale closure inside the silence timer callback)
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  // Keep transcript refs in sync with state
  useEffect(() => { transcriptRef.current = transcript }, [transcript])
  useEffect(() => { interimRef.current = interimTranscript }, [interimTranscript])

  // Always point to the latest handleSendMessage so the silence timer callback never goes stale
  const handleSendMessageRef = useRef<() => void>(() => {})

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  /**
   * Start the mic and set a silence deadline.
   * After SILENCE_TIMEOUT_MS with no manual submission, auto-submit.
   */
  const startListeningPhase = () => {
    clearSilenceTimer()

    // startListening keeps the mic open (auto-restarts on silence).
    // When stopListening() is called, the onEnd callback below fires.
    startListening(() => {
      // This fires only when stopListening() is called explicitly (silence timer or user click).
      handleSendMessageRef.current()
    })

    silenceTimerRef.current = setTimeout(() => {
      silenceTimerRef.current = null
      stopListening() // → triggers onEnd → handleSendMessage
    }, SILENCE_TIMEOUT_MS)
  }

  // ── Load session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return

    const initialize = async () => {
      try {
        await loadSession(sessionId)
        startTimer()
        setIsInitialized(true)
      } catch {
        setError('Failed to load session')
      }
    }

    initialize()
  }, [sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-start: speak first AI message then open the mic ─────────────────
  // Uses hasAutoStartedRef so re-renders (from isSpeaking, messages, etc.) never retrigger this.
  useEffect(() => {
    if (!isInitialized || !session || hasAutoStartedRef.current) return

    const firstAiMessage = messages.find(m => m.role === 'interviewer')
    if (!firstAiMessage) return

    hasAutoStartedRef.current = true // set immediately — no state update, no re-render
    setStatusText('Meriam is speaking…')

    speak(firstAiMessage.content, () => {
      setStatusText('Your turn — speak now')
      startListeningPhase()
    })
  }, [isInitialized, session, messages]) // speak/startListening NOT in deps — they're stable via useCallback

  // ── Core: send transcript to API ──────────────────────────────────────────
  const handleSendMessage = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true

    clearSilenceTimer()

    const fullTranscript = (transcriptRef.current + interimRef.current).trim()

    try {
      setStatusText('Processing your response…')
      const { response, isComplete } = await sendMessage(
        fullTranscript || '[Candidate had no audible response]'
      )

      if (isComplete) {
        setInterviewComplete(true)
        setStatusText('Interview complete — generating evaluation…')
        speak(response, () => {
          setTimeout(() => router.push(`/evaluation/${sessionId}`), 2000)
        })
        isSubmittingRef.current = false
        return
      }

      setStatusText('Meriam is speaking…')
      speak(response, () => {
        setStatusText('Your turn — speak now')
        isSubmittingRef.current = false
        startListeningPhase()
      })
    } catch {
      setError('Failed to send message — please try again')
      isSubmittingRef.current = false
    }
  }

  // Keep the ref pointing to the latest version every render
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage
  })

  // ── Manual controls ───────────────────────────────────────────────────────
  const handleManualSend = () => {
    clearSilenceTimer()
    stopListening() // → onEnd fires → handleSendMessage (via ref)
  }

  const handleEndInterview = async () => {
    clearSilenceTimer()
    stopSpeaking()
    stopListening()
    router.push(`/evaluation/${sessionId}`)
  }

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearSilenceTimer()
    }
  }, [])

  // ── Unsupported browser ───────────────────────────────────────────────────
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-rose">Browser Not Supported</h1>
          <p className="text-slate-300 mb-6">
            Voice interviews require Chrome, Edge, or Safari. Please switch browsers.
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </Card>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading interview…</p>
        </div>
      </div>
    )
  }

  const currentState = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'

  return (
    <div className="min-h-screen bg-navy py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              {session?.interviewConfig.designation}
            </h1>
            <p className="text-slate-400">{session?.interviewConfig.company}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Time</p>
            <p className="text-2xl font-heading font-bold">{formatTime()}</p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-rose/10 border-rose/50">
            <p className="text-rose">{error}</p>
          </Card>
        )}

        {/* AI Avatar & Status */}
        <Card className="mb-8 text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue to-emerald flex items-center justify-center">
            <div
              className={`text-4xl transition-all ${
                isSpeaking
                  ? 'animate-pulse-soft'
                  : currentState === 'listening'
                  ? 'animate-bounce'
                  : ''
              }`}
            >
              🎤
            </div>
          </div>

          {interviewComplete ? (
            <div>
              <p className="text-2xl font-heading font-bold mb-2">Interview Complete!</p>
              <p className="text-slate-400 mb-6">Generating your evaluation…</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold mb-3 text-white">{statusText}</p>
              <Badge
                variant={
                  currentState === 'speaking'
                    ? 'primary'
                    : currentState === 'listening'
                    ? 'success'
                    : 'info'
                }
              >
                {currentState === 'speaking' && 'Meriam is speaking…'}
                {currentState === 'listening' && 'Listening — speak now'}
                {currentState === 'idle' && isLoading ? 'Processing…' : 'Ready'}
              </Badge>

              {isListening && (
                <p className="text-xs text-slate-500 mt-3">
                  Mic will auto-submit after{' '}
                  {Math.round(SILENCE_TIMEOUT_MS / 1000)}s — or press Send when done
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Conversation */}
        <Card className="mb-8 max-h-96 overflow-y-auto">
          <h3 className="font-heading font-bold mb-4">Conversation</h3>
          <div className="space-y-4">
            {messages
              .filter(m => m.role !== 'system')
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      msg.role === 'interviewer'
                        ? 'bg-blue/20 text-blue border border-blue/50'
                        : 'bg-emerald/20 text-emerald border border-emerald/50'
                    }`}
                  >
                    <p className="text-xs font-bold mb-1 opacity-70">
                      {msg.role === 'interviewer' ? 'Meriam' : 'You'}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Live transcript */}
        {isListening && (transcript || interimTranscript) && (
          <Card className="mb-8 bg-blue/10 border-blue/50">
            <p className="text-sm text-slate-400 mb-2">You are saying:</p>
            <p className="text-white">
              {transcript}
              {interimTranscript && (
                <span className="text-slate-400 animate-pulse"> {interimTranscript}</span>
              )}
            </p>
          </Card>
        )}

        {/* Controls */}
        {!interviewComplete && (
          <div className="flex gap-4 justify-center flex-wrap">
            {isListening && (
              <Button
                variant="success"
                size="lg"
                onClick={handleManualSend}
                className="flex items-center gap-2"
              >
                <Square size={20} /> Send Response
              </Button>
            )}

            <Button
              variant="danger"
              size="lg"
              onClick={handleEndInterview}
              className="flex items-center gap-2"
            >
              <PhoneOff size={20} /> End Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

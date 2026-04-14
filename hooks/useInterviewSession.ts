'use client'

import { useState, useCallback } from 'react'
import { ISession, IMessage } from '@/types'

interface UseInterviewSessionReturn {
  session: ISession | null
  messages: IMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (message: string) => Promise<{ response: string; isComplete: boolean }>
  loadSession: (sessionId: string) => Promise<void>
}

export function useInterviewSession(): UseInterviewSessionReturn {
  const [session, setSession] = useState<ISession | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (!response.ok) throw new Error('Failed to load session')

      const data = await response.json()
      setSession(data.session)
      setMessages(data.messages || [])
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!session) throw new Error('No active session')

      try {
        setIsLoading(true)
        const response = await fetch('/api/interview/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session._id,
            message,
          }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const data = await response.json()
        setMessages(prev => [...prev, ...data.newMessages])

        return {
          response: data.response,
          isComplete: data.isComplete,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [session]
  )

  return {
    session,
    messages,
    isLoading,
    error,
    sendMessage,
    loadSession,
  }
}

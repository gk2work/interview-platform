'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getRecommendationColor } from '@/lib/constants'
import { Calendar, Zap } from 'lucide-react'

interface Session {
  _id: string
  interviewConfig: {
    company: string
    designation: string
    interviewType: string
  }
  status: string
  createdAt: string
  evaluation?: {
    overallScore: number
    recommendation: string
  }
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetch('/api/sessions')
        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error('Failed to load sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading interviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">Interview History</h1>
            <p className="text-slate-400">{sessions.length} interviews completed</p>
          </div>
          <Button variant="primary" onClick={() => router.push('/setup')}>
            + New Interview
          </Button>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-300 mb-6">No interviews yet. Start your first interview!</p>
            <Button variant="primary" onClick={() => router.push('/setup')}>
              Start First Interview
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <Card
                key={session._id}
                className="cursor-pointer hover:border-blue/50 transition"
                onClick={() =>
                  session.status === 'evaluated'
                    ? router.push(`/evaluation/${session._id}`)
                    : router.push(`/interview/${session._id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-heading font-bold">
                        {session.interviewConfig.designation}
                      </h3>
                      <Badge variant="info">{session.interviewConfig.company}</Badge>
                      <Badge variant="primary">{session.interviewConfig.interviewType}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        Status:{' '}
                        <Badge
                          variant={
                            session.status === 'evaluated'
                              ? 'success'
                              : session.status === 'completed'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {session.status}
                        </Badge>
                      </span>
                    </div>
                  </div>

                  {session.evaluation && (
                    <div className="text-right">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="text-emerald" size={20} />
                        <span className="text-3xl font-heading font-bold text-blue">
                          {session.evaluation.overallScore.toFixed(1)}
                        </span>
                      </div>
                      <Badge variant="success">{session.evaluation.recommendation}</Badge>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

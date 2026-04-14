'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { getRecommendationColor } from '@/lib/constants'
import { BarChart3, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

interface IEvaluation {
  _id: string
  scores: Record<string, { score: number; maxScore: number; feedback: string }>
  overallScore: number
  overallGrade: string
  recommendation: string
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
  suggestedTopics: string[]
}

const POLL_INTERVAL_MS = 2000  // poll every 2 seconds
const MAX_WAIT_MS = 120_000    // give up after 2 minutes

export default function EvaluationPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [evaluation, setEvaluation] = useState<IEvaluation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use refs so cleanup is reliable across React re-renders and Strict Mode double-invoke
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const isMountedRef = useRef(true)
  // Prevents two concurrent GPT evaluation calls (React Strict Mode fires useEffect twice in dev)
  const evaluationTriggeredRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    startTimeRef.current = Date.now()

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    // Trigger evaluation generation once — idempotent on the server, but we also guard here
    // to avoid two concurrent GPT calls when React Strict Mode double-fires this effect.
    const triggerEvaluation = async () => {
      if (evaluationTriggeredRef.current) return
      evaluationTriggeredRef.current = true
      try {
        await fetch('/api/interview/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
      } catch {
        // non-fatal — polling will pick up the result if it was already generated
      }
    }

    const poll = async () => {
      if (!isMountedRef.current) return

      try {
        const response = await fetch(`/api/sessions/${sessionId}`)
        if (!response.ok) throw new Error('Failed to load evaluation')

        const data = await response.json()

        if (!isMountedRef.current) return

        if (data.evaluation) {
          setEvaluation(data.evaluation)
          setIsLoading(false)
          return // done — no more polling
        }

        // Check if we've waited too long
        if (Date.now() - startTimeRef.current >= MAX_WAIT_MS) {
          setError('Evaluation is taking longer than expected. Please refresh the page.')
          setIsLoading(false)
          return
        }

        // Schedule next poll
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
      } catch (err) {
        if (!isMountedRef.current) return
        setError(err instanceof Error ? err.message : 'Failed to load evaluation')
        setIsLoading(false)
      }
    }

    // Trigger generation first, then start polling
    triggerEvaluation().then(() => {
      if (isMountedRef.current) poll()
    })

    return () => {
      isMountedRef.current = false
      clearTimer()
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300 mb-2">Generating your evaluation…</p>
            <p className="text-slate-500 text-sm">This usually takes 10–20 seconds</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !evaluation) {
    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <Navbar />
        <div className="flex-1 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center py-12 bg-rose/10 border-rose/50">
              <p className="text-rose mb-6">{error || 'Evaluation not found'}</p>
              <Button variant="primary" onClick={() => router.push('/setup')}>
                Start New Interview
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const scoreCategories = Object.entries(evaluation.scores)
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'success'
    if (score >= 6) return 'warning'
    return 'danger'
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />
      <div className="flex-1 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/history')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to History
        </Button>

        {/* Overall Score */}
        <Card className="mb-8 bg-gradient-to-br from-blue/20 to-emerald/20 border-blue/50">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-slate-400 mb-2">Overall Score</p>
              <h1 className="text-5xl font-heading font-bold text-blue">
                {evaluation.overallScore.toFixed(1)}
                <span className="text-2xl text-slate-400">/10</span>
              </h1>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Grade</p>
              <p className="text-5xl font-heading font-bold text-emerald">
                {evaluation.overallGrade}
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Recommendation</p>
              <Badge variant="primary" className="text-lg px-4 py-2">
                {evaluation.recommendation}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Category Scores */}
        <Card className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={24} /> Category Breakdown
          </h2>
          <div className="space-y-6">
            {scoreCategories.map(([category, { score, feedback, maxScore }]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-lg font-bold text-blue">
                    {score}/{maxScore}
                  </p>
                </div>
                <Progress value={score} max={maxScore} variant={getScoreColor(score)} />
                <p className="text-sm text-slate-400 mt-2">{feedback}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <h3 className="text-xl font-heading font-bold mb-4 text-emerald">Strengths</h3>
            <ul className="space-y-3">
              {evaluation.strengths.map((s, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-emerald font-bold mt-1">✓</span>
                  <span className="text-slate-300">{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-heading font-bold mb-4 text-amber">Areas to Improve</h3>
            <ul className="space-y-3">
              {evaluation.improvements.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-amber font-bold mt-1">→</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <h3 className="text-xl font-heading font-bold mb-4">Feedback</h3>
          <p className="text-slate-300 leading-relaxed">{evaluation.detailedFeedback}</p>
        </Card>

        {/* Suggested Topics */}
        <Card className="mb-8">
          <h3 className="text-xl font-heading font-bold mb-4">Suggested Study Topics</h3>
          <div className="flex flex-wrap gap-2">
            {evaluation.suggestedTopics.map((topic, idx) => (
              <Badge key={idx} variant="info">
                {topic}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => router.push('/setup')}>
            Start New Interview
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.push('/history')}>
            View History
          </Button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

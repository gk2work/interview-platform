import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { Evaluation } from '@/models/Evaluation'
import { buildEvaluation } from '@/lib/evaluator'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authSession = await getServerSession(authOptions)
  if (!authSession?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Return immediately if already evaluated — fast path
    const existing = await Evaluation.findOne({ sessionId })
    if (existing) return NextResponse.json(existing)

    const session = await Session.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.userId && session.userId.toString() !== authSession.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 })

    const evaluationData = await buildEvaluation(
      session.toObject(),
      messages.map(m => m.toObject())
    )

    try {
      const savedEvaluation = await Evaluation.create(evaluationData)
      await Session.findByIdAndUpdate(sessionId, { status: 'evaluated' })
      return NextResponse.json(savedEvaluation)
    } catch (createError: any) {
      // E11000 — concurrent request already inserted; return existing
      if (createError?.code === 11000) {
        const race = await Evaluation.findOne({ sessionId })
        if (race) return NextResponse.json(race)
      }
      throw createError
    }
  } catch (error) {
    console.error('Error evaluating interview:', error)
    return NextResponse.json({ error: 'Failed to generate evaluation' }, { status: 500 })
  }
}

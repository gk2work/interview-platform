import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { Evaluation } from '@/models/Evaluation'
import { buildEvaluation } from '@/lib/evaluator'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Return immediately if already evaluated — fast path
    const existing = await Evaluation.findOne({ sessionId })
    if (existing) {
      return NextResponse.json(existing)
    }

    // Fetch session
    const session = await Session.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch messages
    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 })

    // Generate evaluation via GPT
    const evaluationData = await buildEvaluation(
      session.toObject(),
      messages.map(m => m.toObject())
    )

    try {
      const savedEvaluation = await Evaluation.create(evaluationData)

      // Mark session as evaluated
      await Session.findByIdAndUpdate(sessionId, { status: 'evaluated' })

      return NextResponse.json(savedEvaluation)
    } catch (createError: any) {
      // E11000 = duplicate key: another concurrent request already inserted the evaluation.
      // Return the existing document instead of crashing.
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

import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { Evaluation } from '@/models/Evaluation'
import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDB()

    const session = await Session.findById(params.sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const messages = await Message.find({ sessionId: params.sessionId }).sort({ createdAt: 1 })
    const evaluation = await Evaluation.findOne({ sessionId: params.sessionId })

    return NextResponse.json({
      session,
      messages,
      evaluation,
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { buildSystemPrompt } from '@/lib/prompt-builder'
import { chatCompletion } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authSession = await getServerSession(authOptions)
  if (!authSession?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const body = await request.json()
    const { cvFilePath, cvParsedText, cvStructuredData, interviewConfig } = body

    if (!cvParsedText || !interviewConfig) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Credit check — deduct 1 credit atomically; fails if credits < 1
    const { User } = await import('@/models/User')
    const updatedUser = await User.findOneAndUpdate(
      { _id: authSession.user.id, credits: { $gte: 1 } },
      { $inc: { credits: -1 } },
      { new: true }
    )
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'NO_CREDITS', message: 'You have no interview credits remaining.' },
        { status: 402 }
      )
    }

    const systemPrompt = buildSystemPrompt({
      _id: '',
      cvFileName: cvFilePath?.split('/').pop() || 'resume.pdf',
      cvFilePath: cvFilePath || '',
      cvParsedText,
      cvStructuredData,
      interviewConfig,
      status: 'in-progress',
      systemPrompt: '',
      totalTurns: 0,
    })

    const session = new Session({
      userId: authSession.user.id,
      cvFileName: cvFilePath?.split('/').pop() || 'resume.pdf',
      cvFilePath: cvFilePath || '',
      cvParsedText,
      cvStructuredData,
      interviewConfig,
      status: 'in-progress',
      systemPrompt,
      totalTurns: 0,
      startedAt: new Date(),
    })

    await session.save()

    await Message.create({
      sessionId: session._id,
      role: 'system',
      content: systemPrompt,
      turnNumber: 0,
    })

    const greeting = await chatCompletion([], systemPrompt)

    await Message.create({
      sessionId: session._id,
      role: 'interviewer',
      content: greeting,
      turnNumber: 1,
    })

    return NextResponse.json({ sessionId: session._id, firstMessage: greeting })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

export async function GET() {
  const authSession = await getServerSession(authOptions)
  if (!authSession?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const sessions = await Session.find({ userId: authSession.user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

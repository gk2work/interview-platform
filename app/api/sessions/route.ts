import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { buildSystemPrompt } from '@/lib/prompt-builder'
import { chatCompletion } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { cvFilePath, cvParsedText, cvStructuredData, interviewConfig } = body

    if (!cvParsedText || !interviewConfig) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      _id: '',
      cvFileName: cvFilePath.split('/').pop() || 'resume.pdf',
      cvFilePath,
      cvParsedText,
      cvStructuredData,
      interviewConfig,
      status: 'in-progress',
      systemPrompt: '', // Will be set below
      totalTurns: 0,
    })

    // Create session
    const session = new Session({
      cvFileName: cvFilePath.split('/').pop() || 'resume.pdf',
      cvFilePath,
      cvParsedText,
      cvStructuredData,
      interviewConfig,
      status: 'in-progress',
      systemPrompt,
      totalTurns: 0,
      startedAt: new Date(),
    })

    await session.save()

    // Create system message
    await Message.create({
      sessionId: session._id,
      role: 'system',
      content: systemPrompt,
      turnNumber: 0,
    })

    // Generate first interviewer message (greeting)
    const greeting = await chatCompletion([], systemPrompt)

    // Save interviewer message
    await Message.create({
      sessionId: session._id,
      role: 'interviewer',
      content: greeting,
      turnNumber: 1,
    })

    return NextResponse.json({
      sessionId: session._id,
      firstMessage: greeting,
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

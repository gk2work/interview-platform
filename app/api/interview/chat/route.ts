import { connectDB } from '@/lib/mongodb'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { chatCompletion } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { sessionId, message: userMessage } = body

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch session
    const session = await Session.findById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Fetch existing messages
    const existingMessages = await Message.find({ sessionId }).sort({ createdAt: 1 })

    // Save user message
    const userMsgRecord = await Message.create({
      sessionId,
      role: 'candidate',
      content: userMessage,
      turnNumber: existingMessages.length,
    })

    // Build conversation history for GPT (keep recent messages)
    const recentMessages = existingMessages
      .slice(-10)
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.content,
      }))

    recentMessages.push({
      role: 'user',
      content: userMessage,
    })

    // Get AI response
    const aiResponse = await chatCompletion(recentMessages as any, session.systemPrompt)

    if (!aiResponse) {
      throw new Error('Empty response from GPT')
    }

    // Check if interview is complete
    const isComplete = aiResponse.includes('[INTERVIEW_COMPLETE]')
    const cleanedResponse = aiResponse.replace('[INTERVIEW_COMPLETE]', '').trim()

    // Save AI message
    const aiMsgRecord = await Message.create({
      sessionId,
      role: 'interviewer',
      content: cleanedResponse,
      turnNumber: existingMessages.length + 1,
    })

    // Update session
    await Session.findByIdAndUpdate(sessionId, {
      totalTurns: existingMessages.length + 2,
      status: isComplete ? 'completed' : 'in-progress',
      completedAt: isComplete ? new Date() : undefined,
    })

    return NextResponse.json({
      response: cleanedResponse,
      isComplete,
      newMessages: [userMsgRecord, aiMsgRecord],
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

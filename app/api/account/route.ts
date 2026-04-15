import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Session } from '@/models/Session'
import { Message } from '@/models/Message'
import { Evaluation } from '@/models/Evaluation'
import { NextResponse } from 'next/server'

// GET /api/account — return current user profile + stats
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const user = await User.findById(session.user.id).lean()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const totalSessions = await Session.countDocuments({ userId: session.user.id })
  const evaluatedSessions = await Session.countDocuments({
    userId: session.user.id,
    status: 'evaluated',
  })

  return NextResponse.json({ user, totalSessions, evaluatedSessions, credits: (user as { credits?: number }).credits ?? 0 })
}

// DELETE /api/account — wipe all user data and delete account
export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const userId = session.user.id

  // Find all sessions for this user
  const userSessions = await Session.find({ userId }).select('_id').lean()
  const sessionIds = userSessions.map(s => s._id)

  // Delete all related messages and evaluations
  await Message.deleteMany({ sessionId: { $in: sessionIds } })
  await Evaluation.deleteMany({ sessionId: { $in: sessionIds } })
  await Session.deleteMany({ userId })
  await User.findByIdAndDelete(userId)

  return NextResponse.json({ success: true })
}

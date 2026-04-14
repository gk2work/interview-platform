import { connectDB } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const db = await connectDB()
    const isConnected = db?.connection?.readyState === 1

    return NextResponse.json({
      status: 'ok',
      mongodb: isConnected ? 'connected' : 'disconnected',
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', mongodb: 'disconnected' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 499, // $4.99 in cents
          product_data: {
            name: '5 Interview Credits',
            description: 'Practice 5 more AI voice interviews on FormalMock',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      credits: '5',
    },
    success_url: `${appUrl}/pricing?success=true`,
    cancel_url:  `${appUrl}/pricing?cancelled=true`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}

'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, Zap, Mic, BarChart3, Clock } from 'lucide-react'

function PricingContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')

  // Fetch current credit balance
  useEffect(() => {
    if (!session) return
    fetch('/api/account')
      .then(r => r.json())
      .then(d => setCredits(d.credits ?? 0))
  }, [session])

  // Show toast after Stripe redirect
  useEffect(() => {
    if (success) setToast({ type: 'success', msg: '5 credits added to your account!' })
    if (cancelled) setToast({ type: 'error', msg: 'Payment cancelled. No charge was made.' })
  }, [success, cancelled])

  const handleBuy = async () => {
    if (!session) { router.push('/login'); return }
    setIsLoading(true)
    const res = await fetch('/api/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setToast({ type: 'error', msg: 'Could not start checkout. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />

      <div className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Toast */}
          {toast && (
            <div className={`mb-8 px-5 py-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald/10 border-emerald/30 text-emerald'
                : 'bg-rose/10 border-rose/30 text-rose'
            }`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <Zap size={18} />}
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue/30 bg-blue/10 text-blue text-sm font-medium mb-6">
              <Zap size={14} /> Simple, transparent pricing
            </div>
            <h1 className="text-5xl font-heading font-bold text-white mb-4">
              Pay only for what you use
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              No subscriptions. No monthly fees. Buy credits when you need them.
            </p>
            {session && credits !== null && (
              <p className="mt-4 text-sm text-slate-500">
                You currently have{' '}
                <span className="text-blue font-semibold">{credits} credit{credits !== 1 ? 's' : ''}</span> remaining
              </p>
            )}
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">

            {/* Free */}
            <div className="bg-slate/30 border border-white/10 rounded-2xl p-8">
              <div className="mb-6">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Free</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-heading font-bold text-white">$0</span>
                </div>
                <p className="text-slate-500 text-sm">Forever, no card required</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  '1 interview credit on signup',
                  'Full AI voice interview',
                  'Detailed evaluation report',
                  'Interview history',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle size={16} className="text-emerald flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={session ? '/setup' : '/signup'}
                className="block w-full py-3 rounded-xl border border-white/15 text-white text-center font-semibold hover:bg-white/5 transition-colors text-sm"
              >
                {session ? 'Start Interview' : 'Get Started Free'}
              </Link>
            </div>

            {/* Credit Pack */}
            <div className="relative bg-blue/10 border border-blue/40 rounded-2xl p-8 shadow-2xl shadow-blue/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-blue text-white text-xs font-bold tracking-wide uppercase">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <p className="text-blue text-sm font-medium uppercase tracking-wide mb-2">Credit Pack</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-heading font-bold text-white">$4.99</span>
                </div>
                <p className="text-slate-400 text-sm">One-time · 5 interview credits</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  '5 interview credits',
                  'Full AI voice interview each',
                  'Detailed evaluation reports',
                  'Credits never expire',
                  'Stack multiple packs',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle size={16} className="text-blue flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleBuy}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue hover:bg-blue/90 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Buy 5 Credits — $4.99</>
                )}
              </button>

              <p className="text-center text-xs text-slate-600 mt-3">
                Secure payment via Stripe · No subscription
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Mic, title: 'Real voice interviews', desc: 'Speak naturally — Meriam listens and responds in real time' },
              { icon: BarChart3, title: 'Scored evaluations', desc: 'Get a detailed breakdown of communication, technical, and more' },
              { icon: Clock, title: 'Credits never expire', desc: 'Buy when you need them, use them whenever you are ready' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate/20 border border-white/5 rounded-xl p-6">
                <Icon size={24} className="text-blue mx-auto mb-3" />
                <p className="font-semibold text-white text-sm mb-1">{title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}

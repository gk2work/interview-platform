'use client'

import Link from 'next/link'
import { ArrowRight, Mic, BarChart3, Clock, Shield, Zap, Target } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const features = [
  {
    icon: Mic,
    color: 'text-blue',
    bg: 'bg-blue/10 border-blue/20',
    title: 'Real-Time Voice',
    description:
      'Hold a natural conversation with Meriam, your AI interviewer, using speech recognition and synthesis — no typing required.',
  },
  {
    icon: BarChart3,
    color: 'text-emerald',
    bg: 'bg-emerald/10 border-emerald/20',
    title: 'Detailed Scoring',
    description:
      'Get scored across 6 dimensions: technical knowledge, communication, problem solving, cultural fit, experience, and confidence.',
  },
  {
    icon: Clock,
    color: 'text-amber',
    bg: 'bg-amber/10 border-amber/20',
    title: 'Practice Anytime',
    description:
      'Run unlimited interviews whenever you want. Review past sessions and track your improvement over time.',
  },
  {
    icon: Target,
    color: 'text-blue',
    bg: 'bg-blue/10 border-blue/20',
    title: 'Role-Tailored',
    description:
      'Paste the job description and target company — Meriam adapts every question to the specific role and seniority level.',
  },
  {
    icon: Zap,
    color: 'text-emerald',
    bg: 'bg-emerald/10 border-emerald/20',
    title: 'Instant Feedback',
    description:
      'Receive your full evaluation seconds after the interview ends — no waiting for human review.',
  },
  {
    icon: Shield,
    color: 'text-amber',
    bg: 'bg-amber/10 border-amber/20',
    title: 'Private & Secure',
    description:
      'Your CV and interview data are stored securely. We never share your information with third parties.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Upload Your CV',
    desc: 'Upload your resume in PDF format. Our AI reads your experience and skills to personalise the interview.',
  },
  {
    n: '02',
    title: 'Configure the Role',
    desc: 'Set the company, job title, interview type, and difficulty. Paste the JD for even sharper questions.',
  },
  {
    n: '03',
    title: 'Interview with Meriam',
    desc: 'Have a real-time voice conversation with Meriam, your AI interviewer. Speak naturally — just like the real thing.',
  },
  {
    n: '04',
    title: 'Get Your Report',
    desc: 'Receive a full scorecard with category breakdowns, strengths, areas to improve, and a hire recommendation.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-36 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-emerald/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue/30 bg-blue/10 text-blue text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
            AI-Powered Voice Interviews
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Practice Interviews.
            <br />
            <span className="bg-gradient-to-r from-blue via-blue/80 to-emerald bg-clip-text text-transparent">
              Get Hired.
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            FormalMock puts you in a real interview with an AI that knows your CV, adapts to your
            answers, and gives you an honest scorecard — so the real thing feels easy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/setup">
              <button className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 shadow-lg shadow-blue/20">
                Start Free Interview <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/history">
              <button className="btn-ghost inline-flex items-center gap-2 text-lg px-8 py-4 border border-white/10">
                View Past Sessions
              </button>
            </Link>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="relative mt-20 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="text-emerald font-bold text-base">✓</span> No credit card needed
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald font-bold text-base">✓</span> Works in Chrome, Edge & Safari
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald font-bold text-base">✓</span> Results in under 30 seconds
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-slate/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Everything you need to nail the interview
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Built for candidates who take preparation seriously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, bg, title, description }) => (
              <div
                key={title}
                className={`rounded-xl p-6 border ${bg} hover:scale-[1.02] transition-transform`}
              >
                <Icon className={`w-10 h-10 ${color} mb-4`} />
                <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">From CV to scorecard in under 20 minutes.</p>
          </div>

          <div className="space-y-6">
            {steps.map(({ n, title, desc }, idx) => (
              <div key={n} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-emerald/20 border border-blue/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-blue text-sm">{n}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-heading font-semibold text-lg mb-1">{title}</h4>
                  <p className="text-slate-400">{desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute ml-6 mt-14 w-px h-6 bg-blue/20" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/setup">
              <button className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4 shadow-lg shadow-blue/20">
                Start Your First Interview <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-blue/20 via-blue/10 to-emerald/20 border border-blue/20 p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to interview smarter?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Upload your CV, pick a role, and let Meriam challenge you. Free, instant, and brutally
            honest.
          </p>
          <Link href="/setup">
            <button className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Get Started — It&apos;s Free <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

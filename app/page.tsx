'use client'

import Link from 'next/link'
import { ArrowRight, Mic, BarChart3, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="w-full">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-slate/50 backdrop-blur">
        <div className="text-2xl font-heading font-bold text-blue">AI Interview</div>
        <div className="flex gap-4">
          <Link href="/history" className="text-white/70 hover:text-white transition">
            History
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-blue to-emerald bg-clip-text text-transparent">
            Master Your Interview Skills
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Practice with AI-powered voice interviews tailored to your target role. Get instant feedback and improve your performance.
          </p>
          <Link href="/setup">
            <button className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Interview <ArrowRight size={20} />
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl w-full">
          <div className="bg-slate/50 rounded-lg p-8 border border-blue/20 hover:border-blue/50 transition">
            <Mic className="w-12 h-12 text-blue mb-4" />
            <h3 className="font-heading font-bold mb-3">Real-Time Voice</h3>
            <p className="text-slate-300">
              Natural conversation with AI using speech recognition and synthesis
            </p>
          </div>

          <div className="bg-slate/50 rounded-lg p-8 border border-blue/20 hover:border-blue/50 transition">
            <BarChart3 className="w-12 h-12 text-emerald mb-4" />
            <h3 className="font-heading font-bold mb-3">Detailed Evaluation</h3>
            <p className="text-slate-300">
              Get scored on technical skills, communication, problem-solving & more
            </p>
          </div>

          <div className="bg-slate/50 rounded-lg p-8 border border-blue/20 hover:border-blue/50 transition">
            <Clock className="w-12 h-12 text-amber mb-4" />
            <h3 className="font-heading font-bold mb-3">Flexible Practice</h3>
            <p className="text-slate-300">
              Practice anytime, anywhere. Review past interviews and track progress
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-heading font-bold">
                1
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Upload Your CV</h4>
                <p className="text-slate-300">Upload your resume/CV in PDF format. We'll extract your experience and skills.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-heading font-bold">
                2
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Configure Interview</h4>
                <p className="text-slate-300">
                  Specify the company, role, interview type, and difficulty level
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-heading font-bold">
                3
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Have a Voice Interview</h4>
                <p className="text-slate-300">
                  Have a real-time conversation with your AI interviewer using voice
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue flex items-center justify-center font-heading font-bold">
                4
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Get Evaluated</h4>
                <p className="text-slate-300">Receive detailed scores, feedback, and recommendations for improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate/30 border-t border-blue/20 px-6 py-8 text-center text-slate-400">
        <p>© 2024 AI Interview Platform. Built with Next.js and OpenAI.</p>
      </footer>
    </div>
  )
}

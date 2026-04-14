'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-navy/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-emerald flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-heading font-bold text-sm">FM</span>
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight">
            Formal<span className="text-blue">Mock</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/history'
                ? 'bg-blue/10 text-blue'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            History
          </Link>
          <Link
            href="/setup"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue text-white hover:bg-blue/90 transition-colors"
          >
            Start Interview
          </Link>
        </div>
      </div>
    </nav>
  )
}

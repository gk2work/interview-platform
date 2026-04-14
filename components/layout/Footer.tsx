import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy/60 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-emerald flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xs">FM</span>
            </div>
            <span className="font-heading font-bold text-white tracking-tight">
              Formal<span className="text-blue">Mock</span>
            </span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © 2026 FormalMock. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { LogOut, User, History, ChevronDown } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-navy/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-emerald flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-heading font-bold text-sm">FM</span>
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight">
            Formal<span className="text-blue">Mock</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/history"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:block ${
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
                + Interview
              </Link>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 ml-1 pl-2 pr-1 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full ring-2 ring-blue/30 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-emerald flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {session.user?.name?.[0] ?? '?'}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-slate border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={15} /> My Account
                      </Link>
                      <Link
                        href="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors sm:hidden"
                      >
                        <History size={15} /> Interview History
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:bg-rose/10 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue text-white hover:bg-blue/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

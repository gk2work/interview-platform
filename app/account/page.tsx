'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LogOut, Trash2, BarChart3, Mic, AlertTriangle, Zap } from 'lucide-react'

interface AccountData {
  user: { name: string; email: string; image?: string; createdAt: string }
  totalSessions: number
  evaluatedSessions: number
  credits: number
}

export default function AccountPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AccountData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/account')
      .then(r => r.json())
      .then(setData)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSignOut = () => signOut({ callbackUrl: '/' })

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/account', { method: 'DELETE' })
      if (res.ok) {
        await signOut({ callbackUrl: '/' })
      }
    } catch {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  const user = data?.user

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-2">My Account</h1>
          <p className="text-slate-400 mb-10">Manage your profile and data</p>

          {/* Profile card */}
          <Card className="mb-6 flex items-center gap-5">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full ring-2 ring-blue/30 flex-shrink-0 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue to-emerald flex items-center justify-center text-2xl font-heading font-bold flex-shrink-0">
                {user?.name?.[0] ?? '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xl font-heading font-bold truncate">{user?.name}</p>
              <p className="text-slate-400 text-sm truncate">{user?.email}</p>
              <p className="text-slate-600 text-xs mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue/20 to-emerald/20 border border-blue/20 flex items-center justify-center">
                <span className="text-blue font-heading font-bold text-xs">G</span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="text-center py-6">
              <Mic className="w-8 h-8 text-blue mx-auto mb-2" />
              <p className="text-3xl font-heading font-bold text-white">{data?.totalSessions ?? 0}</p>
              <p className="text-slate-400 text-sm mt-1">Interviews taken</p>
            </Card>
            <Card className="text-center py-6">
              <BarChart3 className="w-8 h-8 text-emerald mx-auto mb-2" />
              <p className="text-3xl font-heading font-bold text-white">{data?.evaluatedSessions ?? 0}</p>
              <p className="text-slate-400 text-sm mt-1">Reports generated</p>
            </Card>
            <Card className={`text-center py-6 ${data?.credits === 0 ? 'border-rose/30 bg-rose/5' : ''}`}>
              <Zap className={`w-8 h-8 mx-auto mb-2 ${data?.credits === 0 ? 'text-rose' : 'text-blue'}`} />
              <p className={`text-3xl font-heading font-bold ${data?.credits === 0 ? 'text-rose' : 'text-white'}`}>
                {data?.credits ?? 0}
              </p>
              <p className="text-slate-400 text-sm mt-1">Credits left</p>
            </Card>
          </div>

          {/* Buy credits CTA */}
          {(data?.credits ?? 0) === 0 && (
            <Card className="mb-6 bg-blue/5 border-blue/20 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white text-sm">You&apos;re out of credits</p>
                <p className="text-slate-400 text-xs mt-0.5">Get 5 more interviews for $4.99</p>
              </div>
              <Button variant="primary" onClick={() => router.push('/pricing')} className="flex-shrink-0 flex items-center gap-2">
                <Zap size={15} /> Buy Credits
              </Button>
            </Card>
          )}

          {/* Actions */}
          <Card className="mb-6 space-y-3">
            <h2 className="font-heading font-bold text-lg mb-4">Account Actions</h2>

            <button
              onClick={() => router.push('/history')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <BarChart3 size={18} className="text-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">View Interview History</p>
                <p className="text-slate-500 text-xs">See all past sessions and evaluations</p>
              </div>
            </button>

            <div className="border-t border-white/5" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
            >
              <LogOut size={18} className="text-slate-400 group-hover:text-white flex-shrink-0 transition-colors" />
              <div>
                <p className="font-medium text-sm text-slate-300 group-hover:text-white transition-colors">Sign Out</p>
                <p className="text-slate-500 text-xs">You&apos;ll be returned to the home page</p>
              </div>
            </button>
          </Card>

          {/* Danger zone */}
          <Card className="border-rose/20 bg-rose/5">
            <h2 className="font-heading font-bold text-lg text-rose mb-1">Danger Zone</h2>
            <p className="text-slate-400 text-sm mb-5">
              Permanently delete your account and all interview data. This cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete My Account
              </Button>
            ) : (
              <div className="bg-rose/10 border border-rose/30 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle size={20} className="text-rose flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose text-sm mb-1">Are you absolutely sure?</p>
                    <p className="text-slate-400 text-sm">
                      This will delete your account, all {data?.totalSessions ?? 0} interview sessions,
                      messages, and evaluation reports. There is no recovery.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    isLoading={isDeleting}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={15} />
                    {isDeleting ? 'Deleting…' : 'Yes, Delete Everything'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

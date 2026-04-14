import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FormalMock — AI Voice Interview Practice',
  description:
    'Practice job interviews with FormalMock\'s AI-powered voice interviewer. Get detailed feedback, scores, and personalised coaching to land your dream role.',
  keywords: ['mock interview', 'AI interview', 'interview practice', 'job interview', 'career'],
  authors: [{ name: 'FormalMock' }],
  openGraph: {
    title: 'FormalMock — AI Voice Interview Practice',
    description: 'Practice interviews with AI. Get hired.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-navy text-white">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}

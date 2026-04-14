import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Voice Interview Platform',
  description: 'Practice interviews with AI-powered voice conversations',
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

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voice Browser Agent',
  description: 'Sophisticated voice-enabled browser automation agent with modern tech interface',
  keywords: ['browser automation', 'voice control', 'AI assistant', 'web scraping'],
  authors: [{ name: 'Voice Browser Agent Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} tech-grid-bg min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#00ff88',
              border: '1px solid #00ff88',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  )
}

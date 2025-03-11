import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaGenie – AI-Powered Instagram Caption Generator 🚀✨',
  description: 'AI-powered platform for instagram user who creates post and need captions. Generate creative, engaging, and AI-powered Instagram captions instantly! 🚀 Just enter your keywords, and let our smart AI craft the perfect caption to boost your posts. Try it now for free! 💡📸',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'InstaGenie – AI-Powered Instagram Caption Generator',
    description: 'Generate creative, engaging Instagram captions instantly with AI',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="pb-16">
              {children}
              <Analytics />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
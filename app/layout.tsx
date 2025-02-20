import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaGenie – AI-Powered Instagram Caption Generator 🚀✨',
  description: 'AI-powered platform for instagram user who creates post and need captions.Generate creative, engaging, and AI-powered Instagram captions instantly! 🚀 Just enter your keywords, and let our smart AI craft the perfect caption to boost your posts. Try it now for free! 💡📸',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="pb-16">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
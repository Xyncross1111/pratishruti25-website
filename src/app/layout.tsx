import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'

export const metadata: Metadata = {
  title: 'Section Cup 🏆⭐',
  description: "P'25 Section Cup Leaderboard",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Analytics />
      <SpeedInsights />
      <body>{children}</body>
    </html>
  )
}

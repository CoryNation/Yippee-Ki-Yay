import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yippee Ki Yay',
  description: 'Workshop App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

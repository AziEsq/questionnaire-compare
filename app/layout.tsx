import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Questionnaire Compare',
  description: 'Compare candidate responses side-by-side',
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

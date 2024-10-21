import React from 'react'
import './globals.css'
import { Providers } from './Providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Ad Headline Lab',
  description: 'Creative headlines that deliver results!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  )
}

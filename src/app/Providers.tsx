'use client'

import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath={process.env.NEXTAUTH_URL}>{children}</SessionProvider>
}

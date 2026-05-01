import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team Task Manager',
  description: 'Collaborative project and task management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}

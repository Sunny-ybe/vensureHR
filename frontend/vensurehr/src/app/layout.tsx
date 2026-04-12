import type { Metadata } from 'next'
import './globals.css'
import Sidebar from './components/Sidebar'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Talent Intelligence — VensureHR',
  description: 'VensureHR Talent Intelligence Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto ml-56">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

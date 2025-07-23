"use client";
import './globals.css'
import type { Metadata } from 'next'
import { WalletProvider } from '../components/WalletProvider'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <WalletProvider>
          <Toaster position="top-center" toastOptions={{
            style: { background: '#1a365d', color: '#fff', borderRadius: '12px', fontSize: '1rem' },
            success: { style: { background: '#10b981', color: '#fff' } },
            error: { style: { background: '#ef4444', color: '#fff' } },
          }} />
          <Navbar />
          <div className="pt-20">{children}</div>
        </WalletProvider>
      </body>
    </html>
  )
} 
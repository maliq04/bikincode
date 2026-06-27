import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { FaviconProvider } from '@/components/providers/FaviconProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ServicesProvider } from '@/contexts/ServicesContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'BikinCode',
  description: 'Full company management system with admin dashboard',
  icons: {
    icon: '/api/favicon',
    shortcut: '/api/favicon',
    apple: '/api/favicon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <SettingsProvider>
          <ServicesProvider>
            <LanguageProvider>
              <SessionProvider session={null}>
                <FaviconProvider />
                {children}
              </SessionProvider>
            </LanguageProvider>
          </ServicesProvider>
        </SettingsProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
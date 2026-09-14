import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nusya Kuruyemiş - En Kaliteli Kuruyemişler',
  description: 'Nusya Kuruyemiş olarak en taze ve lezzetli kuruyemişleri sizlere sunuyoruz. Antep fıstığı, badem, fındık ve daha fazlası.',
  keywords: 'kuruyemiş, antep fıstığı, badem, fındık, kaju, ceviz, lokum, kuru kayısı',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-brand-50 pt-20">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
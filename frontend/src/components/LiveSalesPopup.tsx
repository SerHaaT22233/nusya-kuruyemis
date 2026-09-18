'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface SaleNotification {
  id: number
  name: string
  product: string
  slug: string
  time: string
}

export default function LiveSalesPopup() {
  const [notifications, setNotifications] = useState<SaleNotification[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [nextId, setNextId] = useState(1)

  const mockSales: Omit<SaleNotification, 'id'>[] = [
    { name: 'Ahmet Y.', product: 'Antep Fıstığı', slug: 'antep-fistigi', time: 'Şimdi' },
    { name: 'Fatma K.', product: 'Kavrulmuş Badem', slug: 'kavrulmus-badem', time: '2 dk önce' },
    { name: 'Mehmet D.', product: 'Kaju Çekirdeği', slug: 'kaju', time: '5 dk önce' },
    { name: 'Zeynep S.', product: 'Kuru Üzüm', slug: 'kuru-uzum', time: '8 dk önce' },
  ]

  useEffect(() => {
    // Show first notification after 3 seconds
    const timer1 = setTimeout(() => {
      addNotification(mockSales[0])
      setIsVisible(true)
    }, 3000)

    // Show subsequent notifications every 6 seconds
    const interval = setInterval(() => {
      const randomSale = mockSales[Math.floor(Math.random() * mockSales.length)]
      addNotification(randomSale)
    }, 6000)

    return () => {
      clearTimeout(timer1)
      clearInterval(interval)
    }
  }, [])

  const addNotification = (sale: Omit<SaleNotification, 'id'>) => {
    const id = nextId
    setNextId(prev => prev + 1)
    setNotifications(prev => {
      const updated = [{ ...sale, id }, ...prev.slice(0, 2)]
      return updated
    })
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const closeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white rounded-2xl shadow-2xl border border-brand-200 p-4 w-72 max-w-[90vw]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">
                  <span className="text-brand-600">{notification.name}</span> satın aldı
                </p>
                <p className="text-xs text-ink-500 truncate">{notification.product}</p>
                <p className="text-xs text-ink-400 mt-0.5">{notification.time}</p>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="p-1 text-ink-400 hover:text-ink-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Link
              href={`/products/${notification.slug}`}
              className="block mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              İzle →
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
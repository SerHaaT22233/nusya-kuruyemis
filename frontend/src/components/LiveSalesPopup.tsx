'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
}

interface SaleNotification {
  id: number
  name: string
  product: string
  slug: string
  time: string
}

const customerNames = [
  'Ahmet Y.', 'Fatma K.', 'Mehmet D.', 'Zeynep S.', 'Ali R.',
  'Ayşe M.', 'Mustafa T.', 'Emine K.', 'Osman B.', 'Hatice D.',
  'Hüseyin A.', 'Elif N.', 'Murat S.', 'Sultan Y.', 'Burak Ç.',
  'Derya L.', 'Kaan P.', 'Meltem G.', 'Can V.', 'İlayda B.',
]

const timeLabels = ['Şimdi', '1 dk önce', '2 dk önce', '3 dk önce', '5 dk önce', '8 dk önce', '12 dk önce']

export default function LiveSalesPopup() {
  const [notifications, setNotifications] = useState<SaleNotification[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [nextId, setNextId] = useState(1)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get('/products?limit=20')
      .then(res => {
        const data = res.data.products || res.data
        setProducts(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (products.length === 0) return

    const showNotification = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      const randomName = customerNames[Math.floor(Math.random() * customerNames.length)]
      const randomTime = timeLabels[Math.floor(Math.random() * timeLabels.length)]

      addNotification({
        name: randomName,
        product: randomProduct.name,
        slug: randomProduct.slug,
        time: randomTime,
      })
    }

    const timer1 = setTimeout(() => {
      showNotification()
      setIsVisible(true)
    }, 3000)

    const interval = setInterval(() => {
      showNotification()
    }, 6000)

    return () => {
      clearTimeout(timer1)
      clearInterval(interval)
    }
  }, [products])

  const addNotification = (sale: Omit<SaleNotification, 'id'>) => {
    const id = nextId
    setNextId(prev => prev + 1)
    setNotifications(prev => {
      const updated = [{ ...sale, id }, ...prev.slice(0, 2)]
      return updated
    })
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
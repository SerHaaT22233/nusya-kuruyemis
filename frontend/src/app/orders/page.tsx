'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

interface OrderItem {
  productName: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: string
  city: string
  district: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Beklemede', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
  CONFIRMED: { label: 'Onaylandı', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Package },
  SHIPPED: { label: 'Kargoya Verildi', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle },
  CANCELLED: { label: 'İptal Edildi', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
}

export default function OrderTrackingPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (user) {
      api.get('/orders')
        .then(res => setOrders(res.data))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false))
    } else {
      setLoadingOrders(false)
    }
  }, [user])

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-ink-900/20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-ink-900 mb-3">Sipariş Takibi</h1>
          <p className="text-ink-900/50 mb-8">Siparişlerinizi görmek için giriş yapın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Siparişlerim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Sipariş Takibi</h1>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-ink-900/10 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-ink-900 mb-3">Henüz siparişiniz yok</h2>
            <p className="text-ink-900/50 mb-8 max-w-md mx-auto">İlk siparişinizi vermek için ürünlerimizi keşfedin</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || { label: order.status, color: 'text-ink-900/60 bg-white/[0.04] border-ink-200/[0.08]', icon: Package }
              const StatusIcon = status.icon
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-brand-50-card rounded-2xl border border-ink-200 p-6 sm:p-8 hover:border-ink-300 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-brand-500" />
                        <p className="font-mono text-sm text-ink-900/40">#{order.orderNumber}</p>
                      </div>
                      <p className="text-sm text-ink-900/40">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="border-t border-ink-200 pt-6 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-ink-900/80 truncate">{item.productName}</p>
                          <p className="text-ink-900/40 text-xs mt-0.5">x{item.quantity}</p>
                        </div>
                        <span className="text-ink-900/80 font-medium flex-shrink-0 ml-4">
                          {item.price * item.quantity} TL
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-ink-200 pt-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-ink-900/40">
                      <MapPin className="w-4 h-4" />
                      <span>{order.city}, {order.district}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-900/40 mb-1">Toplam</p>
                      <p className="text-xl font-bold text-brand-600">{order.totalAmount} TL</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

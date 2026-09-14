'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ShoppingBag, Users, Package, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react'
import api from '@/lib/api'

interface Stats {
  todaySales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
  recentOrders: any[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      setStats(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    { label: 'Bugünün Satışı', value: `${(stats.todaySales || 0).toFixed(2)} TL`, icon: TrendingUp, color: 'from-brand-500 to-sun-500', change: '+12%' },
    { label: 'Toplam Sipariş', value: stats.totalOrders || 0, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', change: '+8%' },
    { label: 'Müşteriler', value: stats.totalCustomers || 0, icon: Users, color: 'from-nut-500 to-nut-600', change: '+5%' },
    { label: 'Ürünler', value: stats.totalProducts || 0, icon: Package, color: 'from-purple-500 to-purple-600', change: '+3%' },
    { label: 'Düşük Stok', value: stats.lowStockProducts || 0, icon: AlertTriangle, color: 'from-red-500 to-red-600', change: '-2%' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hoş geldin, Admin 👋</h1>
        <p className="text-ink-500 mt-1">Panel genel bakış</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8"
      >
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div key={i} variants={itemVariants} className="bg-ink-700 rounded-2xl p-6 border border-ink-600 hover:border-orange-500/40 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-500 mb-2">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <span className="text-xs text-nut-400 mt-1 inline-block">{card.change}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-2 bg-ink-700 rounded-2xl p-6 border border-ink-600">
          <h2 className="text-lg font-bold text-white mb-6">Son 7 Gün Satış</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-orange-600 to-sun-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-ink-500">G{7 - i}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-ink-700 rounded-2xl p-6 border border-ink-600">
          <h2 className="text-lg font-bold text-white mb-4">Son Siparişler</h2>
          <div className="space-y-3">
            {stats.recentOrders?.slice(0, 5).map((order: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-ink-600 last:border-0">
                <div>
                  <p className="text-sm text-white">#{order.orderNumber}</p>
                  <p className="text-xs text-ink-500">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-400">{order.totalAmount} TL</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : order.status === 'DELIVERED' ? 'bg-nut-500/10 text-nut-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
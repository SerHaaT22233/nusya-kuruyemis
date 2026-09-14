'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, Filter, ChevronDown } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

interface Order {
  id: string
  status: string
  totalPrice: number
  paymentMethod: string
  address: string
  createdAt: string
  user: { name: string; email: string; phone: string }
  items: { productName: string; price: number; quantity: number; product: { images: { imageUrl: string }[] } }[]
}

const statusOptions = [
  { value: '', label: 'Tümü' },
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'APPROVED', label: 'Onaylandı' },
  { value: 'PROCESSING', label: 'Hazırlanıyor' },
  { value: 'SHIPPED', label: 'Kargoya Verildi' },
  { value: 'DELIVERED', label: 'Teslim Edildi' },
  { value: 'CANCELLED', label: 'İptal Edildi' }
]

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  APPROVED: { label: 'Onaylandı', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  SHIPPED: { label: 'Kargoya Verildi', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-nut-400 bg-nut-500/10 border-nut-500/20' },
  CANCELLED: { label: 'İptal Edildi', color: 'text-discount-400 bg-discount-500/10 border-discount-500/20' },
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/admin/orders').then(res => {
        setOrders(res.data)
        setFilteredOrders(res.data)
      })
    }
  }, [user])

  useEffect(() => {
    let filtered = orders
    if (search) {
      filtered = filtered.filter(o =>
        o.user.name.toLowerCase().includes(search.toLowerCase()) ||
        o.user.email.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) {
      filtered = filtered.filter(o => o.status === statusFilter)
    }
    setFilteredOrders(filtered)
  }, [search, statusFilter, orders])

  const updateStatus = async (orderId: string, status: string) => {
    await api.put(`/admin/orders/${orderId}`, { status })
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Siparişler</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-ink-600 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                placeholder="Müşteri veya sipariş ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-11 pr-10 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-ink-300 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300 appearance-none cursor-pointer min-w-[160px]"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Sipariş</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {filteredOrders.map(order => {
                  const status = statusMap[order.status] || { label: order.status, color: 'text-ink-400 bg-ink-700/30 border-ink-600' }
                  return (
                    <tr key={order.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">#{order.id.slice(-8)}</p>
                        <p className="text-sm text-ink-400 mt-0.5">{order.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{order.user.name}</p>
                        <p className="text-sm text-ink-400">{order.user.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-500">{order.totalPrice} TL</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-400">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="px-3 py-2 bg-ink-900 border border-ink-600 rounded-lg text-sm text-ink-300 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                        >
                          {statusOptions.slice(1).map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
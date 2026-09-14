'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Tag, Percent } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  discount: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminCouponsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({ code: '', discount: '', active: true })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/admin/coupons').then(res => setCoupons(res.data))
    }
  }, [user])

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({ code: coupon.code, discount: coupon.discount.toString(), active: coupon.active })
    } else {
      setEditingCoupon(null)
      setFormData({ code: '', discount: '', active: true })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        code: formData.code.toUpperCase(),
        discount: parseFloat(formData.discount),
        active: formData.active
      }

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, data)
        toast.success('Kupon güncellendi')
      } else {
        await api.post('/admin/coupons', data)
        toast.success('Kupon eklendi')
      }

      setShowModal(false)
      api.get('/admin/coupons').then(res => setCoupons(res.data))
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return
    await api.delete(`/admin/coupons/${id}`)
    setCoupons(coupons.filter(c => c.id !== id))
    toast.success('Kupon silindi')
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Kampanya Kodları</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Yeni Kupon
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Kupon Kodu</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İndirim (%)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Oluşturma</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                          <Tag className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="font-mono font-bold text-white">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-brand-400" />
                        <span className="font-semibold text-white">{coupon.discount}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${coupon.active ? 'text-nut-400 bg-nut-500/10 border-nut-500/20' : 'text-discount-400 bg-discount-500/10 border-discount-500/20'}`}>
                        {coupon.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-400">
                      {new Date(coupon.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(coupon)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(coupon.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6 sm:p-8 border-b border-ink-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-ink-700 rounded-xl transition-colors duration-300">
                  <X className="w-5 h-5 text-ink-300" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Kupon Kodu</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300 font-mono"
                    placeholder="NUSYA10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">İndirim Oranı (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-brand-400 bg-ink-900 border-ink-600 rounded focus:ring-gold-500 focus:ring-2"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-ink-300">Aktif</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 border border-ink-600 rounded-xl text-ink-300 hover:text-white hover:border-ink-400 hover:bg-ink-700 transition-all duration-300 font-medium">
                    İptal
                  </button>
                  <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    {editingCoupon ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, CheckCircle, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Review {
  id: string
  rating: number
  comment?: string
  isApproved: boolean
  createdAt: string
  user?: { firstName?: string; lastName?: string }
  product?: { name: string }
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/admin/reviews').then(res => setReviews(res.data))
    }
  }, [user])

  const approveReview = async (id: string) => {
    await api.put(`/admin/reviews/${id}/approve`)
    setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r))
    toast.success('Yorum onaylandı')
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return
    await api.delete(`/admin/reviews/${id}`)
    setReviews(reviews.filter(r => r.id !== id))
    toast.success('Yorum silindi')
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Yorumlar</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Puan</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Yorum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {reviews.map(review => (
                  <tr key={review.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{review.user?.firstName} {review.user?.lastName}</p>
                      <p className="text-xs text-ink-400">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</p>
                    </td>
                    <td className="px-6 py-4 text-ink-300">{review.product?.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-brand-400 fill-gold-500' : 'text-white/20'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-400 text-sm max-w-xs truncate">{review.comment || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${review.isApproved ? 'text-nut-400 bg-nut-500/10 border-nut-500/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                        {review.isApproved ? 'Onaylı' : 'Beklemede'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!review.isApproved && (
                          <button onClick={() => approveReview(review.id)} className="p-2 text-nut-400 hover:bg-green-500/10 rounded-xl transition-all duration-300">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteReview(review.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
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
    </div>
  )
}

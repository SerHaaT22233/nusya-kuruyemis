'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Flame } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Campaign {
  id: string
  title: string
  description?: string
  banner?: string
  discount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  products: { id: string; product: { id: string; name: string; price: number } }[]
}

export default function AdminCampaignsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', banner: '', discount: '', startDate: '', endDate: '', isActive: true, productIds: [] as string[] })
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      Promise.all([
        api.get('/admin/campaigns'),
        api.get('/products')
      ]).then(([campaignsRes, productsRes]) => {
        setCampaigns(campaignsRes.data)
        setProducts(productsRes.data.products || productsRes.data)
      })
    }
  }, [user])

  const openModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign)
      setFormData({ title: campaign.title, description: campaign.description || '', banner: campaign.banner || '', discount: campaign.discount.toString(), startDate: campaign.startDate.slice(0, 10), endDate: campaign.endDate.slice(0, 10), isActive: campaign.isActive, productIds: campaign.products.map(p => p.product.id) })
    } else {
      setEditingCampaign(null)
      setFormData({ title: '', description: '', banner: '', discount: '', startDate: '', endDate: '', isActive: true, productIds: [] })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCampaign) {
        await api.put(`/admin/campaigns/${editingCampaign.id}`, { ...formData, discount: parseFloat(formData.discount) })
        toast.success('Kampanya güncellendi')
      } else {
        await api.post('/admin/campaigns', { ...formData, discount: parseFloat(formData.discount) })
        toast.success('Kampanya eklendi')
      }
      setShowModal(false)
      api.get('/admin/campaigns').then(res => setCampaigns(res.data))
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return
    await api.delete(`/admin/campaigns/${id}`)
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast.success('Kampanya silindi')
  }

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId) ? prev.productIds.filter(id => id !== productId) : [...prev.productIds, productId]
    }))
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Kampanyalar</h1>
          </div>
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Yeni Kampanya
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Kampanya</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İndirim</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                          <Flame className="w-4 h-4 text-brand-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{campaign.title}</p>
                          <p className="text-xs text-ink-400 line-clamp-1">{campaign.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-500">%{campaign.discount}</td>
                    <td className="px-6 py-4 text-sm text-ink-400">
                      <div>{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</div>
                      <div className="text-xs text-ink-400">{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</div>
                    </td>
                    <td className="px-6 py-4 text-ink-300">{campaign.products.length} ürün</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${campaign.isActive ? 'text-nut-400 bg-nut-500/10 border-nut-500/20' : 'text-discount-400 bg-discount-500/10 border-discount-500/20'}`}>
                        {campaign.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(campaign)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(campaign.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
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

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8 border-b border-ink-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-ink-700 rounded-xl transition-colors duration-300">
                  <X className="w-5 h-5 text-ink-300" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Başlık</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Açıklama</label>
                  <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">İndirim (%)</label>
                    <input type="number" required min="1" max="100" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Banner Resmi</label>
                    <input type="text" value={formData.banner} onChange={(e) => setFormData({ ...formData, banner: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Başlangıç</label>
                    <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Bitiş</label>
                    <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Ürünler</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-ink-900 border border-ink-600 rounded-xl p-3">
                    {products.map(product => (
                      <label key={product.id} className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer">
                        <input type="checkbox" checked={formData.productIds.includes(product.id)} onChange={() => toggleProduct(product.id)} className="w-4 h-4 text-brand-400 bg-ink-900 border-ink-600 rounded focus:ring-gold-500 focus:ring-2" />
                        {product.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 border border-ink-600 rounded-xl text-ink-300 hover:text-white hover:border-ink-400 hover:bg-ink-700 transition-all duration-300 font-medium">İptal</button>
                  <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">{editingCampaign ? 'Güncelle' : 'Ekle'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

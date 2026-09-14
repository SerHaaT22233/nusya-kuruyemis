'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Banner {
  id: string
  title: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function AdminBannersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [banners, setBanners] = useState<Banner[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', image: '', buttonText: '', buttonLink: '', order: 0, isActive: true })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/admin/banners').then(res => setBanners(res.data))
    }
  }, [user])

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({ title: banner.title, description: banner.description || '', image: banner.image, buttonText: banner.buttonText || '', buttonLink: banner.buttonLink || '', order: banner.order, isActive: banner.isActive })
    } else {
      setEditingBanner(null)
      setFormData({ title: '', description: '', image: '', buttonText: '', buttonLink: '', order: 0, isActive: true })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        await api.put(`/admin/banners/${editingBanner.id}`, formData)
        toast.success('Banner güncellendi')
      } else {
        await api.post('/admin/banners', formData)
        toast.success('Banner eklendi')
      }
      setShowModal(false)
      api.get('/admin/banners').then(res => setBanners(res.data))
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu banneri silmek istediğinize emin misiniz?')) return
    await api.delete(`/admin/banners/${id}`)
    setBanners(banners.filter(b => b.id !== id))
    toast.success('Banner silindi')
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Bannerlar</h1>
          </div>
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Yeni Banner
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Banner</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Bağlantı</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Sıra</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {banners.map(banner => (
                  <tr key={banner.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg bg-ink-900 border border-ink-600 overflow-hidden flex-shrink-0">
                          {banner.image && <img src={banner.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{banner.title}</p>
                          <p className="text-xs text-ink-400 line-clamp-1">{banner.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-400">{banner.buttonLink || '-'}</td>
                    <td className="px-6 py-4 text-ink-300">{banner.order}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${banner.isActive ? 'text-nut-400 bg-nut-500/10 border-nut-500/20' : 'text-discount-400 bg-discount-500/10 border-discount-500/20'}`}>
                        {banner.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(banner)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(banner.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6 sm:p-8 border-b border-ink-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{editingBanner ? 'Banner Düzenle' : 'Yeni Banner'}</h2>
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
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Resim URL</label>
                  <input type="text" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Buton Metni</label>
                    <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Buton Link</label>
                    <input type="text" value={formData.buttonLink} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 border border-ink-600 rounded-xl text-ink-300 hover:text-white hover:border-ink-400 hover:bg-ink-700 transition-all duration-300 font-medium">İptal</button>
                  <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">{editingBanner ? 'Güncelle' : 'Ekle'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

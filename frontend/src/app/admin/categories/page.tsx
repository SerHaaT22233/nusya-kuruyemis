'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string
  _count?: { products: number }
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', imageUrl: '' })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/categories').then(res => setCategories(res.data))
    }
  }, [user])

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, slug: category.slug, imageUrl: category.imageUrl || '' })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', imageUrl: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData)
        toast.success('Kategori güncellendi')
      } else {
        await api.post('/categories', formData)
        toast.success('Kategori eklendi')
      }
      setShowModal(false)
      api.get('/categories').then(res => setCategories(res.data))
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return
    await api.delete(`/categories/${id}`)
    setCategories(categories.filter(c => c.id !== id))
    toast.success('Kategori silindi')
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Kategoriler</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Yeni Kategori
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Ürün Sayısı</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-ink-900 border border-ink-600 overflow-hidden flex-shrink-0">
                          {category.imageUrl && (
                            <Image src={category.imageUrl} alt="" width={40} height={40} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <p className="font-medium text-white">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-400">{category.slug}</td>
                    <td className="px-6 py-4 text-ink-400">{category._count?.products || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(category)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
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
              className="bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-6 sm:p-8 border-b border-ink-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-ink-700 rounded-xl transition-colors duration-300">
                  <X className="w-5 h-5 text-ink-300" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Kategori Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Resim URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 border border-ink-600 rounded-xl text-ink-300 hover:text-white hover:border-ink-400 hover:bg-ink-700 transition-all duration-300 font-medium">
                    İptal
                  </button>
                  <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    {editingCategory ? 'Güncelle' : 'Ekle'}
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
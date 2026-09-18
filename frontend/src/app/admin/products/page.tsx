'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Edit, Trash2, X, Package, Search } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discountedPrice?: number
  stock: number
  featured: boolean
  categoryId: string
  category: { name: string }
  images: string | string[]
}

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discountedPrice: '',
    stock: '',
    categoryId: '',
    featured: false,
    imageUrl: ''
  })

  const getFirstImage = (images: string | string[]): string => {
    if (Array.isArray(images)) return images[0] || '/placeholder.jpg'
    try { return JSON.parse(images)[0] || '/placeholder.jpg' } catch { return '/placeholder.jpg' }
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]).then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.products)
        setCategories(categoriesRes.data)
      })
    }
  }, [user])

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      const firstImage = getFirstImage(product.images)
      setImagePreview(firstImage)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price.toString(),
        discountedPrice: product.discountedPrice?.toString() || '',
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        featured: product.featured,
        imageUrl: firstImage
      })
    } else {
      setEditingProduct(null)
      setImagePreview(null)
      setFormData({
        name: '', slug: '', description: '', price: '', discountedPrice: '', stock: '', categoryId: categories[0]?.id || '', featured: false, imageUrl: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        images: JSON.stringify([formData.imageUrl || '/placeholder.jpg'])
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data)
        toast.success('Ürün güncellendi')
      } else {
        await api.post('/products', data)
        toast.success('Ürün eklendi')
      }

      setShowModal(false)
      api.get('/products').then(res => setProducts(res.data.products))
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await api.delete(`/products/${id}`)
    setProducts(products.filter(p => p.id !== id))
    toast.success('Ürün silindi')
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Ürünler</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Yeni Ürün
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-ink-800 rounded-2xl border border-ink-600 overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-ink-600">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">Öne Çıkan</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-600">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-ink-700/30 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-ink-900 border border-ink-600 overflow-hidden flex-shrink-0">
                          <Image src={getFirstImage(product.images)} alt="" width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-ink-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-400">{product.category.name}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{product.price} TL</p>
                      {product.discountedPrice && (
                        <p className="text-sm text-nut-400">{product.discountedPrice} TL</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock < 10 ? 'text-discount-400 font-medium' : 'text-white/80'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.featured ? 'text-brand-500' : 'text-ink-500'}>
                        {product.featured ? 'Evet' : 'Hayır'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(product)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-discount-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
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
              className="bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8 border-b border-ink-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-ink-700 rounded-xl transition-colors duration-300">
                  <X className="w-5 h-5 text-ink-300" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Ürün Görseli</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-ink-900 border border-ink-600 overflow-hidden flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => { setFormData({ ...formData, imageUrl: e.target.value }); setImagePreview(e.target.value || null) }}
                        className="w-full px-4 py-3 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder="/uploads/urun.jpg"
                      />
                      <p className="text-xs text-ink-400 mt-2">Resim yüklemek için backend upload endpoint'ini kullanın veya URL girin.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Ürün Adı</label>
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
                  <label className="block text-sm font-medium text-ink-300 mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Fiyat (TL)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">İndirimli Fiyat (TL)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Stok</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-300 mb-2">Kategori</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-ink-300 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-brand-400 bg-ink-900 border-ink-600 rounded focus:ring-gold-500 focus:ring-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-ink-300">Öne Çıkan</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 border border-ink-600 rounded-xl text-ink-300 hover:text-white hover:border-ink-400 hover:bg-ink-700 transition-all duration-300 font-medium">
                    İptal
                  </button>
                  <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    {editingProduct ? 'Güncelle' : 'Ekle'}
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
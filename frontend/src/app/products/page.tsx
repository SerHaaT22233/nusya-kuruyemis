'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/product-card'
import api from '@/lib/api'
import { Slider } from '@/components/ui/slider'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  discountedPrice?: number
  stock: number
  images: string[]
  category: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '')
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (minPrice) params.set('minPrice', minPrice.toString())
    if (maxPrice < 1000) params.set('maxPrice', maxPrice.toString())
    params.set('page', currentPage.toString())
    params.set('limit', '12')

    api.get(`/products?${params.toString()}`).then(res => {
      setProducts(res.data.products)
      setTotalPages(res.data.pages)
      setLoading(false)
    })
  }, [selectedCategory, search, sort, minPrice, maxPrice, currentPage])

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-3">Koleksiyon</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Tüm Ürünler</h1>
          <p className="text-ink-500">En taze ve en kaliteli kuruyemiş seçkisi</p>
        </motion.div>

        {/* Search & Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-ink-200 rounded-2xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-3.5 bg-white border border-ink-200 rounded-2xl text-ink-700 hover:text-brand-600 hover:border-brand-300 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtreler
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3.5 bg-white border border-ink-200 rounded-2xl text-ink-700 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="newest">En Yeni</option>
              <option value="price_asc">Fiyat Artan</option>
              <option value="price_desc">Fiyat Azalan</option>
              <option value="popular">En Popüler</option>
            </select>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden sm:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-ink-200 shadow-card">
                <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-4">Kategoriler</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${!selectedCategory ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-brand-50'}`}
                  >
                    Tümü
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-brand-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-ink-200 shadow-card">
                <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-5">Fiyat Aralığı</h3>
                <div className="space-y-5">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={[minPrice, maxPrice]}
                    onValueChange={(value) => { setMinPrice(value[0]); setMaxPrice(value[1]) }}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">{minPrice} TL</span>
                    <span className="text-ink-500">{maxPrice} TL</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden fixed inset-0 bg-ink-900/60 backdrop-blur-sm z-50 flex items-end">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                className="bg-brand-50 border-t border-ink-200 rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-ink-900">Filtreler</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-brown-200 rounded-full">
                    <X className="w-5 h-5 text-ink-700" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-ink-900 mb-3">Kategoriler</h4>
                    <div className="space-y-1">
                      <button onClick={() => { setSelectedCategory(''); setShowFilters(false) }} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm ${!selectedCategory ? 'bg-brand-50 text-brand-700' : 'text-ink-600'}`}>Tümü</button>
                      {categories.map(cat => (
                        <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false) }} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm ${selectedCategory === cat.slug ? 'bg-brand-50 text-brand-700' : 'text-ink-600'}`}>
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-ink-900 mb-3">Fiyat Aralığı</h4>
                    <Slider defaultValue={[0, 1000]} max={1000} step={10} value={[minPrice, maxPrice]} onValueChange={(value) => { setMinPrice(value[0]); setMaxPrice(value[1]) }} />
                    <div className="flex justify-between text-sm text-ink-500 mt-2">
                      <span>{minPrice} TL</span>
                      <span>{maxPrice} TL</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-brand-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {products.map(product => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {products.map((product, i) => (
                      <button
                        key={product.id}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${currentPage === i + 1 ? 'bg-brand-500 text-ink-900' : 'bg-white border border-ink-200 text-ink-600 hover:text-brand-600 hover:border-brand-300'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-300 border-t-gold-500 rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
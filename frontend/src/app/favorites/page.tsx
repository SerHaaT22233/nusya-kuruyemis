'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

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

interface Favorite {
  id: string
  product: Product
}

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  useEffect(() => {
    if (user) {
      api.get('/orders/favorites')
        .then(res => setFavorites(res.data))
        .catch(() => setFavorites([]))
        .finally(() => setLoadingFavorites(false))
    } else {
      setLoadingFavorites(false)
    }
  }, [user])

  const removeFavorite = async (favoriteId: string) => {
    try {
      await api.delete(`/orders/favorites/${favoriteId}`)
      setFavorites(favorites.filter(f => f.id !== favoriteId))
      toast.success('Favoriden kaldırıldı')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  if (loading || loadingFavorites) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Heart className="w-16 h-16 text-ink-900/20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-ink-900 mb-3">Favorilerim</h1>
          <p className="text-ink-900/50 mb-8">Favorilerinizi görmek için giriş yapın</p>
          <Link href="/account" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-full hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            Giriş Yap
            <ArrowRight className="w-4 h-4" />
          </Link>
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
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Favorilerim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Beğendiklerim</h1>
        </motion.div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-ink-900/10 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-ink-900 mb-3">Henüz favori ürününüz yok</h2>
            <p className="text-ink-900/50 mb-8 max-w-md mx-auto">Beğendiğiniz ürünleri favorilere ekleyin, kolayca bulun</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-full hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
              <ShoppingBag className="w-4 h-4" />
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-brand-50-card rounded-2xl overflow-hidden border border-ink-200 hover:border-brand-400 transition-all duration-500"
              >
                <Link href={`/products/${favorite.product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-brand-50">
                    <Image
                      src={(favorite.product.images as any[])?.[0]?.imageUrl || '/placeholder.jpg'}
                      alt={favorite.product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {favorite.product.discountedPrice && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-brand-500 to-sun-500 text-black text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-brand-500/30">
                        %{Math.round((1 - favorite.product.discountedPrice / favorite.product.price) * 100)} İNDİRİM
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-medium text-brand-500/80 uppercase tracking-wider mb-2">
                      {favorite.product.category?.name}
                    </p>
                    <h3 className="text-base font-semibold text-ink-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors duration-300">
                      {favorite.product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        {favorite.product.discountedPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-brand-600">{favorite.product.discountedPrice} TL</span>
                            <span className="text-sm text-ink-900/30 line-through">{favorite.product.price} TL</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-brand-600">{favorite.product.price} TL</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); removeFavorite(favorite.id) }}
                        className="p-2 text-ink-900/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
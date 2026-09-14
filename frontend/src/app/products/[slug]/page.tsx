'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/cart-context'
import ProductCard from '@/components/product-card'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discountedPrice?: number
  stock: number
  images: string[]
  category: { name: string; slug: string }
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${params.slug}`)
      .then(res => {
        setProduct(res.data)
        return api.get(`/products?category=${res.data.category.slug}&limit=4`)
      })
      .then(res => setRelatedProducts(res.data.products))
      .finally(() => setLoading(false))
  }, [params.slug])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product.id, quantity)
    toast.success('Ürün sepete eklendi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-brand-50-card rounded-3xl" />
              <div className="space-y-6">
                <div className="h-6 bg-brand-50-card rounded-xl w-1/4" />
                <div className="h-10 bg-brand-50-card rounded-xl w-3/4" />
                <div className="h-8 bg-brand-50-card rounded-xl w-1/4" />
                <div className="h-24 bg-brand-50-card rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Ürün bulunamadı</h1>
          <p className="text-ink-900/50">Aradığınız ürün mevcut değil.</p>
        </div>
      </div>
    )
  }

  const currentPrice = product.discountedPrice || product.price

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-900/40 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-600 transition-colors">Ürünler</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-600 transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-ink-900/80">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-50-card border border-ink-200">
              <Image
                src={product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-brand-50-card border border-ink-200 flex-shrink-0">
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <div>
              <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">
                {product.category.name}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4 tracking-tight">{product.name}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-brand-600">{currentPrice} TL</span>
                {product.discountedPrice && (
                  <span className="text-lg text-ink-900/30 line-through">{product.price} TL</span>
                )}
              </div>

              {product.description && (
                <p className="text-ink-900/50 leading-relaxed mb-8">{product.description}</p>
              )}

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-4">Miktar</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-ink-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-brand-50 transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4 text-ink-900/70" />
                    </button>
                    <span className="px-6 py-3 font-semibold text-ink-900 min-w-[48px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-brand-50 transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4 text-ink-900/70" />
                    </button>
                  </div>
                  <span className="text-sm text-ink-900/40">{product.stock} adet stokta</span>
                </div>
              </div>

              <div className="flex gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-2xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Sepete Ekle
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-4 border border-ink-200 rounded-2xl hover:border-brand-400 hover:bg-brand-500/[0.06] transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-ink-900/70'}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-ink-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-brand-500" />
                  <span className="text-xs text-ink-900/50">Hızlı Kargo</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="w-5 h-5 text-brand-500" />
                  <span className="text-xs text-ink-900/50">Güvenli</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-5 h-5 text-brand-500" />
                  <span className="text-xs text-ink-900/50">İade</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-2">Benzer Ürünler</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink-900">Beğenebileceğiniz Diğer Ürünler</h2>
              </div>
              <Link href={`/products?category=${product.category.slug}`} className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors duration-300">
                Tümünü Gör
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

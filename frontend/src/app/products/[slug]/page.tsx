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
    if (!params?.slug) return
    setLoading(true)
    api.get(`/products/${params.slug}`)
      .then(res => {
        setProduct(res.data)
        return api.get(`/products?category=${res.data.category.slug}&limit=4`)
      })
      .then(res => setRelatedProducts(res.data.products))
      .finally(() => setLoading(false))
  }, [params?.slug])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product.id, quantity)
    toast.success('Ürün sepete eklendi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-4">Ürün bulunamadı</h1>
          <Link href="/products" className="text-brand-600 hover:text-brand-700">Ürünlere Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl overflow-hidden bg-brand-100 border border-ink-200">
            <Image
              src={(product.images as any[])?.[0]?.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink-900 mb-4">{product.name}</h1>
            <p className="text-ink-600 mb-6">{product.description}</p>
            <div className="flex items-center gap-4 mb-8">
              {product.discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-brand-600">{product.discountedPrice} TL</span>
                  <span className="text-lg text-ink-400 line-through">{product.price} TL</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-ink-900">{product.price} TL</span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-ink-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-brand-50">
                  <Minus className="w-4 h-4 text-ink-600" />
                </button>
                <span className="px-6 py-3 font-semibold text-ink-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-brand-50">
                  <Plus className="w-4 h-4 text-ink-600" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-white font-semibold rounded-xl hover:shadow-glow-brand transition-all duration-300">
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Sepete Ekle
              </button>
            </div>
            <div className="space-y-3 text-sm text-ink-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-500" />
                Ücretsiz kargo (500 TL üzeri)
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-500" />
                Güvenli ödeme
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-brand-500" />
                14 gün iade garantisi
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">İlgili Ürünler</h2>
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
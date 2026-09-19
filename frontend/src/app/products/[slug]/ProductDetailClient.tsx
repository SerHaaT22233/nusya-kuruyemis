'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Star, MessageSquare, Send, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import ProductCard from '@/components/product-card'
import toast from 'react-hot-toast'

interface Review {
  id: string
  userId: string
  user: { firstName: string; lastName: string }
  rating: number
  comment?: string
  isApproved: boolean
  createdAt: string
}

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

export default function ProductDetailClient() {
  const params = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!params?.slug) return
    setLoading(true)
    api.get(`/products/${params.slug}`)
      .then(res => {
        setProduct(res.data)
        return api.get(`/products?category=${res.data.category.slug}&limit=8`)
      })
      .then(res => {
        const all = res.data.products || res.data
        setRelatedProducts(all.filter((p: Product) => p.id !== product?.id).slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [params?.slug, product?.id])

  useEffect(() => {
    if (!product) return
    api.get(`/reviews?productId=${product.id}`)
      .then(res => setReviews(res.data))
      .catch(() => {})
  }, [product?.id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product.id, quantity)
    toast.success('Ürün sepete eklendi!')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return
    setSubmittingReview(true)
    try {
      await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment
      })
      toast.success('Yorumunuz gönderildi!')
      setReviewComment('')
      setReviewRating(5)
      api.get(`/reviews?productId=${product.id}`).then(res => setReviews(res.data))
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSubmittingReview(false)
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

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

        {/* REVIEWS SECTION */}
        <section className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-brand-500" />
                Müşteri Yorumları
              </h2>
              {reviews.length === 0 ? (
                <div className="bg-brand-50-card rounded-2xl border border-ink-200 p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-ink-300 mx-auto mb-4" />
                  <p className="text-ink-600">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.filter(r => r.isApproved).map(review => (
                    <div key={review.id} className="bg-brand-50-card rounded-2xl border border-ink-200 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-ink-900">{review.user.firstName} {review.user.lastName}</p>
                          <p className="text-xs text-ink-400">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-sun-500 fill-sun-500' : 'text-ink-300'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-ink-600 text-sm leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="bg-brand-50-card rounded-2xl border border-ink-200 p-6">
                <h3 className="font-bold text-ink-900 mb-4">Yorum Yap</h3>
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Puan</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                            <Star className={`w-6 h-6 ${star <= reviewRating ? 'text-sun-500 fill-sun-500' : 'text-ink-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Yorum</label>
                      <textarea
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Ürün hakkında düşüncelerinizi yazın..."
                        className="w-full px-4 py-3 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-white font-semibold rounded-xl hover:shadow-glow-brand transition-all duration-300 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {submittingReview ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-ink-600 text-sm mb-4">Yorum yapmak için giriş yapın</p>
                    <Link href="/account" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-sun-500 text-white font-semibold rounded-xl hover:shadow-glow-brand transition-all duration-300">
                      <User className="w-4 h-4" />
                      Giriş Yap
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
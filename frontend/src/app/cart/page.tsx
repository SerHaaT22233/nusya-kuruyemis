'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'

export default function CartPage() {
  const { items, loading, updateQuantity, removeFromCart, subtotal } = useCart()
  const { user } = useAuth()
  const [couponCode, setCouponCode] = useState('')

  const shippingCost = subtotal > 500 ? 0 : 49.90
  const total = subtotal + shippingCost

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-ink-500" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 mb-3">Sepetiniz Boş</h1>
          <p className="text-ink-500 mb-8">Alışverişe başlamak için ürünlerimize göz atın</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 font-semibold rounded-full hover:shadow-glow-brand transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            Ürünleri Gör
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
        >
          <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-3">Sepetim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-10">Sepetim</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-ink-200 hover:border-brand-300 transition-all duration-300 shadow-card"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0 border border-ink-200">
                    <Image
                      src={(item.product.images as any[])?.[0]?.imageUrl || '/placeholder.jpg'}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-ink-900 mb-1 truncate">{item.product.name}</h3>
                        <p className="text-sm text-ink-500 mb-3">{item.product.category?.name}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-ink-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-ink-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2.5 hover:bg-brand-50 transition-colors duration-300"
                        >
                          <Minus className="w-3.5 h-3.5 text-ink-600" />
                        </button>
                        <span className="px-4 py-2.5 font-semibold text-ink-900 text-sm min-w-[40px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2.5 hover:bg-brand-50 transition-colors duration-300"
                        >
                          <Plus className="w-3.5 h-3.5 text-ink-600" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-600 text-lg">
                          {(item.product.discountedPrice || item.product.price) * item.quantity} TL
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-ink-500">{(item.product.discountedPrice || item.product.price)} TL / adet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8 sticky top-28 shadow-card"
            >
              <h2 className="text-xl font-bold text-ink-900 mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-ink-600">
                  <span>Ara Toplam</span>
                  <span className="text-ink-900 font-medium">{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Kargo</span>
                  <span className={shippingCost === 0 ? 'text-nut-600 font-medium' : 'text-ink-900 font-medium'}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toFixed(2)} TL`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-ink-500">500 TL üzeri kargo bedava</p>
                )}
                <div className="border-t border-ink-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-ink-900">Toplam</span>
                    <span className="text-brand-600">{total.toFixed(2)} TL</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                  <input
                    type="text"
                    placeholder="Kupon kodu"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                  />
                </div>
                <button className="w-full mt-3 py-3 border border-ink-200 rounded-xl text-sm font-medium text-ink-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all duration-300">
                  Kuponu Uygula
                </button>
              </div>

              <Link
                href={user ? '/checkout' : '/account'}
                className="block w-full text-center py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 font-semibold rounded-2xl hover:shadow-glow-brand transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {user ? 'Siparişi Tamamla' : 'Giriş Yap'}
              </Link>

              <Link href="/products" className="block text-center mt-4 text-sm text-ink-500 hover:text-brand-600 transition-colors duration-300">
                Alışverişe Devam Et
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
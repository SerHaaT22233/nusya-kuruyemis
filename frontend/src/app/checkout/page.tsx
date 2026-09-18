'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CreditCard, Wallet, Truck, Lock, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    addressLine: '',
    city: '',
    district: '',
    email: '',
    orderNote: '',
    paymentMethod: 'Havale/EFT'
  })

  const shippingCost = subtotal > 500 ? 0 : 49.90
  const total = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/orders', {
        shippingAddress: `${formData.firstName} ${formData.lastName}\n${formData.phone}\n${formData.addressLine}`,
        city: formData.city,
        district: formData.district,
        phone: formData.phone,
        email: formData.email,
        orderNote: formData.orderNote || null,
        paymentMethod: formData.paymentMethod,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })

      await clearCart()
      toast.success('Siparişiniz başarıyla oluşturuldu!')
      router.push('/account?tab=orders')
    } catch (error) {
      toast.error('Sipariş oluşturulurken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push('/account')
    return null
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
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
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Ödeme</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Siparişi Tamamla</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-brand-50-card rounded-2xl border border-ink-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-ink-900 mb-6">Teslimat Bilgileri</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-900/70 mb-2">Ad</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                        placeholder="Ahmet"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-900/70 mb-2">Soyad</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                        placeholder="Yılmaz"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900/70 mb-2">Telefon</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900/70 mb-2">E-posta</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-900/70 mb-2">Şehir</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                        placeholder="İstanbul"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-900/70 mb-2">İlçe</label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                        placeholder="Kadıköy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900/70 mb-2">Adres</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.addressLine}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300 resize-none"
                      placeholder="Mahalle, sokak, no..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900/70 mb-2">Sipariş Notu (Opsiyonel)</label>
                    <textarea
                      rows={2}
                      value={formData.orderNote}
                      onChange={(e) => setFormData({ ...formData, orderNote: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300 resize-none"
                      placeholder="Özel istekleriniz..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-brand-50-card rounded-2xl border border-ink-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-ink-900 mb-6">Ödeme Yöntemi</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${formData.paymentMethod === 'Havale/EFT' ? 'border-brand-500/50 bg-brand-500/[0.06]' : 'border-ink-200/[0.08] hover:border-brand-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Havale/EFT"
                      checked={formData.paymentMethod === 'Havale/EFT'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-ink-200">
                      <Wallet className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-ink-900">Havale/EFT</p>
                      <p className="text-sm text-ink-900/40 mt-0.5">Banka havalesi ile ödeme</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'Havale/EFT' ? 'border-brand-500' : 'border-ink-200/[0.15]'}`}>
                      {formData.paymentMethod === 'Havale/EFT' && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${formData.paymentMethod === 'Kapıda Ödeme' ? 'border-brand-500/50 bg-brand-500/[0.06]' : 'border-ink-200/[0.08] hover:border-brand-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Kapıda Ödeme"
                      checked={formData.paymentMethod === 'Kapıda Ödeme'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-ink-200">
                      <Truck className="w-5 h-5 text-ink-900/50" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-ink-900">Kapıda Ödeme</p>
                      <p className="text-sm text-ink-900/40 mt-0.5">Nakit veya kart ile ödeme</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'Kapıda Ödeme' ? 'border-brand-500' : 'border-ink-200/[0.15]'}`}>
                      {formData.paymentMethod === 'Kapıda Ödeme' && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-brand-50-card rounded-2xl border border-ink-200 p-6 sm:p-8 sticky top-28"
              >
                <h2 className="text-xl font-bold text-ink-900 mb-6">Sipariş Özeti</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-ink-900/80 truncate">{item.product.name}</p>
                        <p className="text-ink-900/40 text-xs mt-0.5">x{item.quantity}</p>
                      </div>
                      <span className="text-ink-900/80 font-medium flex-shrink-0">
                        {(item.product.discountedPrice || item.product.price) * item.quantity} TL
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-ink-200 pt-4 space-y-3">
                  <div className="flex justify-between text-ink-900/60">
                    <span>Ara Toplam</span>
                    <span className="text-ink-900">{subtotal.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-ink-900/60">
                    <span>Kargo</span>
                    <span className={shippingCost === 0 ? 'text-green-400' : 'text-ink-900'}>
                      {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toFixed(2)} TL`}
                    </span>
                  </div>
                  <div className="border-t border-ink-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-ink-900">Toplam</span>
                      <span className="text-brand-600">{total.toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-2xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-ink-900/40">
                  <Lock className="w-3.5 h-3.5" />
                  256-bit SSL güvenli ödeme
                </div>
                {formData.paymentMethod === 'Havale/EFT' && (
                  <div className="mt-4 p-4 bg-brand-500/[0.06] rounded-xl border border-brand-500/20">
                    <p className="text-xs font-medium text-brand-600 mb-2">Banka Bilgilerimiz:</p>
                    <div className="text-xs text-ink-900/70 space-y-1">
                      <p><span className="font-medium">Banka:</span> Ziraat Bankası</p>
                      <p><span className="font-medium">IBAN:</span> TR00 0001 1111 2222 3333 4444</p>
                      <p><span className="font-medium">Hesap Adı:</span> Nusya Kuruyemiş A.Ş.</p>
                    </div>
                    <p className="text-xs text-ink-900/40 mt-2">Siparişiniz onaylandıktan sonra kargo firmasına teslim edilir. Ödeme onayı için lütfen dekontunuzu sipariş numarası ile birlikte info@nusyakuruyemis.com adresine gönderin.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
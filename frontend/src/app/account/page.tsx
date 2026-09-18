'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Lock, LogOut, ChevronRight, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface OrderItem {
  productName: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: string
  city: string
  district: string
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  CONFIRMED: { label: 'Onaylandı', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  PROCESSING: { label: 'Hazırlanıyor', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  SHIPPED: { label: 'Kargoya Verildi', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELLED: { label: 'İptal Edildi', color: 'text-discount-400 bg-red-400/10 border-red-400/20' },
}

function AccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams?.get('tab') || 'profile'
  const { user, loading, login, register, logout, updateUser } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true
    const cleaned = phone.replace(/\s/g, '').replace(/-/g, '').replace(/[()]/g, '').replace(/\+/g, '')
    const re = /^(\+90|0)?5\d{9}$/
    return re.test(cleaned)
  }

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.startsWith('90')) {
      return '+90 ' + cleaned.slice(2).replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
    }
    if (cleaned.startsWith('0')) {
      return '0' + cleaned.slice(1).replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, ' $1 $2 $3 $4')
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
  }

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' }
    if (!/[A-Z]/.test(password)) return { valid: false, message: 'Şifrede en az bir büyük harf olmalıdır' }
    if (!/[a-z]/.test(password)) return { valid: false, message: 'Şifrede en az bir küçük harf olmalıdır' }
    if (!/[0-9]/.test(password)) return { valid: false, message: 'Şifrede en az bir rakam olmalıdır' }
    return { valid: true, message: '' }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      router.push('/admin')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' })
      api.get('/orders').then(res => setOrders(res.data))
      api.get('/orders/addresses').then(res => setAddresses(res.data))
    }
  }, [user])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!isLogin) {
      if (!authForm.name.trim()) errors.name = 'Ad Soyad gerekli'
      if (!validateEmail(authForm.email)) errors.email = 'Geçerli bir e-posta girin'
      if (authForm.phone && !validatePhone(authForm.phone)) errors.phone = 'Geçerli bir telefon numarası girin'
      const pwdCheck = validatePassword(authForm.password)
      if (!pwdCheck.valid) errors.password = pwdCheck.message
    } else {
      if (!validateEmail(authForm.email)) errors.email = 'Geçerli bir e-posta girin'
      if (!authForm.password) errors.password = 'Şifre gerekli'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Lütfen hataları düzeltin')
      return
    }

    setFormErrors({})
    try {
      if (isLogin) {
        await login(authForm.email, authForm.password)
        toast.success('Giriş başarılı!')
      } else {
        await register(authForm.name, authForm.email, authForm.password, authForm.phone)
        toast.success('Kayıt başarılı!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu')
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.put('/auth/profile', profileForm)
      updateUser(res.data)
      toast.success('Profil güncellendi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put('/auth/change-password', passwordForm)
      toast.success('Şifre değiştirildi')
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-ink-900 mb-2">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h1>
            <p className="text-ink-500">Hesabınıza erişmek için giriş yapın</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8"
          >
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    value={authForm.name}
                    onChange={(e) => { setAuthForm({ ...authForm, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }) }}
                    required
                    className={`w-full px-4 py-3.5 bg-brand-50 border rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-1 transition-all duration-300 ${formErrors.name ? 'border-discount-500 focus:border-discount-500 focus:ring-discount-200' : 'border-ink-200 focus:border-brand-400 focus:ring-brand-200'}`}
                  />
                  {formErrors.name && <p className="text-xs text-discount-600 mt-1">{formErrors.name}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">E-posta</label>
                <input
                  type="email"
                  placeholder="ornek@email.com"
                  value={authForm.email}
                  onChange={(e) => { setAuthForm({ ...authForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: '' }) }}
                  required
                  className={`w-full px-4 py-3.5 bg-brand-50 border rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-1 transition-all duration-300 ${formErrors.email ? 'border-discount-500 focus:border-discount-500 focus:ring-discount-200' : 'border-ink-200 focus:border-brand-400 focus:ring-brand-200'}`}
                />
                {formErrors.email && <p className="text-xs text-discount-600 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Şifre</label>
                <input
                  type="password"
                  placeholder={isLogin ? '••••••••' : 'En az 8 karakter, büyük/küçük harf ve rakam'}
                  value={authForm.password}
                  onChange={(e) => { setAuthForm({ ...authForm, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: '' }) }}
                  required
                  className={`w-full px-4 py-3.5 bg-brand-50 border rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-1 transition-all duration-300 ${formErrors.password ? 'border-discount-500 focus:border-discount-500 focus:ring-discount-200' : 'border-ink-200 focus:border-brand-400 focus:ring-brand-200'}`}
                />
                {formErrors.password && <p className="text-xs text-discount-600 mt-1">{formErrors.password}</p>}
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Telefon (İsteğe Bağlı)</label>
                  <input
                    type="tel"
                    placeholder="+90 555 123 45 67"
                    value={authForm.phone}
                    onChange={(e) => { setAuthForm({ ...authForm, phone: formatPhone(e.target.value) }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' }) }}
                    className={`w-full px-4 py-3.5 bg-brand-50 border rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-1 transition-all duration-300 ${formErrors.phone ? 'border-discount-500 focus:border-discount-500 focus:ring-discount-200' : 'border-ink-200 focus:border-brand-400 focus:ring-brand-200'}`}
                  />
                  {formErrors.phone && <p className="text-xs text-discount-600 mt-1">{formErrors.phone}</p>}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-2xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>
          </motion.div>

          <p className="text-center mt-6 text-ink-500">
            {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-600 font-semibold ml-1 hover:text-brand-700 transition-colors duration-300"
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: Package },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
    { id: 'password', label: 'Şifre Değiştir', icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Hesabım</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Hoş geldin, {user.firstName || user.email}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl border border-ink-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-brand-500/10 to-transparent border-b border-ink-200">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-300 flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-lg font-bold text-ink-900">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-ink-500 mt-0.5">{user.email}</p>
              </div>
              <nav className="p-3">
                {menuItems.map(item => (
                  <Link
                    key={item.id}
                    href={`/account?tab=${item.id}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${tab === item.id ? 'bg-brand-50 text-brand-600' : 'text-ink-600 hover:text-ink-900 hover:bg-brand-50'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-discount-400 hover:bg-discount-500/10 transition-all duration-300 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </button>
              </nav>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-ink-900 mb-6">Profil Bilgileri</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Ad</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3.5 bg-brand-50/50 border border-ink-200 rounded-xl text-ink-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Kaydet
                  </button>
                </form>
              </motion.div>
            )}

            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold text-ink-900 mb-6">Siparişlerim</h2>
                <div className="space-y-4">
                  {orders.map(order => {
                    const status = statusMap[order.status] || { label: order.status, color: 'text-ink-600 bg-brand-50 border-ink-300' }
                    return (
                      <div key={order.id} className="bg-white rounded-2xl border border-ink-200 p-6 hover:border-brand-400 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <p className="text-sm text-ink-500">Sipariş #{order.orderNumber}</p>
                            <p className="text-sm text-ink-500 mt-1">{new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="border-t border-ink-200 pt-4 space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-ink-600">{item.productName} x{item.quantity}</span>
                              <span className="text-ink-700">{item.price * item.quantity} TL</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-ink-200 pt-4 mt-4 flex justify-between font-bold">
                          <span className="text-ink-900">Toplam</span>
                          <span className="text-brand-600">{order.totalAmount} TL</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {tab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold text-ink-900 mb-6">Adreslerim</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-white rounded-2xl border border-ink-200 p-6 hover:border-brand-400 transition-all duration-300">
                      <h3 className="font-semibold text-ink-900 mb-2">{addr.firstName} {addr.lastName}</h3>
                      <p className="text-ink-600 text-sm">{addr.phone}</p>
                      <p className="text-ink-600 text-sm">{addr.addressLine}</p>
                      <p className="text-ink-600 text-sm">{addr.city}/{addr.district}</p>
                      {addr.postalCode && <p className="text-ink-600 text-sm">{addr.postalCode}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'password' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-ink-900 mb-6">Şifre Değiştir</h2>
                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Mevcut Şifre</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Yeni Şifre</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Şifreyi Değiştir
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-200 border-t-orange-500 rounded-full animate-spin" /></div>}>
      <AccountContent />
    </Suspense>
  )
}
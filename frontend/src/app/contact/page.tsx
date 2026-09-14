'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/contact', formData)
      toast.success('Mesajınız başarıyla gönderildi!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
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
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">İletişim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Bize Ulaşın</h1>
          <p className="text-ink-900/50 max-w-xl">Sorularınız, önerileriniz veya sipariş destekleri için bizimle iletişime geçebilirsiniz.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-brand-50-card rounded-2xl border border-ink-200 p-6 sm:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-900/70 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                      placeholder="Ahmet Yılmaz"
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-900/70 mb-2">Konu</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300"
                    placeholder="Sipariş desteği"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-900/70 mb-2">Mesaj</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-brand-50 border border-ink-200 rounded-xl text-ink-900 placeholder:text-ink-900/30 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 transition-all duration-300 resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-2xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gönder
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-brand-50-card rounded-2xl border border-ink-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 border border-brand-200 rounded-2xl">
                  <Phone className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Telefon</h3>
                  <p className="text-sm text-ink-900/60">+90 555 123 45 67</p>
                  <p className="text-xs text-ink-900/40 mt-1">Pazartesi - Cumartesi, 09:00 - 18:00</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-brand-50-card rounded-2xl border border-ink-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 border border-brand-200 rounded-2xl">
                  <Mail className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">E-posta</h3>
                  <p className="text-sm text-ink-900/60">info@nusya.com</p>
                  <p className="text-xs text-ink-900/40 mt-1">24 saat içinde yanıt veriyoruz</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-brand-50-card rounded-2xl border border-ink-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">WhatsApp</h3>
                  <p className="text-sm text-ink-900/60">+90 555 123 45 67</p>
                  <p className="text-xs text-ink-900/40 mt-1">Anında mesaj desteği</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-brand-50-card rounded-2xl border border-ink-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Adres</h3>
                  <p className="text-sm text-ink-900/60">İstanbul, Türkiye</p>
                  <p className="text-xs text-ink-900/40 mt-1">Merkez ofis</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface SiteSettings {
  siteName: string
  phone: string
  email: string
  address: string
  workingHours: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Nusya Kuruyemiş',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    primaryColor: '#FF6B00',
    secondaryColor: '#FFB703',
    accentColor: '#22C55E',
    logoUrl: '/logo.svg'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      toast.success('Ayarlar kaydedildi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <span className="inline-block text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Yönetim</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Ayarlar</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-ink-800 rounded-2xl border border-ink-600 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Site Adı</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">Telefon</label>
                <input type="text" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">E-posta</label>
                <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Adres</label>
              <textarea rows={2} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Çalışma Saatleri</label>
              <input type="text" value={settings.workingHours} onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })} className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all duration-300" />
            </div>

            <div className="border-t border-ink-700 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tasarım</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Ana Renk</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-ink-600 cursor-pointer" />
                    <input type="text" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="flex-1 px-3 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">İkincil Renk</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-ink-600 cursor-pointer" />
                    <input type="text" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="flex-1 px-3 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">Vurgu Renk</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-ink-600 cursor-pointer" />
                    <input type="text" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="flex-1 px-3 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-brand-500/40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-ink-700 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Logo</h3>
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">Logo URL</label>
                <input type="text" value={settings.logoUrl} onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} placeholder="/logo.svg" className="w-full px-4 py-3.5 bg-ink-900 border border-ink-600 rounded-xl text-white placeholder:text-ink-500 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all duration-300" />
                <p className="text-xs text-ink-500 mt-2">Logo dosyası /public klasörüne yüklenebilir. SVG, PNG veya JPG formatında olabilir.</p>
              </div>
            </div>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-sun-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

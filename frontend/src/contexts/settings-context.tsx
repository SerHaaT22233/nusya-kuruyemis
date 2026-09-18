'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '@/lib/api'

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

const defaultSettings: SiteSettings = {
  siteName: 'Nusya Kuruyemiş',
  phone: '+90 535 227 35 44',
  email: 'info@nusya.com',
  address: 'Mersin, Türkiye',
  workingHours: 'Pazartesi - Cumartesi, 09:00 - 18:00',
  primaryColor: '#FF6B00',
  secondaryColor: '#FFB703',
  accentColor: '#22C55E',
  logoUrl: '/logo.svg'
}

interface SettingsContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  loading: true
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch settings from API
    api.get('/admin/settings')
      .then(res => {
        if (res.data) {
          setSettings({ ...defaultSettings, ...res.data })
        }
      })
      .catch(() => {
        // Fallback to localStorage
        const saved = localStorage.getItem('siteSettings')
        if (saved) {
          try {
            setSettings({ ...defaultSettings, ...JSON.parse(saved) })
          } catch {}
        }
      })
      .finally(() => setLoading(false))

    // Listen for settings updates from admin panel
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings({ ...defaultSettings, ...event.detail })
    }
    window.addEventListener('siteSettingsUpdated' as any, handleSettingsUpdate)
    return () => {
      window.removeEventListener('siteSettingsUpdated' as any, handleSettingsUpdate)
    }
  }, [])

  // Apply CSS variables when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--brand-500', settings.primaryColor)
      root.style.setProperty('--brand-600', settings.primaryColor)
      root.style.setProperty('--brand-700', settings.primaryColor)
      root.style.setProperty('--sun-500', settings.secondaryColor)
      root.style.setProperty('--sun-600', settings.secondaryColor)
      root.style.setProperty('--sun-700', settings.secondaryColor)
      root.style.setProperty('--accent-500', settings.accentColor)
      root.style.setProperty('--accent-600', settings.accentColor)
      root.style.setProperty('--accent-700', settings.accentColor)
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteSettings', JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { detail: updated }))
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
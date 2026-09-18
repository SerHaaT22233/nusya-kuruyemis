'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useSettings } from '@/contexts/settings-context'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const { settings } = useSettings()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCatOpen, setIsCatOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {})
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-50/95 backdrop-blur-xl shadow-card border-b border-ink-300/60' : 'bg-brand-50/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src={settings.logoUrl || '/logo.svg'} alt="Nusya" width={64} height={64} className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="relative px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors duration-300 rounded-full hover:bg-brand-50">
              Ana Sayfa
            </Link>
            <Link href="/products" className="relative px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors duration-300 rounded-full hover:bg-brand-50">
              Ürünler
            </Link>
            <div className="relative group">
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors duration-300 rounded-full hover:bg-brand-50"
              >
                Kategoriler
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCatOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-ink-200 py-2 z-50">
                  <Link href="/products" className="block px-4 py-2.5 text-sm text-ink-700 hover:text-brand-600 hover:bg-brand-50 transition-colors duration-300">
                    Tümü
                  </Link>
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`} className="block px-4 py-2.5 text-sm text-ink-700 hover:text-brand-600 hover:bg-brand-50 transition-colors duration-300">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative group">
              <Link href="/cart" className="relative p-2.5 text-ink-600 hover:text-brand-600 transition-colors duration-300 rounded-full hover:bg-brand-50">
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-brand-500/30">
                    {items.length}
                  </span>
                )}
              </Link>
              {items.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-cream rounded-2xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-4 border border-ink-200/60">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-50 border border-ink-200 overflow-hidden flex-shrink-0">
                          <Image src={(item.product.images as any[])?.[0]?.imageUrl || '/placeholder.jpg'} alt="" width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-800 truncate">{item.product.name}</p>
                          <p className="text-xs text-ink-500">x{item.quantity}</p>
                          <p className="text-sm text-brand-600 font-medium">{(item.product.discountedPrice || item.product.price) * item.quantity} TL</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-ink-200 mt-3 pt-3">
                    <Link href="/cart" className="block w-full text-center py-2.5 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 text-sm font-semibold rounded-xl hover:shadow-glow-brand transition-all duration-300">
                      Sepeti Gör
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors duration-300 rounded-full hover:bg-brand-50">
                  <User className="w-4 h-4" />
                  <span>{user.firstName} {user.lastName}</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="px-3 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors duration-300">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="px-3 py-2 text-sm text-ink-500 hover:text-ink-800 transition-colors duration-300">
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link href="/account?tab=register" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-700 hover:text-brand-600 transition-all duration-300 rounded-full hover:bg-brand-50 border border-ink-200 hover:border-brand-300">
                  Kayıt Ol
                </Link>
                <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-900 hover:text-ink-900 transition-all duration-300 rounded-full bg-gradient-to-r from-brand-500 to-sun-500 hover:shadow-glow-brand">
                  <User className="w-4 h-4" />
                  <span>Giriş</span>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-ink-700 hover:text-brand-600 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-xl border-b border-ink-200/60">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/" className="block px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Ana Sayfa</Link>
            <Link href="/products" className="block px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Ürünler</Link>
            <Link href="/cart" className="block px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Sepet</Link>
            {user ? (
              <>
                <Link href="/account" className="block px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Hesabım</Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block px-4 py-3 text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Admin Panel</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Çıkış Yap</button>
              </>
            ) : (
              <Link href="/account" className="block px-4 py-3 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-300">Giriş Yap</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
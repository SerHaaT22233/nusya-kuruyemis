'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-ink-800 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
<Link href="/" className="inline-block mb-6">
            <Image src="/logo.svg" alt="Nusya" width={60} height={60} />
          </Link>
<p className="text-brand-300 text-sm leading-relaxed mb-8 max-w-xs">
              En kaliteli kuruyemişler en uygun prices. Taze ve lezzetli ürünler sizlerle.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2.5 rounded-full border border-ink-700 text-brand-200 hover:text-sun-500 hover:border-sun-500/40 hover:bg-sun-500/[0.08] transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-ink-700 text-brand-200 hover:text-sun-500 hover:border-sun-500/40 hover:bg-sun-500/[0.08] transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-ink-700 text-brand-200 hover:text-sun-500 hover:border-sun-500/40 hover:bg-sun-500/[0.08] transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Ana Sayfa</Link></li>
              <li><Link href="/products" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Ürünler</Link></li>
              <li><Link href="/cart" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Sepetim</Link></li>
              <li><Link href="/account" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Hesabım</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Kategoriler</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=antep-fistik" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Antep Fıstığı</Link></li>
              <li><Link href="/products?category=badem" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Badem</Link></li>
              <li><Link href="/products?category=findik" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Fındık</Link></li>
              <li><Link href="/products?category=kaju" className="text-sm text-brand-300 hover:text-sun-500 transition-colors duration-300">Kaju</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-sun-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300 hover:text-white transition-colors duration-300">+90 535 227 35 44</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-sun-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300 hover:text-white transition-colors duration-300">+90 555 433 33 56</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sun-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300 hover:text-white transition-colors duration-300">info@nusya.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sun-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300">Mersin, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-500 text-xs">
            © 2026 Nusya Kuruyemiş. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-brand-500 hover:text-brand-200 transition-colors duration-300">Gizlilik Politikası</a>
            <a href="#" className="text-xs text-brand-500 hover:text-brand-200 transition-colors duration-300">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
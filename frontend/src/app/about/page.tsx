'use client'

import { motion } from 'framer-motion'
import { Award, Users, Truck, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Hakkımızda</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 mb-4">Nusya Kuruyemiş</h1>
          <p className="text-ink-900/50 max-w-2xl mx-auto">En kaliteli kuruyemişleri sizlere sunmak için 2010 yılından beri hizmet veriyoruz.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wider mb-4">Hikayemiz</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-6">Taze ve Kaliteli</h2>
            <p className="text-ink-900/50 leading-relaxed mb-6">
              2010 yılında küçük bir aile işi olarak başlayan Nusya Kuruyemiş, bugün Türkiye'nin her yerine hizmet veren bir e-ticaret markasına dönüştü. Müşteri memnuniyetini ön planda tutan firmamız, tüm ürünlerini özenle seçer ve en taze haliyle kargoya verir.
            </p>
            <p className="text-ink-900/50 leading-relaxed mb-8">
              Antep fıstığından badem, fındıktan kajuya; en sevilen kuruyemiş çeşitlerini uygun fiyatlarla sunuyoruz. Amacımız, sofralarınıza en kaliteli ürünleri ulaştırmak.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors duration-300 group">
              Ürünleri Keşfet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Award, title: 'Kalite', desc: 'En iyi ürünler' },
              { icon: Users, title: 'Güven', desc: 'Binlerce müşteri' },
              { icon: Truck, title: 'Hız', desc: 'Hızlı teslimat' },
              { icon: Shield, title: 'Garanti', desc: 'Memnuniyet' },
            ].map((item, i) => (
              <div key={i} className="bg-brand-50-card rounded-2xl p-6 border border-ink-200 text-center hover:border-brand-300 transition-all duration-300">
                <item.icon className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <h3 className="font-semibold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-900/40">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-brand-50-card rounded-3xl border border-ink-200 p-8 sm:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-4">Neden Nusya?</h2>
          <p className="text-ink-900/50 max-w-2xl mx-auto mb-8">
            Amacımız, her müşterimize en kaliteli kuruyemişleri en uygun fiyatlarla sunmak. Taze, lezzetli ve doğal ürünler için Nusya Kuruyemiş'e güvenebilirsiniz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10+', label: 'Yıllık Tecrübe' },
              { value: '5.000+', label: 'Mutlu Müşteri' },
              { value: '50+', label: 'Ürün Çeşidi' },
              { value: '24h', label: 'Hızlı Kargo' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-brand-600 mb-1">{stat.value}</p>
                <p className="text-sm text-ink-900/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
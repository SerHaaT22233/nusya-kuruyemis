'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Star, Truck, Shield, Headphones, Award, ArrowRight, Check } from 'lucide-react'
import ProductCard from '@/components/product-card'
import LiveSalesPopup from '@/components/LiveSalesPopup'
import CountdownTimer from '@/components/CountdownTimer'
import api from '@/lib/api'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  discountedPrice?: number
  stock: number
  images: string[]
  category: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [topSelling, setTopSelling] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [liveSaleIndex, setLiveSaleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSaleIndex(prev => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    Promise.all([
      api.get('/products/featured'),
      api.get('/products/new'),
      api.get('/products/top-selling'),
      api.get('/categories')
    ]).then(([featured, newP, top, cats]) => {
      setFeaturedProducts(featured.data)
      setNewProducts(newP.data)
      setTopSelling(top.data)
      setCategories(cats.data)
    })
  }, [])

  return (
    <div className="overflow-hidden">
      {/* PROMO BAR */}
      <div className="bg-gradient-to-r from-brand-500 via-sun-500 to-brand-500 text-ink-900 text-xs font-medium py-2.5 text-center">
        🎉 Ücretsiz kargo! 500 TL üzeri所有 siparişlerde
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-brand-50 overflow-hidden">
<div className="absolute inset-0 bg-noise" style={{opacity: 0.03}} />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sun-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-nut-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-300 bg-brand-50 mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-medium text-brand-700 uppercase tracking-wider">Taze ve Doğal</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                <span className="block text-ink-900">Kavrulmuş Lezzet</span>
                <span className="block bg-gradient-to-r from-brand-600 via-sun-500 to-orange-500 bg-clip-text text-transparent">Tam Kararında</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg text-ink-600 max-w-xl mb-10 leading-relaxed"
              >
                En taze kuruyemişler, kuru meyveler ve özel karışımlar Nusya kalitesiyle. Her ısığında kavrulmuş lezzet.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 font-semibold rounded-full hover:shadow-glow-brand transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Ürünleri Keşfet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/products?category=kampanya"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-200 text-ink-700 font-medium rounded-full hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300"
                >
                  Kampanyalara Bak
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-sun-200/50 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400/30 to-sun-400/30" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">🥜</div>
                    <div className="text-6xl mb-2">🫒</div>
                    <div className="text-6xl">🌰</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Check, text: 'Taze Ürünler' },
              { icon: Shield, text: 'Güvenli Alışveriş' },
              { icon: Award, text: 'Kaliteli Seçim' },
              { icon: Truck, text: 'Hızlı Teslimat' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <item.icon className="w-5 h-5 text-brand-600" />
                <span className="text-xs text-ink-600 font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-100 to-transparent" />
      </section>

      {/* TRUST BAR */}
      <section className="relative bg-brand-50 border-y border-ink-200/60">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Truck, title: 'Hızlı Kargo', desc: '2-3 iş günü teslimat' },
              { icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL koruması' },
              { icon: Headphones, title: '7/24 Destek', desc: 'WhatsApp ile iletişim' },
              { icon: Award, title: 'Kalite Garantisi', desc: 'Taze ve lezzetli ürünler' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 group-hover:border-brand-400 group-hover:bg-brand-100 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{feature.title}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-brand-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-50 to-orange-50/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">Öne Çıkanlar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-ink-500 max-w-xl mx-auto">En çok tercih edilen kuruyemiş ürünlerimizi keşfedin</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">Kategoriler</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">Kategoriler</h2>
            <p className="text-ink-500 max-w-xl mx-auto">Aradığınız kuruyemişi kolayca bulun</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-ink-200 hover:border-brand-400 transition-all duration-500 flex items-end p-5 shadow-card hover:shadow-glow-brand"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-brown-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-brand-50 group-hover:text-sun-300 transition-colors duration-300">{category.name}</h3>
                    <p className="text-xs text-brand-200/70 mt-1">{category._count.products} ürün</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TOP SELLING */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">En Çok Satanlar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">En Çok Satanlar</h2>
            <p className="text-ink-500 max-w-xl mx-auto">Müşterilerimizin en çok tercih ettiği ürünler</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {topSelling.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW PRODUCTS */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">Yeni Ürünler</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">Yeni Ürünler</h2>
            <p className="text-ink-500 max-w-xl mx-auto">En taze ürünlerimizi sizler için ekledik</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {newProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-20 bg-gradient-to-r from-brand-500 to-sun-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise" style={{opacity: 0.05}} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <CountdownTimer 
            targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} 
            label="Kampanya Sonu" 
          />
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-20 bg-gradient-to-r from-brand-500 to-sun-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise" style={{opacity: 0.05}} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-sun-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-xs font-medium text-orange-800 uppercase tracking-wider mb-4">Özel Fırsat</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 mb-4">İlk Siparişinizde</h2>
            <p className="text-xl text-ink-900/90 font-semibold mb-8">%10 İndirim Kazanın</p>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-ink-200/30 rounded-2xl px-6 py-4 mb-8">
              <span className="text-sm text-ink-900/80">Kupon Kodu:</span>
              <span className="text-lg font-mono font-bold text-ink-900 tracking-wider">NUSYA10</span>
            </div>
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-ink-900 text-ink-900 font-semibold rounded-full hover:shadow-glow-brand transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Şimdi Alışveriş Yap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">Hakkımızda</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-6">Nusya Kuruyemiş</h2>
              <p className="text-ink-600 leading-relaxed mb-6">
                2010 yılından beri en kaliteli kuruyemişleri tüketicilerimize sunuyoruz. Tüm ürünlerimiz titizlikle seçilir, taze ve lezzetli olarak size ulaştırılır.
              </p>
              <p className="text-ink-600 leading-relaxed mb-8">
                Müşteri memnuniyeti bizim için önceliklidir. Her ürünümüz kalite kontrolünden geçer ve en taze haliyle kargoya verilir.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors duration-300 group">
                Tüm Ürünleri Gör
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-100 to-sun-100 border border-brand-200 flex items-center justify-center shadow-card">
                <Award className="w-24 h-24 text-brand-500/60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
<section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium text-brand-600 uppercase tracking-wider mb-4">Yorumlar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">Müşteri Yorumları</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: 'Ahmet Y.', text: 'Çok lezzetli ve taze ürünler. Hızlı kargo için teşekkürler.' },
              { name: 'Fatma K.', text: 'Antep)fığı gerçekten çok kaliteli. Tekrar sipariş vereceğim.' },
              { name: 'Mehmet D.', text: 'Fındıklar çok taze ve lezzetli. Fiyatları da uygun.' },
            ].map((review, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white rounded-2xl p-6 border border-ink-200 shadow-card hover:shadow-glow-brand transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-sun-500 fill-sun-500" />
                  ))}
                </div>
                <p className="text-ink-700 text-sm leading-relaxed mb-6">{review.text}</p>
                <p className="text-brand-600 font-semibold text-sm">{review.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <LiveSalesPopup />
    </div>
  )
}
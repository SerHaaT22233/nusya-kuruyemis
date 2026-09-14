'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountedPrice?: number
    images: string[]
    category?: { name: string }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product.id)
  }

  const imageUrl = product.images?.[0]?.imageUrl?.imageUrl || '/placeholder.jpg'

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-ink-200/60 hover:border-brand-400/60 transition-all duration-500 shadow-card hover:shadow-glow-brand"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-brand-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-brand-100 animate-pulse" />
          )}

          {product.discountedPrice && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-brand-500 to-sun-500 text-ink-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-brand-500/30">
              %{Math.round((1 - product.discountedPrice / product.price) * 100)} İNDİRİM
            </span>
          )}

          <button
            onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked) }}
            className="absolute top-3 right-3 p-2 bg-brand-50/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-50 hover:scale-110"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-ink-600'}`} />
          </button>

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-5">
          <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wider mb-2">
            {product.category?.name}
          </p>
          <h3 className="text-base font-semibold text-ink-900 mb-2 line-clamp-1 group-hover:text-brand-700 transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-4">
            <div>
              {product.discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-brand-600">{product.discountedPrice} TL</span>
                  <span className="text-sm text-ink-500 line-through">{product.price} TL</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-ink-900">{product.price} TL</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-brand-50 border border-brand-200 rounded-xl text-brand-700 hover:text-ink-900 hover:bg-brand-500 hover:border-brand-500 hover:shadow-glow-brand transition-all duration-300 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '@/lib/api'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    discountedPrice?: number
    images: string[]
    category?: { name: string }
  }
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const refreshCart = async () => {
    try {
      const res = await api.get('/cart')
      setItems(res.data.items || [])
    } catch (error) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addToCart = async (productId: string, quantity = 1) => {
    await api.post('/cart', { productId, quantity })
    await refreshCart()
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    await api.put(`/cart/${itemId}`, { quantity })
    await refreshCart()
  }

  const removeFromCart = async (itemId: string) => {
    await api.delete(`/cart/${itemId}`)
    await refreshCart()
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setItems([])
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, loading, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

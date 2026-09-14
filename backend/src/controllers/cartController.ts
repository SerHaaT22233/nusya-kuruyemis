import { Response } from 'express'
import prisma from '../config/database'
import { AuthRequest } from '../middleware/auth'

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    })

    if (!cart) {
      return res.json({ items: [], subtotal: 0 })
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    res.json({ ...cart, subtotal })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Geçersiz miktar' })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id }
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' })
    }

    if (product.stock < newQuantity) {
      return res.status(400).json({ message: 'Yetersiz stok' })
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    })

    res.json(updatedCart)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body
    const { itemId } = req.params

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    })

    if (!item || item.cart.userId !== req.user!.id) {
      return res.status(404).json({ message: 'Sepet öğesi bulunamadı' })
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } })
      return res.json({ message: 'Ürün sepetten kaldırıldı' })
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    })

    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Yetersiz stok' })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    res.json(updatedItem)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    })

    if (!item || item.cart.userId !== req.user!.id) {
      return res.status(404).json({ message: 'Sepet öğesi bulunamadı' })
    }

    await prisma.cartItem.delete({ where: { id: itemId } })

    res.json({ message: 'Ürün sepetten kaldırıldı' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    }

    res.json({ message: 'Sepet temizlendi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

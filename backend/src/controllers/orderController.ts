import { Response } from 'express'
import prisma from '../config/database'
import { AuthRequest } from '../middleware/auth'
import crypto from 'crypto'

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      paymentMethod,
      shippingAddress,
      city,
      district,
      phone,
      email,
      orderNote,
      couponCode,
      items
    } = req.body

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } } }
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Sepet boş' })
    }

    let totalAmount = cart.items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    let discountAmount = 0
    let couponId: string | undefined

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      })

      if (!coupon) {
        return res.status(400).json({ message: 'Geçersiz kupon kodu' })
      }

      const usageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: req.user!.id }
      })

      if (usageCount >= (coupon.perUserLimit || 1)) {
        return res.status(400).json({ message: 'Kupon kullanım limiti doldu' })
      }

      if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
        return res.status(400).json({ message: 'Minimum sipariş tutarına ulaşılamadı' })
      }

      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = totalAmount * (coupon.discountValue / 100)
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount)
        }
      } else {
        discountAmount = coupon.discountValue
      }

      totalAmount = Math.max(0, totalAmount - discountAmount)
      couponId = coupon.id
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: crypto.randomUUID(),
        userId: req.user!.id,
        shippingAddress,
        city,
        district,
        phone,
        email,
        orderNote,
        totalAmount,
        discountAmount,
        couponId,
        couponCode: couponCode || null,
        status: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            unit: item.product.unit,
            quantity: item.quantity,
            price: item.product.discountedPrice || item.product.price,
            totalPrice: (item.product.discountedPrice || item.product.price) * item.quantity
          }))
        }
      } as any,
      include: { items: true }
    })

    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      })

      await prisma.couponUsage.create({
        data: {
          couponId,
          userId: req.user!.id,
          orderId: order.id
        }
      })
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: { include: { product: { include: { category: true } } } },
        coupon: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        items: { include: { product: { include: { category: true } } } },
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        coupon: true
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json(addresses)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await prisma.address.create({
      data: { ...req.body, userId: req.user!.id }
    })

    res.status(201).json(address)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.address.deleteMany({
      where: { id: req.params.id, userId: req.user!.id }
    })

    res.json({ message: 'Adres silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: { product: { include: { category: true } } }
    })

    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body

    const favorite = await prisma.favorite.create({
      data: { userId: req.user!.id, productId }
    })

    res.status(201).json(favorite)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.favorite.deleteMany({
      where: { id: req.params.id, userId: req.user!.id }
    })

    res.json({ message: 'Favoriden kaldırıldı' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const validateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, totalAmount } = req.body

    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    })

    if (!coupon) {
      return res.status(400).json({ message: 'Geçersiz kupon kodu' })
    }

    const usageCount = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId: req.user!.id }
    })

    if (usageCount >= (coupon.perUserLimit || 1)) {
      return res.status(400).json({ message: 'Kupon kullanım limiti doldu' })
    }

    if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: 'Minimum sipariş tutarına ulaşılamadı' })
    }

    let discount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discount = totalAmount * (coupon.discountValue / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else {
      discount = coupon.discountValue
    }

    res.json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code
    })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

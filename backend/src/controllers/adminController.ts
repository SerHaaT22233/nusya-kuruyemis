import { Response } from 'express'
import prisma from '../config/database'

export const getDashboard = async (_req: any, res: Response) => {
  try {
    const [totalSales, totalOrders, totalCustomers, recentOrders, lowStock] = await Promise.all([
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { include: { product: true } }
        }
      }),
      prisma.product.findMany({
        where: { stock: { lt: 10 }, isActive: true },
        include: { category: true },
        orderBy: { stock: 'asc' }
      })
    ])

    res.json({
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      totalCustomers,
      recentOrders,
      lowStock
    })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getAllOrders = async (req: any, res: Response) => {
  try {
    const { status } = req.query
    const where: any = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        items: { include: { product: true } },
        coupon: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateOrderStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: true, items: true, coupon: true }
    })

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getAllUsers = async (_req: any, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const uploadImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya bulunamadı' })
    }

    res.json({ url: `/uploads/${req.file.filename}` })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getCoupons = async (_req: any, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })

    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getStats = async (_req: any, res: Response) => {
  try {
    const today = new Date()
    const labels: string[] = []
    const values: number[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      labels.push(d.toLocaleDateString('tr-TR', { weekday: 'short' }))

      const next = new Date(d)
      next.setDate(next.getDate() + 1)

      const orders = await prisma.order.count({
        where: {
          createdAt: { gte: d, lt: next }
        }
      })

      values.push(orders)
    }

    res.json({ labels, values })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createCoupon = async (req: any, res: Response) => {
  try {
    const coupon = await prisma.coupon.create({
      data: req.body
    })

    res.status(201).json(coupon)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateCoupon = async (req: any, res: Response) => {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(coupon)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteCoupon = async (req: any, res: Response) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } })
    res.json({ message: 'Kupon silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getBanners = async (_req: any, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    res.json(banners)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createBanner = async (req: any, res: Response) => {
  try {
    const banner = await prisma.banner.create({
      data: req.body
    })

    res.status(201).json(banner)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateBanner = async (req: any, res: Response) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(banner)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteBanner = async (req: any, res: Response) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id } })
    res.json({ message: 'Banner silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getCampaigns = async (_req: any, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(campaigns)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createCampaign = async (req: any, res: Response) => {
  try {
    const { productIds, ...campaignData } = req.body

    const campaign = await prisma.campaign.create({
      data: {
        ...campaignData,
        products: {
          create: productIds.map((productId: string) => ({ productId }))
        }
      },
      include: {
        products: {
          include: {
            product: { include: { category: true } }
          }
        }
      }
    })

    res.status(201).json(campaign)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateCampaign = async (req: any, res: Response) => {
  try {
    const { productIds, ...campaignData } = req.body

    await prisma.campaignProduct.deleteMany({
      where: { campaignId: req.params.id }
    })

    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: {
        ...campaignData,
        products: {
          create: productIds.map((productId: string) => ({ productId }))
        }
      },
      include: {
        products: {
          include: {
            product: { include: { category: true } }
          }
        }
      }
    })

    res.json(campaign)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteCampaign = async (req: any, res: Response) => {
  try {
    await prisma.campaign.delete({ where: { id: req.params.id } })
    res.json({ message: 'Kampanya silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getReviews = async (req: any, res: Response) => {
  try {
    const { productId, approved } = req.query
    const where: any = {}
    if (productId) where.productId = productId
    if (approved !== undefined) where.isApproved = approved === 'true'

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        product: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const approveReview = async (req: any, res: Response) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    })

    res.json(review)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteReview = async (req: any, res: Response) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } })
    res.json({ message: 'Yorum silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getNotifications = async (req: any, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const markNotificationRead = async (req: any, res: Response) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })

    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const markAllNotificationsRead = async (req: any, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true }
    })

    res.json({ message: 'Tüm bildirimler okundu' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

const DEFAULT_SETTINGS = {
  siteName: 'Nusya Kuruyemiş',
  phone: '',
  email: '',
  address: '',
  workingHours: ''
}

export const getSettings = async (_req: any, res: Response) => {
  try {
    const settings = await prisma.setting.findMany()
    const data: any = { ...DEFAULT_SETTINGS }
    for (const item of settings) {
      data[item.key] = item.value
    }
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateSettings = async (req: any, res: Response) => {
  try {
    const updates = req.body
    for (const [key, value] of Object.entries(updates)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    }
    res.json({ message: 'Ayarlar kaydedildi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

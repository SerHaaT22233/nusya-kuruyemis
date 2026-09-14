import { Response } from 'express'
import prisma from '../config/database'

export const getProducts = async (req: any, res: Response) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query

    const where: any = { isActive: true }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category as string } })
      if (cat) where.categoryId = cat.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }
    if (sort === 'popular') orderBy = { isBestSeller: 'desc' }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy,
        skip,
        take: parseInt(limit as string)
      }),
      prisma.product.count({ where })
    ])

    res.json({
      products,
      total,
      pages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getProductBySlug = async (req: any, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true
      }
    })

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createProduct = async (req: any, res: Response) => {
  try {
    const productData = req.body

    const product = await prisma.product.create({
      data: productData,
      include: { category: true }
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateProduct = async (req: any, res: Response) => {
  try {
    const productData = req.body

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: productData,
      include: { category: true }
    })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteProduct = async (req: any, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ message: 'Ürün silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getFeaturedProducts = async (_req: any, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: { category: true },
      take: 8
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getNewProducts = async (_req: any, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isNew: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 8
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getTopSelling = async (_req: any, res: Response) => {
  try {
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 8
    })

    const productIds = orderItems.map(item => item.productId)

    if (productIds.length === 0) {
      return res.json([])
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { category: true }
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getCampaignProducts = async (_req: any, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isCampaign: true },
      include: { category: true },
      take: 12
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getOnSaleProducts = async (_req: any, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isOnSale: true },
      include: { category: true },
      take: 12
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

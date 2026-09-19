import { Response } from 'express'
import prisma from '../config/database'

export const getReviews = async (req: any, res: Response) => {
  try {
    const { productId } = req.query
    const where: any = {}
    if (productId) where.productId = productId

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createReview = async (req: any, res: Response) => {
  try {
    const { productId, rating, comment } = req.body
    const userId = req.user.id

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } }
    })
    if (existing) {
      return res.status(400).json({ message: 'Bu ürün için zaten yorum yapmışsınız' })
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating),
        comment,
        isApproved: false
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    })
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const approveReview = async (req: any, res: Response) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true },
      include: { user: { select: { firstName: true, lastName: true } } }
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

export const getUserReviews = async (req: any, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        product: { select: { id: true, name: true, slug: true, images: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}
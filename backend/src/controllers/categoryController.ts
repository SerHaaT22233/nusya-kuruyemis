import { Response } from 'express'
import prisma from '../config/database'

export const getCategories = async (_req: any, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        parent: true,
        children: true
      }
    })

    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getCategoryTree = async (_req: any, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          include: {
            _count: { select: { products: true } }
          }
        },
        _count: { select: { products: true } }
      }
    })

    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const createCategory = async (req: any, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    })

    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateCategory = async (req: any, res: Response) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const deleteCategory = async (req: any, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ message: 'Kategori silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

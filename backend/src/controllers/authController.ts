import { Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from '../config/database'
import { AuthRequest } from '../middleware/auth'

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone
      }
    })

    const secret = process.env.JWT_SECRET || ''
    const expiresIn = process.env.JWT_EXPIRE || '7d'
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn } as jwt.SignOptions)

    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' })
    }

    const secret = process.env.JWT_SECRET || ''
    const expiresIn = process.env.JWT_EXPIRE || '7d'
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn } as jwt.SignOptions)

    const { password: _, ...userWithoutPassword } = user

    res.json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone } = req.body

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Şifre başarıyla güncellendi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import adminRoutes from './routes/adminRoutes'
import reviewRoutes from './routes/reviewRoutes'
import path from 'path'

dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

const app = express()

app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/uploads', express.static(path.join(process.cwd(), '..', 'frontend', 'public', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reviews', reviewRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor`)
})
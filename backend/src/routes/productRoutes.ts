import { Router } from 'express'
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewProducts,
  getTopSelling,
  getCampaignProducts,
  getOnSaleProducts
} from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/new', getNewProducts)
router.get('/top-selling', getTopSelling)
router.get('/campaign', getCampaignProducts)
router.get('/on-sale', getOnSaleProducts)
router.get('/:slug', getProductBySlug)
router.post('/', authenticate, authorize('ADMIN'), createProduct)
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct)

export default router

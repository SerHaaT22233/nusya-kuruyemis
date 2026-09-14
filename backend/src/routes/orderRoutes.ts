import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  getAddresses,
  createAddress,
  deleteAddress,
  getFavorites,
  addFavorite,
  removeFavorite,
  validateCoupon
} from '../controllers/orderController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/', authenticate, createOrder)
router.get('/', authenticate, getOrders)
router.get('/:id', authenticate, getOrderById)

router.get('/addresses', authenticate, getAddresses)
router.post('/addresses', authenticate, createAddress)
router.delete('/addresses/:id', authenticate, deleteAddress)

router.get('/favorites', authenticate, getFavorites)
router.post('/favorites', authenticate, addFavorite)
router.delete('/favorites/:id', authenticate, removeFavorite)

router.post('/validate-coupon', authenticate, validateCoupon)

export default router

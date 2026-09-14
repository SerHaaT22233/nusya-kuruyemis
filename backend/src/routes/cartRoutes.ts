import { Router } from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getCart)
router.post('/', authenticate, addToCart)
router.put('/:itemId', authenticate, updateCartItem)
router.delete('/:itemId', authenticate, removeFromCart)
router.delete('/', authenticate, clearCart)

export default router
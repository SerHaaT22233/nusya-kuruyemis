import { Router } from 'express'
import {
  getReviews,
  createReview,
  approveReview,
  deleteReview,
  getUserReviews
} from '../controllers/reviewController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getReviews)
router.get('/user', authenticate, getUserReviews)
router.post('/', authenticate, createReview)
router.put('/:id/approve', authenticate, approveReview)
router.delete('/:id', authenticate, deleteReview)

export default router
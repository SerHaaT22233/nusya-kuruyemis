import { Router } from 'express'
import {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  uploadImage,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getStats,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getSettings,
  updateSettings
} from '../controllers/adminController'
import reviewController from '../controllers/reviewController'
import { authenticate, authorize } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = Router()

router.get('/dashboard', authenticate, authorize('ADMIN'), getDashboard)
router.get('/orders', authenticate, authorize('ADMIN'), getAllOrders)
router.put('/orders/:id', authenticate, authorize('ADMIN'), updateOrderStatus)
router.get('/users', authenticate, authorize('ADMIN'), getAllUsers)
router.post('/upload', authenticate, authorize('ADMIN'), upload.single('image'), uploadImage)
router.get('/coupons', authenticate, authorize('ADMIN'), getCoupons)
router.post('/coupons', authenticate, authorize('ADMIN'), createCoupon)
router.put('/coupons/:id', authenticate, authorize('ADMIN'), updateCoupon)
router.delete('/coupons/:id', authenticate, authorize('ADMIN'), deleteCoupon)
router.get('/stats', authenticate, authorize('ADMIN'), getStats)

router.get('/banners', authenticate, authorize('ADMIN'), getBanners)
router.post('/banners', authenticate, authorize('ADMIN'), createBanner)
router.put('/banners/:id', authenticate, authorize('ADMIN'), updateBanner)
router.delete('/banners/:id', authenticate, authorize('ADMIN'), deleteBanner)

router.get('/campaigns', authenticate, authorize('ADMIN'), getCampaigns)
router.post('/campaigns', authenticate, authorize('ADMIN'), createCampaign)
router.put('/campaigns/:id', authenticate, authorize('ADMIN'), updateCampaign)
router.delete('/campaigns/:id', authenticate, authorize('ADMIN'), deleteCampaign)

router.get('/reviews', authenticate, authorize('ADMIN'), reviewController.getReviews)
router.put('/reviews/:id/approve', authenticate, authorize('ADMIN'), reviewController.approveReview)
router.delete('/reviews/:id', authenticate, authorize('ADMIN'), reviewController.deleteReview)

router.get('/notifications', authenticate, getNotifications)
router.put('/notifications/:id/read', authenticate, markNotificationRead)
router.put('/notifications/read-all', authenticate, markAllNotificationsRead)

router.get('/settings', authenticate, authorize('ADMIN'), getSettings)
router.put('/settings', authenticate, authorize('ADMIN'), updateSettings)

export default router

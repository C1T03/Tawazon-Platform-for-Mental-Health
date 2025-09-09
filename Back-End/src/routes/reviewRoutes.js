import express from 'express';
import {
  addReview,
  getAllReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getReviewsStats
} from '../controllers/reviewController.js';

const router = express.Router();

// إضافة مراجعة جديدة
router.post('/', addReview);

// جلب جميع المراجعات
router.get('/', getAllReviews);

// جلب مراجعات مستخدم معين
router.get('/user/:userId', getUserReviews);

// جلب إحصائيات المراجعات
router.get('/stats', getReviewsStats);

// تحديث مراجعة
router.put('/:reviewId', updateReview);

// حذف مراجعة
router.delete('/:reviewId', deleteReview);

export default router;
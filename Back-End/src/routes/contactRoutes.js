import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  sendContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage,
  getContactStats
} from '../controllers/contactController.js';

const router = Router();

// إرسال رسالة تواصل (بدون حماية - متاح للجميع)
router.post('/', sendContactMessage);

// المسارات التالية تحتاج حماية (للإدارة فقط)
router.use(authenticate);

// جلب إحصائيات رسائل التواصل
router.get('/stats', getContactStats);

// جلب جميع رسائل التواصل
router.get('/', getContactMessages);

// جلب رسالة تواصل محددة
router.get('/:messageId', getContactMessage);

// تحديث حالة رسالة التواصل
router.put('/:messageId/status', updateMessageStatus);

// حذف رسالة تواصل
router.delete('/:messageId', deleteContactMessage);

export default router;
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  sendMessage,
  getInboxMessages,
  getMessage,
  replyToMessage,
  deleteMessage,
  getUnreadCount,
  getDoctorMessages
} from '../controllers/messageController.js';

const router = Router();

// تطبيق الحماية على جميع المسارات
router.use(authenticate);

// إرسال رسالة جديدة
router.post('/', sendMessage);

// جلب عدد الرسائل غير المقروءة
router.get('/unread-count/:userId', getUnreadCount);

// جلب رسائل الطبيب مع ردود المرضى
router.get('/doctor/inbox/:doctorId', getDoctorMessages);

// جلب الرسائل الواردة
router.get('/inbox/:userId', getInboxMessages);

// قراءة رسالة محددة
router.get('/:messageId/:userId', getMessage);

// الرد على رسالة
router.post('/:messageId/reply', replyToMessage);

// حذف رسالة
router.delete('/:messageId', deleteMessage);

export default router;
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getStatistics, getDoctorStatistics, getPatientStatistics } from '../controllers/statisticsController.js';

const router = Router();

// حماية المسار للمستخدمين المصادقين
router.use(authenticate);

// الإحصائيات العامة
router.get('/', getStatistics);

// إحصائيات الأطباء المتقدمة
router.get('/doctors', getDoctorStatistics);

// إحصائيات المرضى المتقدمة
router.get('/patients', getPatientStatistics);

export default router;
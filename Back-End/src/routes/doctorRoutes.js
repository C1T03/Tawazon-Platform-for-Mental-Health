import { Router } from 'express';
import { 
  authenticate, 
  authorize 
} from '../middlewares/auth.js';
import { 
 getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  submitRating,
  getDoctorRatings,
  getUserRating,
  getDoctorImage,
  toggleDoctorVerification
} from '../controllers/doctorController.js';

const router = Router();

// الحصول على قائمة الأطباء
router.get('/', getDoctors);

// الحصول على طبيب محدد
router.get('/:id', getDoctorById);

// إنشاء طبيب جديد (يحتاج صلاحية مسؤول)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  createDoctor
);

// تحديث بيانات طبيب (يحتاج أن يكون صاحب الحساب أو مسؤول)
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'doctor']),
  updateDoctor
);

// حذف طبيب (يحتاج صلاحية مسؤول)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  deleteDoctor
);
router.post('/:doctorId/ratings', authenticate, submitRating);
router.get('/:doctorId/ratings', getDoctorRatings);
router.get('/:doctorId/ratings/me', authenticate, getUserRating);
router.get('/:id/profile-image', getDoctorImage);
router.patch('/:id/toggle-verification', authenticate, authorize(['admin']), toggleDoctorVerification);
export default router;
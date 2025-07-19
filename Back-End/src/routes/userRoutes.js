// src/routes/userRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { 
  getUsers, 
  updateCity, 
  updateProfileImage,
  getCurrentUser,
  getAllUsers
} from '../controllers/userController.js';
import { uploadProfileImage } from '../middlewares/upload.js'; // استيراد middleware تحميل الصور

const router = Router();

router.use(authenticate);
router.get('/', getUsers);
router.get('/all', getAllUsers);
router.put('/city', updateCity);

// مسار جديد لتحديث صورة الملف الشخصي
router.put('/profile-image', uploadProfileImage, updateProfileImage);

// مسار جديد للحصول على بيانات المستخدم الحالي
router.get('/me', getCurrentUser);

export default router;
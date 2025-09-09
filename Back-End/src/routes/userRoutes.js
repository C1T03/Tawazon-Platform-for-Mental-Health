// src/routes/userRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { 
  getUsers, 
  updateProfileImage,
  getCurrentUser,
  getDoctorProfile,
  getAllDoctorsWithSchedule,
  getAllUsers,
  getProfileImage,
  updateUserData,
  deleteUser,
  deleteUserByAdmin,
  addFavoriteDoctor,
  removeFavoriteDoctor,
  checkFavoriteStatus,
  getFavoriteDoctors
} from '../controllers/userController.js';
import { uploadProfileImage } from '../middlewares/upload.js'; // استيراد middleware تحميل الصور

const router = Router();

// مسارات غير محمية للمفضلة
router.post('/favorites/add', addFavoriteDoctor);
router.post('/favorites/remove', removeFavoriteDoctor);
router.get('/favorites/check', checkFavoriteStatus);
router.get('/favorites/list', getFavoriteDoctors);
router.get('/:id/profile-image', getProfileImage);
router.get('/doctor-profile/:userId', getDoctorProfile);
router.get('/doctors-with-schedule', getAllDoctorsWithSchedule);

// تطبيق الحماية على باقي المسارات
router.use(authenticate);
router.get('/', getUsers);
router.get('/all', getAllUsers);
router.put('/update', updateUserData); 
router.post('/upload-profile-picture', uploadProfileImage, updateProfileImage);
router.get('/me', getCurrentUser);
router.delete('/', deleteUser);
router.delete('/:id', deleteUserByAdmin);
export default router;
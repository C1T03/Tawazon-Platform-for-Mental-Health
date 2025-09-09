import { Router } from 'express';
import { login, refreshToken, logout, register } from '../controllers/authController.js';
import { uploadProfileImage } from '../middlewares/upload.js';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/register', uploadProfileImage, register);

export default router;
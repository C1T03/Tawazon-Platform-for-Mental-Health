import { Router } from 'express';
import { getDoctors, getDoctorById } from '../controllers/doctorController.js';
import { authenticate } from '../middlewares/auth.js';
import { updateDoktorInfo } from '../controllers/authController.js';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post("/updateDoktorInfo",authenticate,updateDoktorInfo);
export default router;
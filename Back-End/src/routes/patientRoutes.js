import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getPatients } from '../controllers/patientController.js';

const router = Router();

router.use(authenticate);
router.get('/', getPatients);

export default router;
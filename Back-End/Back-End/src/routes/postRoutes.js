import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { interactPost, getPostInteractions, getDoctorPosts } from '../controllers/postController.js';

const router = Router();

router.get('/', getDoctorPosts);
router.post('/:id/interact', authenticate, interactPost);
router.get('/:id/interactions', getPostInteractions);

export default router;
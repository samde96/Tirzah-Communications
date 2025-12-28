import { Router } from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  upload
} from '../controllers/testimonialController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.single('logo'), createTestimonial);
router.put('/:id', authenticateToken, upload.single('logo'), updateTestimonial);
router.delete('/:id', authenticateToken, deleteTestimonial);

export default router;

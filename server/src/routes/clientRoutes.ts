import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  upload
} from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllClients);
router.get('/:id', getClientById);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.single('logo'), createClient);
router.put('/:id', authenticateToken, upload.single('logo'), updateClient);
router.delete('/:id', authenticateToken, deleteClient);

export default router;

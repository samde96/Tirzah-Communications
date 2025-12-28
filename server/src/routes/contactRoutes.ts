import { Router } from 'express';
import { submitQuote } from '../controllers/contactController';

const router = Router();

router.post('/quote', submitQuote);

export default router;

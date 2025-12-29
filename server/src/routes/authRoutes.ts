import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);
router.post('/forgot-password', async (req, res) => {
	try {
		const { forgotPassword } = await import('../controllers/authController');
		return forgotPassword(req, res);
	} catch (err) {
		return res.status(500).json({ error: 'Server error' });
	}
});

router.post('/reset-password', async (req, res) => {
	try {
		const { resetPassword } = await import('../controllers/authController');
		return resetPassword(req, res);
	} catch (err) {
		return res.status(500).json({ error: 'Server error' });
	}
});

export default router;

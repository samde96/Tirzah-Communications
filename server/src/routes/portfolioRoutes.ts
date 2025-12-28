import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import {
  getAllPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/portfolioController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|webm|ogg/;
  const extname = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'media') {
    const isValidImage = allowedImageTypes.test(extname.substring(1));
    if (isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for media field'));
    }
  } else if (file.fieldname === 'video') {
    const isValidVideo = allowedVideoTypes.test(extname.substring(1));
    if (isValidVideo) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for video field'));
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Public routes
router.get('/', getAllPortfolioItems);
router.get('/:id', getPortfolioItemById);

// Protected routes (require authentication)
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  createPortfolioItem
);

router.put(
  '/:id',
  authenticateToken,
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updatePortfolioItem
);

router.delete('/:id', authenticateToken, deletePortfolioItem);

export default router;

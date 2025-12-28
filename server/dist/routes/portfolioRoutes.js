"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const portfolioController_1 = require("../controllers/portfolioController");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|webm|ogg/;
    const extname = path_1.default.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'media') {
        const isValidImage = allowedImageTypes.test(extname.substring(1));
        if (isValidImage) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for media field'));
        }
    }
    else if (file.fieldname === 'video') {
        const isValidVideo = allowedVideoTypes.test(extname.substring(1));
        if (isValidVideo) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video files are allowed for video field'));
        }
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
});
// Public routes
router.get('/', portfolioController_1.getAllPortfolioItems);
router.get('/:id', portfolioController_1.getPortfolioItemById);
// Protected routes (require authentication)
router.post('/', auth_1.authenticateToken, upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), portfolioController_1.createPortfolioItem);
router.put('/:id', auth_1.authenticateToken, upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), portfolioController_1.updatePortfolioItem);
router.delete('/:id', auth_1.authenticateToken, portfolioController_1.deletePortfolioItem);
exports.default = router;

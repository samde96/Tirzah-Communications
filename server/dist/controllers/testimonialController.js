"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonialById = exports.getAllTestimonials = exports.upload = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
// import { cacheGet, cacheSet, cacheDelByPattern } from '../utils/cache';
// Configure multer for logo uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../../public/uploads/testimonials');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'testimonial-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, svg, webp)'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Get all testimonials
const getAllTestimonials = async (req, res) => {
    try {
        const key = 'testimonials:all';
        // const cached = await cacheGet<any[]>(key);
        // if (cached) return res.json(cached);
        const testimonials = await prisma.testimonial.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
        // await cacheSet(key, testimonials, 300);
        res.json(testimonials);
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
};
exports.getAllTestimonials = getAllTestimonials;
// Get testimonial by ID
const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.json(testimonial);
    }
    catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Failed to fetch testimonial' });
    }
};
exports.getTestimonialById = getTestimonialById;
// Create new testimonial
const createTestimonial = async (req, res) => {
    try {
        const { name, role, organization, quote, order } = req.body;
        const file = req.file;
        if (!name || !role || !organization || !quote) {
            return res.status(400).json({ error: 'Name, role, organization, and quote are required' });
        }
        const logoPath = file ? `/uploads/testimonials/${file.filename}` : null;
        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                organization,
                quote,
                logo: logoPath,
                order: order ? parseInt(order) : 0,
                isActive: true
            }
        });
        res.status(201).json(testimonial);
        // await cacheDelByPattern('testimonials:*');
    }
    catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: 'Failed to create testimonial' });
    }
};
exports.createTestimonial = createTestimonial;
// Update testimonial
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, organization, quote, order, isActive } = req.body;
        const file = req.file;
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!existingTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        const updateData = {
            name: name || existingTestimonial.name,
            role: role || existingTestimonial.role,
            organization: organization || existingTestimonial.organization,
            quote: quote || existingTestimonial.quote,
            order: order !== undefined ? parseInt(order) : existingTestimonial.order,
            isActive: isActive !== undefined ? isActive === 'true' : existingTestimonial.isActive
        };
        // If new logo is uploaded, delete old one and use new one
        if (file) {
            if (existingTestimonial.logo) {
                const oldLogoPath = path_1.default.join(__dirname, '../../../public', existingTestimonial.logo);
                if (fs_1.default.existsSync(oldLogoPath)) {
                    fs_1.default.unlinkSync(oldLogoPath);
                }
            }
            updateData.logo = `/uploads/testimonials/${file.filename}`;
        }
        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: updateData
        });
        // await cacheDelByPattern('testimonials:*');
        res.json(updatedTestimonial);
    }
    catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
};
exports.updateTestimonial = updateTestimonial;
// Delete testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        // Delete logo file if it exists
        if (testimonial.logo) {
            const logoPath = path_1.default.join(__dirname, '../../../public', testimonial.logo);
            if (fs_1.default.existsSync(logoPath)) {
                fs_1.default.unlinkSync(logoPath);
            }
        }
        await prisma.testimonial.delete({
            where: { id }
        });
        // await cacheDelByPattern('testimonials:*');
        res.json({ message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
};
exports.deleteTestimonial = deleteTestimonial;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolioItem = exports.updatePortfolioItem = exports.createPortfolioItem = exports.getPortfolioItemById = exports.getAllPortfolioItems = void 0;
const prisma_1 = require("../utils/prisma");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllPortfolioItems = async (req, res) => {
    try {
        const { isActive } = req.query;
        const items = await prisma_1.prisma.portfolioItem.findMany({
            where: isActive !== undefined ? { isActive: isActive === 'true' } : {},
            orderBy: { createdAt: 'desc' },
        });
        res.json(items);
    }
    catch (error) {
        console.error('Get portfolio items error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllPortfolioItems = getAllPortfolioItems;
const getPortfolioItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma_1.prisma.portfolioItem.findUnique({
            where: { id },
        });
        if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        res.json(item);
    }
    catch (error) {
        console.error('Get portfolio item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPortfolioItemById = getPortfolioItemById;
const createPortfolioItem = async (req, res) => {
    try {
        const { title, category, mediaType, description, link, background, services, achievements, stats } = req.body;
        if (!title || !category || !mediaType || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let mediaSrc = '';
        let videoSrc = null;
        if (req.files) {
            const files = req.files;
            if (files.media && files.media[0]) {
                mediaSrc = `/uploads/${files.media[0].filename}`;
            }
            if (files.video && files.video[0]) {
                videoSrc = `/uploads/${files.video[0].filename}`;
            }
        }
        // Parse JSON fields if they're strings
        const parseJsonField = (field) => {
            if (!field)
                return null;
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                }
                catch {
                    return null;
                }
            }
            return field;
        };
        const item = await prisma_1.prisma.portfolioItem.create({
            data: {
                title,
                category,
                mediaType,
                mediaSrc,
                videoSrc,
                description,
                link: link || null,
                background: background || null,
                services: parseJsonField(services),
                achievements: parseJsonField(achievements),
                stats: parseJsonField(stats),
                isActive: true,
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        console.error('Create portfolio item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createPortfolioItem = createPortfolioItem;
const updatePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, mediaType, description, link, isActive, background, services, achievements, stats } = req.body;
        console.log('Update request received:', { id, title, category, mediaType, isActive });
        const existingItem = await prisma_1.prisma.portfolioItem.findUnique({
            where: { id },
        });
        if (!existingItem) {
            console.log('Portfolio item not found:', id);
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        console.log('Existing item found:', existingItem);
        let mediaSrc = existingItem.mediaSrc;
        let videoSrc = existingItem.videoSrc;
        if (req.files) {
            const files = req.files;
            if (files.media && files.media[0]) {
                // Delete old media file
                if (existingItem.mediaSrc) {
                    const oldPath = path_1.default.join(__dirname, '../../../public', existingItem.mediaSrc);
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlinkSync(oldPath);
                    }
                }
                mediaSrc = `/uploads/${files.media[0].filename}`;
            }
            if (files.video && files.video[0]) {
                // Delete old video file
                if (existingItem.videoSrc) {
                    const oldPath = path_1.default.join(__dirname, '../../../public', existingItem.videoSrc);
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlinkSync(oldPath);
                    }
                }
                videoSrc = `/uploads/${files.video[0].filename}`;
            }
        }
        // Parse JSON fields if they're strings
        const parseJsonField = (field) => {
            if (!field)
                return null;
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                }
                catch {
                    return null;
                }
            }
            return field;
        };
        // Convert isActive to boolean
        const isActiveBool = isActive !== undefined ? (isActive === 'true' || isActive === true) : existingItem.isActive;
        console.log('isActive conversion:', { isActive, isActiveBool, type: typeof isActiveBool });
        const updateData = {
            title: title || existingItem.title,
            category: category || existingItem.category,
            mediaType: mediaType || existingItem.mediaType,
            mediaSrc,
            videoSrc,
            description: description || existingItem.description,
            link: link !== undefined ? link : existingItem.link,
            background: background !== undefined ? background : existingItem.background,
            services: services !== undefined ? parseJsonField(services) : existingItem.services,
            achievements: achievements !== undefined ? parseJsonField(achievements) : existingItem.achievements,
            stats: stats !== undefined ? parseJsonField(stats) : existingItem.stats,
            isActive: isActiveBool,
        };
        console.log('Updating with data:', updateData);
        const item = await prisma_1.prisma.portfolioItem.update({
            where: { id },
            data: updateData,
        });
        console.log('Update successful:', item);
        res.json(item);
    }
    catch (error) {
        console.error('Update portfolio item error:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
exports.updatePortfolioItem = updatePortfolioItem;
const deletePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma_1.prisma.portfolioItem.findUnique({
            where: { id },
        });
        if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        // Delete associated files
        if (item.mediaSrc) {
            const mediaPath = path_1.default.join(__dirname, '../../../public', item.mediaSrc);
            if (fs_1.default.existsSync(mediaPath)) {
                fs_1.default.unlinkSync(mediaPath);
            }
        }
        if (item.videoSrc) {
            const videoPath = path_1.default.join(__dirname, '../../../public', item.videoSrc);
            if (fs_1.default.existsSync(videoPath)) {
                fs_1.default.unlinkSync(videoPath);
            }
        }
        await prisma_1.prisma.portfolioItem.delete({
            where: { id },
        });
        res.json({ message: 'Portfolio item deleted successfully' });
    }
    catch (error) {
        console.error('Delete portfolio item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deletePortfolioItem = deletePortfolioItem;

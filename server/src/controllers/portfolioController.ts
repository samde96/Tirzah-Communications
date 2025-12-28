import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import fs from 'fs';
import path from 'path';

export const getAllPortfolioItems = async (req: AuthRequest, res: Response) => {
  try {
    const { isActive } = req.query;

    const items = await prisma.portfolioItem.findMany({
      where: isActive !== undefined ? { isActive: isActive === 'true' } : {},
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get portfolio items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPortfolioItemById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get portfolio item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, mediaType, description, link, background, services, achievements, stats } = req.body;

    if (!title || !category || !mediaType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let mediaSrc = '';
    let videoSrc = null;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.media && files.media[0]) {
        mediaSrc = `/uploads/${files.media[0].filename}`;
      }

      if (files.video && files.video[0]) {
        videoSrc = `/uploads/${files.video[0].filename}`;
      }
    }

    // Parse JSON fields if they're strings
    const parseJsonField = (field: any) => {
      if (!field) return null;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return null;
        }
      }
      return field;
    };

    const item = await prisma.portfolioItem.create({
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
  } catch (error) {
    console.error('Create portfolio item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, mediaType, description, link, isActive, background, services, achievements, stats } = req.body;

    console.log('Update request received:', { id, title, category, mediaType, isActive });

    const existingItem = await prisma.portfolioItem.findUnique({
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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.media && files.media[0]) {
        // Delete old media file
        if (existingItem.mediaSrc) {
          const oldPath = path.join(__dirname, '../../../public', existingItem.mediaSrc);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        mediaSrc = `/uploads/${files.media[0].filename}`;
      }

      if (files.video && files.video[0]) {
        // Delete old video file
        if (existingItem.videoSrc) {
          const oldPath = path.join(__dirname, '../../../public', existingItem.videoSrc);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        videoSrc = `/uploads/${files.video[0].filename}`;
      }
    }

    // Parse JSON fields if they're strings
    const parseJsonField = (field: any) => {
      if (!field) return null;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
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

    const item = await prisma.portfolioItem.update({
      where: { id },
      data: updateData,
    });

    console.log('Update successful:', item);
    res.json(item);
  } catch (error: any) {
    console.error('Update portfolio item error:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const deletePortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Delete associated files
    if (item.mediaSrc) {
      const mediaPath = path.join(__dirname, '../../../public', item.mediaSrc);
      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }

    if (item.videoSrc) {
      const videoPath = path.join(__dirname, '../../../public', item.videoSrc);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await prisma.portfolioItem.delete({
      where: { id },
    });

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

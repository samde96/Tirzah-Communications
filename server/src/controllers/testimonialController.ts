import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../public/uploads/testimonials');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'testimonial-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, svg, webp)'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all testimonials
export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Get testimonial by ID
export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

// Create new testimonial
export const createTestimonial = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

// Update testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
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

    const updateData: any = {
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
        const oldLogoPath = path.join(__dirname, '../../../public', existingTestimonial.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      updateData.logo = `/uploads/testimonials/${file.filename}`;
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });

    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
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
      const logoPath = path.join(__dirname, '../../../public', testimonial.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

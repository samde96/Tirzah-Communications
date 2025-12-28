import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../public/uploads/clients');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'client-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all clients
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

// Get client by ID
export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

// Create new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, order } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Logo image is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const logoPath = `/uploads/clients/${file.filename}`;

    const client = await prisma.client.create({
      data: {
        name,
        logo: logoPath,
        order: order ? parseInt(order) : 0,
        isActive: true
      }
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

// Update client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, order, isActive } = req.body;
    const file = req.file;

    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const updateData: any = {
      name: name || existingClient.name,
      order: order !== undefined ? parseInt(order) : existingClient.order,
      isActive: isActive !== undefined ? isActive === 'true' : existingClient.isActive
    };

    // If new logo is uploaded, delete old one and use new one
    if (file) {
      const oldLogoPath = path.join(__dirname, '../../../public', existingClient.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
      updateData.logo = `/uploads/clients/${file.filename}`;
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData
    });

    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete logo file
    const logoPath = path.join(__dirname, '../../../public', client.logo);
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await prisma.client.delete({
      where: { id }
    });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};

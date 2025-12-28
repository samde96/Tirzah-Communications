"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientById = exports.getAllClients = exports.upload = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
// Configure multer for logo uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../../public/uploads/clients');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'client-' + uniqueSuffix + path_1.default.extname(file.originalname));
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
// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
        res.json(clients);
    }
    catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};
exports.getAllClients = getAllClients;
// Get client by ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: { id }
        });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    }
    catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client' });
    }
};
exports.getClientById = getClientById;
// Create new client
const createClient = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
};
exports.createClient = createClient;
// Update client
const updateClient = async (req, res) => {
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
        const updateData = {
            name: name || existingClient.name,
            order: order !== undefined ? parseInt(order) : existingClient.order,
            isActive: isActive !== undefined ? isActive === 'true' : existingClient.isActive
        };
        // If new logo is uploaded, delete old one and use new one
        if (file) {
            const oldLogoPath = path_1.default.join(__dirname, '../../../public', existingClient.logo);
            if (fs_1.default.existsSync(oldLogoPath)) {
                fs_1.default.unlinkSync(oldLogoPath);
            }
            updateData.logo = `/uploads/clients/${file.filename}`;
        }
        const updatedClient = await prisma.client.update({
            where: { id },
            data: updateData
        });
        res.json(updatedClient);
    }
    catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
};
exports.updateClient = updateClient;
// Delete client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: { id }
        });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        // Delete logo file
        const logoPath = path_1.default.join(__dirname, '../../../public', client.logo);
        if (fs_1.default.existsSync(logoPath)) {
            fs_1.default.unlinkSync(logoPath);
        }
        await prisma.client.delete({
            where: { id }
        });
        res.json({ message: 'Client deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
};
exports.deleteClient = deleteClient;

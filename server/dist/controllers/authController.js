"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyToken = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingAdmin = await prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (existingAdmin) {
            return res.status(409).json({ error: 'Admin already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await prisma_1.prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { id: decoded.adminId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json({ admin });
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: 'Email is required' });
        const admin = await prisma_1.prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            // For security, still return a generic success message
            return res.status(200).json({ message: 'If an account with that email exists, you can proceed to reset password.' });
        }
        // Generate a short-lived token for direct password reset
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id, type: 'direct-reset' }, process.env.JWT_SECRET, { expiresIn: '5m' }); // 5 minutes validity
        return res.status(200).json({ message: 'Proceed to reset password.', token });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password)
            return res.status(400).json({ error: 'Token and new password are required' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Update to expect 'direct-reset' type
        if (!decoded || decoded.type !== 'direct-reset')
            return res.status(403).json({ error: 'Invalid or expired token' });
        const admin = await prisma_1.prisma.admin.findUnique({ where: { id: decoded.adminId } });
        if (!admin)
            return res.status(404).json({ error: 'Admin not found' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });
        return res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.resetPassword = resetPassword;

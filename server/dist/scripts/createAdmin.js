"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../utils/prisma");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createAdmin() {
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';
    try {
        const existingAdmin = await prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (existingAdmin) {
            console.log('❌ Admin with this email already exists!');
            process.exit(1);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await prisma_1.prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        console.log('✅ Admin user created successfully!');
        console.log('Email:', admin.email);
        console.log('Name:', admin.name);
        console.log('\nYou can now login at http://localhost:3000/admin/login');
    }
    catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
createAdmin();

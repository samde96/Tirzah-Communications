# Quick Start Guide

Get your portfolio management system up and running in 5 minutes!

## Prerequisites
- ✅ Node.js installed
- ✅ MongoDB running (locally or Atlas)

## Steps

### 1. Install Dependencies (if not done already)
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Create Admin User
```bash
npm run create-admin admin@example.com yourpassword "Your Name"
```

### 4. Start Backend Server (Terminal 1)
```bash
npm run server
```
Backend runs on: http://localhost:5000

### 5. Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

## Access Points

- **Public Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard (after login)

## Default Admin Credentials
If you used the create-admin command without parameters:
- **Email:** admin@example.com
- **Password:** admin123

## Next Steps

1. Login to admin panel: http://localhost:3000/admin/login
2. Click "Add New Item" to create your first portfolio item
3. Upload an image or video
4. View it on the public homepage!

## Need Help?

See [SETUP.md](SETUP.md) for detailed documentation.

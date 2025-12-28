# Portfolio Management System - Setup Guide

This is a complete portfolio management system with Express backend, MongoDB database, and Next.js frontend with an admin panel.

## Features

- ✅ Admin authentication with JWT
- ✅ Portfolio item CRUD operations
- ✅ Image and video upload support
- ✅ Category filtering
- ✅ Active/inactive toggle for portfolio items
- ✅ Responsive admin dashboard
- ✅ Dynamic frontend that fetches from API

## Tech Stack

**Backend:**
- Express.js with TypeScript
- MongoDB with Prisma ORM
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

**Frontend:**
- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Prerequisites

Before you begin, make sure you have installed:
- Node.js (v18 or higher)
- MongoDB (running locally or have a MongoDB Atlas connection string)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on your machine
- The default connection string is: `mongodb://localhost:27017/tirzah_portfolio`

**Option B: MongoDB Atlas**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update the `DATABASE_URL` in `.env` file

### 3. Configure Environment Variables

The `.env` file is already created with default values. Update these if needed:

```env
# Database - Update this if using MongoDB Atlas
DATABASE_URL="mongodb://localhost:27017/tirzah_portfolio"

# JWT Secret - CHANGE THIS IN PRODUCTION!
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=5000

# Next.js API URL
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Create Your First Admin User

Run this command to create an admin account:

```bash
npm run create-admin admin@example.com yourpassword "Admin Name"
```

Or use the defaults (email: admin@example.com, password: admin123):

```bash
npm run create-admin
```

## Running the Application

You need to run both the backend server and the Next.js frontend.

### Terminal 1: Start the Backend Server

```bash
npm run server
```

The backend server will start on http://localhost:5000

### Terminal 2: Start the Next.js Frontend

```bash
npm run dev
```

The frontend will start on http://localhost:3000

## Using the Admin Panel

1. **Login to Admin Panel**
   - Navigate to: http://localhost:3000/admin/login
   - Enter your admin credentials
   - Click "Login"

2. **Add Portfolio Items**
   - After logging in, click "Add New Item"
   - Fill in the details:
     - Title (required)
     - Category (required) - e.g., "Branding", "Events", "Campaigns"
     - Media Type - choose "Image" or "Video"
     - Upload image/video files
     - Description (required)
     - Link (optional)
   - Click "Create Portfolio Item"

3. **Manage Portfolio Items**
   - View all items on the dashboard
   - Click "Edit" to update an item
   - Click "Hide/Show" to toggle visibility on the public site
   - Click "Delete" to remove an item permanently

4. **View Public Website**
   - Visit: http://localhost:3000
   - The "Recent work" section will show active portfolio items
   - Categories are auto-generated from your portfolio items
   - Filter by category using the buttons

## File Upload Directory

Uploaded files are stored in:
```
public/uploads/
```

Make sure this directory exists and has write permissions.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin (protected - create via script)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Portfolio
- `GET /api/portfolio` - Get all portfolio items (public)
- `GET /api/portfolio?isActive=true` - Get only active items
- `GET /api/portfolio/:id` - Get single portfolio item
- `POST /api/portfolio` - Create new item (protected)
- `PUT /api/portfolio/:id` - Update item (protected)
- `DELETE /api/portfolio/:id` - Delete item (protected)

## Project Structure

```
tirzahshadcn/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login page
│   │   └── dashboard/
│   │       ├── page.tsx           # Admin dashboard
│   │       ├── add/
│   │       │   └── page.tsx       # Add portfolio item
│   │       └── edit/[id]/
│   │           └── page.tsx       # Edit portfolio item
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── features-1.tsx             # Portfolio section (fetches from API)
│   └── ui/                        # shadcn/ui components
├── server/
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts
│       │   └── portfolioController.ts
│       ├── middleware/
│       │   └── auth.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   └── portfolioRoutes.ts
│       ├── scripts/
│       │   └── createAdmin.ts
│       ├── utils/
│       │   └── prisma.ts
│       └── index.ts               # Express server
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   └── uploads/                   # Uploaded files
├── .env                           # Environment variables
└── package.json
```

## Database Schema

### Admin Model
- id: ObjectId
- email: String (unique)
- password: String (hashed)
- name: String
- createdAt: DateTime
- updatedAt: DateTime

### PortfolioItem Model
- id: ObjectId
- title: String
- category: String
- mediaType: String ('image' or 'video')
- mediaSrc: String (path to image)
- videoSrc: String (path to video, optional)
- description: String
- link: String (optional)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Update `NEXT_PUBLIC_API_URL` accordingly

### File Upload Issues
- Ensure `public/uploads/` directory exists
- Check file permissions
- File size limit is 50MB

### JWT/Authentication Issues
- Clear localStorage in your browser
- Try logging out and logging back in
- Generate a new JWT_SECRET if needed

## Production Deployment

Before deploying to production:

1. **Change JWT Secret**
   - Generate a strong random secret
   - Update `JWT_SECRET` in your environment variables

2. **Use MongoDB Atlas**
   - Set up a production MongoDB Atlas cluster
   - Update `DATABASE_URL` with your production connection string

3. **Update API URL**
   - Set `NEXT_PUBLIC_API_URL` to your production backend URL

4. **Build the Backend**
   ```bash
   npm run server:build
   npm run server:start
   ```

5. **Build the Frontend**
   ```bash
   npm run build
   npm start
   ```

## Security Notes

- The default JWT secret MUST be changed in production
- Admin registration endpoint should be protected or disabled after initial setup
- Always use HTTPS in production
- Implement rate limiting for authentication endpoints
- Regularly update dependencies

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints documentation
3. Check MongoDB connection and logs
4. Verify environment variables are set correctly

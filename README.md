# Forsick

A full-stack social media platform built with React, Express, and PostgreSQL.

**Live:** [forsick.vercel.app](https://forsick.vercel.app)

## Features

- **User Profiles** — sign up, login, custom avatars, bios
- **Posts** — create posts with text, images, and videos
- **Likes & Comments** — interact with posts in real-time
- **Follow System** — follow users and see their posts in your feed
- **Real-Time Updates** — powered by Socket.io
- **Dark Mode** — toggle between light and dark themes
- **Cloud Media Storage** — images and videos stored on Cloudinary

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express, Socket.io |
| Database | PostgreSQL, Prisma ORM |
| Media | Cloudinary |
| Hosting | Vercel (frontend), Railway (backend), Neon (database) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Cole4651/forsick.git
   cd forsick
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/forsick"
   JWT_SECRET="your-secret-key"
   PORT=3001
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

6. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. Open **http://localhost:5173**

## Project Structure

```
forsick/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, PostCard, CreatePost
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── pages/           # Landing, Login, Register, Feed, Explore, Profile, PostDetail
│   │   └── utils/           # API helper, Socket.io client
│   └── vite.config.js
├── server/                  # Express backend
│   ├── prisma/              # Database schema and migrations
│   ├── src/
│   │   ├── middleware/      # JWT authentication
│   │   └── routes/          # Auth, Users, Posts, Comments, Follows, Upload
│   └── Procfile
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/users/me` | Get current user |
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/feed` | Get personalized feed |
| POST | `/api/posts` | Create post |
| POST | `/api/posts/:id/like` | Like/unlike post |
| POST | `/api/comments/:postId` | Add comment |
| POST | `/api/follows/:userId` | Follow/unfollow user |
| POST | `/api/upload` | Upload image/video |

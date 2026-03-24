# 🚀 X.com Clone - Complete Setup Guide

## ✅ What's Been Built

A full-fledged X.com (Twitter) clone with:
- ✅ Authentication (Login/Signup)
- ✅ Post creation with image uploads
- ✅ Like/Unlike system
- ✅ Comments on posts
- ✅ Follow/Unfollow users
- ✅ User profiles
- ✅ Home feed with infinite scroll
- ✅ Explore page
- ✅ Real-time updates (polling)
- ✅ Responsive design
- ✅ Dark mode support

## 📋 Prerequisites

1. **urBackend Account**: Sign up at https://urbackend.bitbros.in
2. **MongoDB**: Create a project and connect your MongoDB
3. **API Keys**: Get your `pk_live_*` and `sk_live_*` keys from dashboard

## 🔧 Setup Instructions

### Step 0: Enable Authentication in urBackend Dashboard

> **🔑 CRITICAL FIRST STEP**: Before creating collections, you must enable authentication in your urBackend project.

1. Go to your urBackend dashboard
2. Navigate to your project settings
3. **Enable Authentication** - This will automatically create the `users` collection with `email` and `password` fields
4. The password field will be automatically hashed using bcrypt

### Step 1: Configure urBackend Collections

Go to your urBackend dashboard and create these collections:

#### 1. users (Required for authentication)

> **⚠️ IMPORTANT**: The `users` collection is automatically created by urBackend when you enable authentication. It **MUST** have these two required fields:

**Core Fields (Required by urBackend Auth):**
```json
{
  "email": { "type": "String", "required": true, "unique": true },
  "password": { "type": "String", "required": true }
}
```

**Additional Fields to Add:**
After the collection is created, add these extra fields to the schema:
```json
{
  "username": { "type": "String", "required": true, "unique": true },
  "displayName": { "type": "String" },
  "bio": { "type": "String" },
  "avatar": { "type": "String" },
  "banner": { "type": "String" },
  "verified": { "type": "Boolean", "default": false },
  "location": { "type": "String" },
  "website": { "type": "String" },
  "followersCount": { "type": "Number", "default": 0 },
  "followingCount": { "type": "Number", "default": 0 }
}
```

**Complete users schema should look like:**
```json
{
  "email": { "type": "String", "required": true, "unique": true },
  "password": { "type": "String", "required": true },
  "username": { "type": "String", "required": true, "unique": true },
  "displayName": { "type": "String" },
  "bio": { "type": "String" },
  "avatar": { "type": "String" },
  "banner": { "type": "String" },
  "verified": { "type": "Boolean", "default": false },
  "location": { "type": "String" },
  "website": { "type": "String" },
  "followersCount": { "type": "Number", "default": 0 },
  "followingCount": { "type": "Number", "default": 0 }
}
```

#### 2. posts
```json
{
  "authorId": { "type": "String", "required": true },
  "authorUsername": { "type": "String", "required": true },
  "authorDisplayName": { "type": "String" },
  "authorAvatar": { "type": "String" },
  "authorVerified": { "type": "Boolean", "default": false },
  "content": { "type": "String", "required": true },
  "images": { "type": "Array", "default": [] },
  "likesCount": { "type": "Number", "default": 0 },
  "commentsCount": { "type": "Number", "default": 0 },
  "retweetsCount": { "type": "Number", "default": 0 },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

#### 3. comments
```json
{
  "postId": { "type": "String", "required": true },
  "authorId": { "type": "String", "required": true },
  "authorUsername": { "type": "String", "required": true },
  "authorDisplayName": { "type": "String" },
  "authorAvatar": { "type": "String" },
  "content": { "type": "String", "required": true },
  "likesCount": { "type": "Number", "default": 0 },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

#### 4. likes
```json
{
  "userId": { "type": "String", "required": true },
  "targetId": { "type": "String", "required": true },
  "targetType": { "type": "String", "enum": ["post", "comment"], "required": true },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

#### 5. follows
```json
{
  "followerId": { "type": "String", "required": true },
  "followingId": { "type": "String", "required": true },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

### Step 2: Environment Setup

#### Client (.env)
Create `client/.env`:
```env
VITE_PUBLIC_KEY=pk_live_your_key_here
VITE_API_URL=https://api.ub.bitbros.in
VITE_PROXY_URL=http://localhost:4000/api/proxy
```

#### Server (.env)
Create `server/.env`:
```env
API_KEY=sk_live_your_key_here
PORT=4000
```

### Step 3: Install Dependencies

```bash
# Client
cd client
npm install

# Server (in another terminal)
cd ../server
npm install
```

### Step 4: Start the Application

```bash
# Terminal 1 - Start Proxy Server
cd server
npm start

# Terminal 2 - Start React App
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Proxy Server**: http://localhost:4000

## 🎯 First Time Usage

1. **Sign Up**: Create an account at http://localhost:5173/signup
2. **Complete Profile**: Add your display name, bio, etc.
3. **Start Posting**: Share your first post!
4. **Follow Users**: Search and follow other users
5. **Engage**: Like, comment, and interact with posts

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── RightSidebar.jsx
│   │   ├── post/
│   │   │   ├── PostCard.jsx
│   │   │   └── TweetComposer.jsx
│   │   ├── profile/
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Avatar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── PostDetail.jsx
│   │   ├── Explore.jsx
│   │   ├── Notifications.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json

server/
├── index.js
├── package.json
└── .env
```

## 🔑 Key Features Implementation

### Authentication
- JWT-based auth with 7-day expiration
- Protected routes
- Auto-redirect on token expiry

### Posts
- 280 character limit (like Twitter)
- Multi-image upload (up to 4 images)
- Real-time like counts
- Delete own posts

### Social Features
- Follow/Unfollow users
- User search
- Suggested users
- Profile stats

### Feed
- Infinite scroll
- Auto-refresh every 30 seconds
- Optimistic UI updates

## 🐛 Troubleshooting

### "Failed to fetch posts"
- Check if proxy server is running on port 4000
- Verify API keys in .env files
- Check browser console for CORS errors

### "Unauthorized" errors
- Clear localStorage and login again
- Verify your urBackend API keys are correct
- Check if JWT token expired

### Images not uploading
- Verify secret key (`sk_live_*`) in server/.env
- Check file size (max 10MB per file)
- Ensure storage is enabled in urBackend dashboard

### No users showing up
- Sign up multiple accounts to test
- Check if users collection exists in urBackend
- Verify API_URL in .env is correct

## 🚀 Next Steps

Want to enhance the app? Here are some ideas:
- Add retweet functionality
- Implement real-time notifications
- Add bookmark feature
- Build direct messaging
- Add hashtag support
- Create trending topics algorithm
- Add video upload support
- Implement story feature

## 📚 API Documentation

All API endpoints are documented in the urBackend docs:
- **Auth**: https://api.ub.bitbros.in/api/userAuth/*
- **Data**: https://api.ub.bitbros.in/api/data/*
- **Storage**: https://api.ub.bitbros.in/api/storage/*

## 💡 Tips

1. **Performance**: Posts are cached for 1 minute by React Query
2. **Security**: Never commit .env files with real keys
3. **Development**: Use React DevTools and Query DevTools for debugging
4. **Production**: Deploy proxy server separately (Render, Railway, etc.)

## 🎉 You're All Set!

Your X.com clone is ready to use. Happy posting! 🐦

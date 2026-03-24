# 🐦 X.com Clone - Built on urBackend

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38bdf8" />
  <img src="https://img.shields.io/badge/urBackend-API-1DA1F2" />
</p>

A **full-fledged X.com (Twitter) clone** built entirely on urBackend APIs. No backend code needed - just pure frontend magic powered by urBackend's BaaS platform!

## ✨ Features

- ✅ **Authentication** - Secure JWT-based login/signup
- ✅ **Post Creation** - Text + multi-image uploads (up to 4 images)
- ✅ **Social Interactions** - Like, comment, and engage
- ✅ **Follow System** - Build your network
- ✅ **User Profiles** - Customizable profiles with bio, avatar, banner
- ✅ **Feed Timeline** - Infinite scroll home feed
- ✅ **Explore Page** - Discover trending posts
- ✅ **Search** - Find users instantly
- ✅ **Real-time Updates** - Auto-refresh feed every 30s
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark Mode** - Easy on the eyes

## 🚀 Quick Start

### Prerequisites
1. **urBackend Account** - Sign up at https://urbackend.bitbros.in
2. **MongoDB Connected** - Link your MongoDB database
3. **API Keys** - Get your `pk_live_*` and `sk_live_*` keys

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd examples/social-demo

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Configuration

#### 1. Create Collections in urBackend Dashboard

> **⚠️ IMPORTANT**: First, enable **Authentication** in your urBackend project settings. This automatically creates the `users` collection with required `email` and `password` fields.

📖 **Detailed Guide**: See [COLLECTIONS_GUIDE.md](./COLLECTIONS_GUIDE.md) for step-by-step visual instructions

You need to create 5 collections:

**Required collections:**
- ✅ `users` (auto-created when you enable authentication) 
  - **Auto fields**: `email`, `password`
  - **You add**: `username`, `displayName`, `bio`, `avatar`, etc.
- 📝 `posts` - for tweets/posts
- 💬 `comments` - for replies
- ❤️ `likes` - for like tracking
- 👥 `follows` - for follow relationships

**Quick steps:**
1. ✅ Enable Authentication in dashboard (creates `users` with `email` & `password`)
2. ➕ Add extra fields to `users`: `username`, `displayName`, `bio`, `avatar`, etc.
3. Create `posts`, `comments`, `likes`, `follows` collections manually

Full schemas in [SETUP.md](./SETUP.md).

#### 2. Environment Variables

**Client** - Create `client/.env`:
```env
VITE_PUBLIC_KEY=pk_live_your_public_key_here
VITE_API_URL=https://api.ub.bitbros.in
VITE_PROXY_URL=http://localhost:4000/api/proxy
```

**Server** - Create `server/.env`:
```env
API_KEY=sk_live_your_secret_key_here
PORT=4000
```

### Run the App

```bash
# Terminal 1 - Start proxy server
cd server
npm start

# Terminal 2 - Start React app
cd client
npm run dev
```

Visit **http://localhost:5173** and start tweeting! 🐦

## 📁 Project Structure

```
social-demo/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/       # Sidebar, Layout
│   │   │   ├── post/         # PostCard, TweetComposer
│   │   │   ├── profile/      # Profile components
│   │   │   └── ui/           # Button, Input, Avatar
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # API client, utilities
│   │   ├── pages/            # Route pages
│   │   │   ├── auth/         # Login, Signup
│   │   │   ├── Home.jsx      # Feed timeline
│   │   │   ├── Profile.jsx   # User profiles
│   │   │   ├── Explore.jsx   # Discover page
│   │   │   └── ...
│   │   ├── App.jsx           # Main app with routing
│   │   └── index.css         # Tailwind styles
│   └── package.json
└── server/                    # Proxy server
    ├── index.js              # Express proxy
    └── package.json
```

## 🎨 Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS 3
- **State Management**: React Query + Context API
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: urBackend (BaaS)
- **Proxy Server**: Express + http-proxy-middleware

## 🔐 Security Architecture

- **Public Key** (`pk_live_*`) - Used for read operations, safe in frontend
- **Secret Key** (`sk_live_*`) - Used for write operations, kept in server
- **Proxy Server** - Forwards write requests with secret key injection
- **JWT Tokens** - 7-day expiration, auto-refresh on login

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide with collection schemas
- **[urBackend Docs](https://github.com/yash-pouranik/urBackend/tree/main/docs)** - Official API documentation

## 🌟 Key Features Explained

### Infinite Scroll
Uses React Query's `useInfiniteQuery` with Intersection Observer for smooth pagination.

### Optimistic Updates
Like/unlike actions update UI immediately, then sync with backend.

### Image Upload
Multi-image support with preview, client-side validation, and urBackend storage API.

### Real-time Feel
Feed auto-refreshes every 30 seconds using React Query's polling.

## 🐛 Troubleshooting

**Build Errors?**
- Ensure TailwindCSS v3 is installed (not v4)
- Run `npm install` in both client and server

**API Errors?**
- Verify API keys in .env files
- Check if collections exist in urBackend
- Ensure proxy server is running on port 4000

**Authentication Issues?**
- Clear localStorage and re-login
- Check JWT token hasn't expired
- **IMPORTANT:** Verify `users` collection has `email` and `password` fields (auto-created when you enable Authentication in urBackend)
- Make sure you enabled Authentication in urBackend dashboard FIRST before creating other collections

**Collection Setup Issues?**
- See [COLLECTIONS_GUIDE.md](./COLLECTIONS_GUIDE.md) for detailed step-by-step instructions
- Users collection MUST have `email` and `password` fields (created automatically by urBackend when authentication is enabled)
- All field names must match exactly as specified in documentation

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Proxy Server (Render/Railway)
```bash
cd server
# Deploy with environment variable API_KEY set
```

## 📝 TODO (Future Enhancements)

- [ ] Retweet functionality
- [ ] Real-time notifications with WebSockets
- [ ] Direct messaging
- [ ] Hashtag support
- [ ] Bookmarks
- [ ] Video uploads
- [ ] Analytics dashboard
- [ ] Lists feature

## 🤝 Contributing

This is a demo app showcasing urBackend's capabilities. Feel free to fork and enhance!

## 📄 License

MIT - Built with ❤️ using urBackend

## 🙏 Credits

- **urBackend** - https://urbackend.bitbros.in
- **Icons** - Lucide React
- **UI Inspiration** - X.com (Twitter)

---

**Made by developers, for developers** 🚀

Need help? Join the [Discord](https://discord.gg/CXJjvJkNWn)


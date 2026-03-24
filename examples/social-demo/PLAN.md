# Social App Demo Implementation Plan

## Overview
Create a complete, production-ready Twitter-like social application to serve as a demo for the urBackend public API. This demonstrates how to build a fully functional product without touching the backend repository.

## Architecture
- **Location**: `examples/social-demo` (Not part of npm workspaces)
- **Client**: Vite + React + Tailwind CSS
- **Proxy Server**: A minimal Express or Node.js proxy (`examples/social-demo/server`) to securely hold the API Key and forward write requests (`POST`, `PUT`, `DELETE`) to `api.ub.bitbros.in`.

## Core Features
1. **Authentication**: Email/Password Login & Signup using public API.
2. **Password Reset**: OTP generation and verification flow.
3. **Feed**: Infinite scroll timeline of posts.
4. **Post Creation**: Text and image uploads (images routed via proxy to `/api/storage/upload`).
5. **Profiles**: View user profiles, bio, and follow system.

## Action Plan

### Phase 1: Documentation Update
- Replace all instances of `https://api.urbackend.bitbros.in` with `https://api.ub.bitbros.in` inside the `docs/` folder to ensure newcomers get the correct endpoints.

### Phase 2: Internal Folder Setup
- Create `examples/social-demo/client` and `examples/social-demo/server`.
- Initialize `package.json` for both.

### Phase 3: Proxy Server setup
- Build an Express server in `server/index.js` that listens on port `4000`.
- Proxy all `/api/proxy/*` requests to `https://api.ub.bitbros.in/api/*`, injecting the `x-api-key` header securely from a `.env` file.

### Phase 4: Frontend Scaffolding
- Scaffold React + Vite in `client/`.
- Setup API client utility with a smart routing mechanism:
  - `GET` requests go directly to `https://api.ub.bitbros.in`.
  - Write requests (`POST/PUT`) go through `http://localhost:4000/api/proxy`.
- Implement JWT storage.

### Phase 5: UI Implementation
- Build Login/Signup screens.
- Build the main Feed layout with Glassmorphism.
- Build Post Creation and Image Upload.
- Build User Profiles.

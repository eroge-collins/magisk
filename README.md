<div align="center">
  <br>
  <h1>Magisk</h1>
  <p>
    Dark-themed social network built with React, Supabase, and Tailwind CSS.
  </p>
  <p>
    <img src="https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/typescript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/supabase-2-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/tailwindcss-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  </p>
  <br>
</div>

---

## Overview

Magisk is a premium dark-themed social network featuring real-time feeds, user profiles, post interactions (likes, comments), follow system, notifications, image uploads, and full-text search. The entire stack runs on Supabase (Postgres + Auth + Storage) with a React SPA frontend.

---

## Architecture

```
magisk/
├── src/
│   ├── components/          UI components
│   │   ├── auth/            Login & registration forms
│   │   ├── common/          LoadingSpinner, EmptyState, ProtectedRoute
│   │   ├── feed/            FeedPost, CreatePost
│   │   ├── layout/          Navbar, Sidebar, Layout shell
│   │   ├── post/            Post detail components
│   │   ├── profile/         ProfileHeader, ProfilePosts, EditProfile
│   │   └── ui/              Avatar, Button, Input, Modal, Textarea, Toast
│   ├── hooks/               React Query hooks
│   │   ├── useAuth.ts       Auth state (Zustand + Supabase listener)
│   │   ├── usePosts.ts      Feed, user posts, create, delete, like, single post
│   │   ├── useProfile.ts    Profile, search, follow
│   │   ├── useInteractions.ts Comments, notifications
│   │   └── useMediaUpload.ts Image upload with preview
│   ├── pages/               Route-level pages (10 pages)
│   ├── services/            Supabase API wrappers
│   │   ├── auth.service.ts  Sign in, sign up, sign out, session
│   │   ├── posts.service.ts CRUD + feed + likes
│   │   ├── profiles.service.ts Profiles + search + follow
│   │   ├── interactions.service.ts Comments + notifications
│   │   └── storage.service.ts  Image upload/delete (avatars, covers, posts)
│   ├── stores/              Zustand stores (auth)
│   ├── validations/         Zod schemas (auth, post, profile)
│   ├── types/               TypeScript types + Supabase generated types
│   ├── lib/                 Utilities, Supabase client, toast, constants
│   └── styles/              Global CSS + Tailwind layers
├── supabase/
│   ├── config.toml          Local Supabase config
│   └── migrations/          Database migrations
├── tests/                   Playwright E2E tests
├── public/                  Static assets
└── mobile/                  Mobile wrapper (future)
```

---

## Features

- **Authentication** — email/password sign up & login via Supabase Auth with persistent session.
- **Feed** — infinite-scrolling post feed with real-time like and comment counts.
- **Posts** — create posts with optional image uploads, delete own posts.
- **Likes** — optimistic toggle with instant UI feedback.
- **Comments** — infinite-scrolling comment threads on post detail pages.
- **Profiles** — public profiles with avatar, cover, bio, interests, follower/following counts.
- **Follow system** — follow/unfollow with live count updates.
- **Search** — real-time profile search by username or display name (React Query powered).
- **Notifications** — like, comment, and follow notifications with read tracking.
- **Image uploads** — avatars, covers, and post images via Supabase Storage with validation.
- **Dark theme** — premium dark UI with custom Tailwind color palette (`void`, `surface`, `accent`).
- **Protected routes** — auth-gated pages with redirect.
- **Toast notifications** — animated toast system with success/error/info states.
- **Responsive** — mobile-first layout with adaptive sidebar.
- **Type-safe** — full TypeScript with Zod validation and Supabase-generated database types.

---

## Tech Stack

| Layer          | Technology                                           |
|----------------|------------------------------------------------------|
| Framework      | React 18, TypeScript 5, Vite 6                      |
| Styling        | Tailwind CSS 3, clsx, tailwind-merge                 |
| State          | Zustand 5 (auth), React Query 5 (server state)       |
| Forms          | React Hook Form 7 + Zod resolvers                    |
| Animation      | Framer Motion 11                                     |
| Backend        | Supabase (Postgres, Auth, Storage, Realtime)         |
| Testing        | Playwright                                           |
| Linting        | ESLint 10 + typescript-eslint + react-hooks          |

---

## Prerequisites

| Requirement   | Version  |
|---------------|----------|
| Node.js       | 18+      |
| npm           | 9+       |
| Supabase CLI  | latest   |

---

## Installation

### 1. Clone

```bash
git clone https://github.com/eroge-collins/magisk.git
cd magisk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start development server

```bash
npm run dev
```

Opens at `http://localhost:3000`.

---

## Scripts

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start Vite dev server (port 3000)        |
| `npm run build`  | TypeScript check + production build      |
| `npm run preview`| Preview production build locally         |
| `npm run lint`   | Run ESLint                               |
| `npm run lint:fix`| Run ESLint with auto-fix               |
| `npm run test`   | Run Playwright E2E tests                 |

---

## Database

Migrations are in `supabase/migrations/`. To apply them locally:

```bash
supabase start
supabase db reset
```

The types in `src/types/database.ts` were generated with:

```bash
supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```

---

## Project Structure Conventions

| Path                | Purpose                                  |
|---------------------|------------------------------------------|
| `src/services/`     | Supabase API calls (data layer)          |
| `src/hooks/`        | React Query hooks (server state)         |
| `src/stores/`       | Zustand stores (client state)            |
| `src/components/`   | Reusable UI components                   |
| `src/pages/`        | Route-level page components              |
| `src/validations/`  | Zod schemas for form validation          |
| `src/types/`        | TypeScript types + Supabase generated    |
| `src/lib/`          | Utilities, constants, clients            |

---

## License

MIT

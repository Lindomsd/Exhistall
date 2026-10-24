<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Exhistall — the digital marketplace

Exhistall is a marketplace where independent businesses open a virtual stall, showcase
products and services, run promotions, and book physical exhibition halls. It is a React 19
single-page app styled with Tailwind, backed by Supabase (auth, database, MFA for admins),
and deployed as a static site.

## Tech stack

- **React 19** + **TypeScript** (bundled with Vite)
- **React Router 7** for real, shareable URLs and browser history
- **Tailwind CSS 3** for the navy-and-gold market design system
- **Supabase** for authentication, data and admin two-factor

## Prerequisites

- Node.js **20.12+** (see `.nvmrc`)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and add your public Supabase values:

   ```bash
   cp .env.example .env.local
   ```

   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
   Never put a service-role key in a Vite env file — only public `VITE_*` values belong here.

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Available scripts

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the Vite dev server                 |
| `npm run build`        | Production build into `dist/`             |
| `npm run preview`      | Preview the production build locally      |
| `npm run typecheck`    | Type-check without emitting               |
| `npm run lint`         | Run ESLint                                |
| `npm run format`       | Format the codebase with Prettier         |

## Database

Schema and access policies live in `supabase/migrations`. Apply them to your project with the
Supabase CLI (`supabase db push`) or the SQL editor.

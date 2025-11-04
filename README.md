# Signalist – Stock Market Analyzer

Signalist is a modern stock market dashboard that helps you research tickers, track a personal watchlist, view market insights with TradingView widgets, and receive helpful emails like personalized welcomes and daily news summaries. It’s built with Next.js App Router, Better Auth for authentication, MongoDB via Mongoose, Inngest for background jobs and AI summarization, and Nodemailer for email delivery.

## Contents
- Overview
- Features
- Architecture & Tech Stack
- App Structure
- Core Functionality
- API & Background Jobs
- Environment Variables
- Getting Started (Local Development)
- Build & Production Run
- Troubleshooting

## Overview
Signalist focuses on three pillars:
- Authentication and user profile bootstrapping
- Watchlist-centered research and news
- Insightful UI via TradingView widgets, with optional email updates

## Features
- Authentication with email + password using Better Auth
- Secure route protection via middleware; anonymous users are redirected to `sign-in`
- Watchlist model in MongoDB to store user-specific symbols
- Stock search and market news using Finnhub APIs
- TradingView-based dashboard widgets (market overview, heatmap, technical analysis, candles, company info)
- Contact form that emails the project owner
- Email notifications
  - Personalized welcome email on sign-up (AI-crafted intro)
  - Daily news summary per user (based on watchlist; falls back to general market news)
- Background jobs powered by Inngest with Gemini-based summarization

## Architecture & Tech Stack
- Framework: Next.js 15 (App Router, React 19)
- Styling/UI: Tailwind CSS 4, Radix UI primitives, `lucide-react`
- Auth: `better-auth` + `better-auth/adapters/mongodb` with Next.js cookies plugin
- Database: MongoDB with Mongoose (connection pooling + caching)
- Background jobs & AI: Inngest (Gemini 1.5 for text generation/summarization)
- Email: Nodemailer via Gmail (or any SMTP provider you configure)
- Data: Finnhub API
- Utilities: `react-hook-form`, `tailwind-merge`, `clsx`, `sonner`

## App Structure
High-level directories:
- `app/`: Next.js routes (auth pages, public pages, API routes, middleware)
- `lib/`: Actions (server functions), auth setup, constants, Inngest client/functions/prompts, email helpers
- `Database/`: Mongoose connection and `Watchlist` model
- `components/`: UI components and TradingView widget wrappers
- `types/`: Global types

Key files to know:
- Auth setup: `lib/better-auth/auth.ts`
- DB connection: `Database/mongoose.ts`
- Watchlist model: `Database/models/watchlist.model.ts`
- Finnhub actions: `lib/actions/finnhub.actions.ts`
- Inngest: `lib/inngest/client.ts`, `lib/inngest/function.ts`, `lib/inngest/prompts.ts`
- Emails: `lib/NodeMailer/index.ts`, `lib/NodeMailer/templates.ts`
- API routes: `app/api/auth/[...all]/route.ts`, `app/api/contact-us/route.ts`, `app/api/inngest/route.ts`
- Middleware (route protection): `app/middleware/index.ts`

## Core Functionality

### Authentication (Better Auth)
- Initialization happens in `lib/better-auth/auth.ts`. It connects to MongoDB, configures `emailAndPassword`, and exposes `auth.api` handlers.
- API endpoint proxy: `app/api/auth/[...all]/route.ts` forwards GET/POST to Better Auth.
- Middleware protects all non-public routes and redirects unauthenticated users to `sign-in`.

Public pages under `app/(auth)/` include `sign-in` and `sign-up`.

### Database & Models
- `Database/mongoose.ts` provides a cached connection with sensible pool/timeouts and logs environment.
- `Watchlist` (`Database/models/watchlist.model.ts`) stores: `userId`, `symbol`, `company`, `addedAt` with a unique index per `(userId, symbol)`.

### Watchlist & User Actions
- `lib/actions/watchlist.actions.ts` → `getWatchlistSymbolsByEmail(email)` resolves Better Auth’s `user` collection, finds the user by email, then fetches symbols from `Watchlist`.
- `lib/actions/user.actions.ts` → `getAllUsersForNewsEmail()` fetches basic user records for emailing.

### Market Data (Finnhub)
- `lib/actions/finnhub.actions.ts` provides:
  - `getNews(symbols?: string[])`: fetches up to 6 articles. If symbols are provided, fetches company news in a round‑robin fashion; otherwise falls back to general news.
  - `searchStocks(query?: string)`: searches Finnhub or shows popular profiles if no query.
- Helpers in `lib/utils.ts` format time, market cap, dates, article payloads, etc.
- Constants and TradingView configs live in `lib/constants.ts`.

### TradingView Widgets
This project includes configuration objects for TradingView widgets (market overview, heatmap, candle chart, baseline, technical analysis, company profile, financials). See `lib/constants.ts` and components under `components/` like `TradingViewWidget.tsx` and related hooks in `hooks/useTradingViewWidgets.tsx`.

### Emails
- Transporter in `lib/NodeMailer/index.ts` uses `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD`.
- Templates in `lib/NodeMailer/templates.ts` for:
  - Welcome email
  - Daily news summary
  - Price upper/lower alerts
  - Volume alerts
  - Inactive user reminder

### Background Jobs (Inngest + Gemini)
- `lib/inngest/client.ts` bootstraps an Inngest client with Gemini API key.
- `lib/inngest/function.ts` defines two functions:
  - `sendSignUpEmail`: Listens to `app/user.created`, generates a personalized intro via Gemini using `PERSONALIZED_WELCOME_EMAIL_PROMPT`, and sends a welcome email.
  - `sendDailyNewsSummary`: Cron `0 12 * * *` or `app/send.daily.news` event. For each user, pulls their watchlist, fetches associated news (fallback to general), summarizes via Gemini using `NEWS_SUMMARY_EMAIL_PROMPT`, and emails the result.
- Exposed via `app/api/inngest/route.ts` using `serve` from `inngest/next` (GET/POST/PUT).

## API & Background Jobs

### API Endpoints
- `GET/POST /api/auth/*` → Better Auth handler
- `POST /api/contact-us` → Validates payload and emails the owner
- `GET|POST|PUT /api/inngest` → Inngest function runner endpoint

Example: send a contact message
```bash
curl -X POST http://localhost:3000/api/contact-us \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "contactNumber":"+1-555-1234",
    "title":"Partnership Inquiry",
    "description":"We would love to discuss a partnership opportunity."
  }'
```

### Background Jobs
- Signup: triggered when `signUpWithEmail` calls `inngest.send({ name: 'app/user.created', ... })` in `lib/actions/auth.action.ts`.
- Daily news: triggered automatically via cron (`0 12 * * *`) or by sending an event `app/send.daily.news` to Inngest.

## Environment Variables
Create a `.env.local` with the following keys:

- Required
  - `MONGODB_URI` → MongoDB connection string
  - `BETTER_AUTH_SECRET` → Secret for Better Auth
  - `BETTER_AUTH_URL` → Base URL (e.g., `http://localhost:3000` or production URL)
  - `NODEMAILER_EMAIL` → SMTP username (e.g., Gmail address)
  - `NODEMAILER_PASSWORD` → SMTP password or app password
  - One of: `FINNHUB_API_KEY` or `NEXT_PUBLIC_FINNHUB_API_KEY` → Finnhub token
  - `GEMINI_API_KEY` → For Inngest AI (Gemini 1.5)

- Optional
  - `NODE_ENV` → Affects logging in DB connect helper

Notes:
- Gmail often requires an App Password when 2FA is enabled.
- If `FINNHUB_API_KEY` is not set, features like search/news will gracefully degrade.

## Getting Started (Local Development)
1) Install dependencies
```bash
pnpm install
# or npm install
yarn install
```

2) Configure `.env.local` as described above.

3) Start the dev server
    npm run dev

The app runs at `http://localhost:3000`.

Sign up with email/password on `http://localhost:3000/sign-up`. On successful sign-up, a personalized welcome email is sent via Inngest + Nodemailer.


```

Deployment tips:
- Ensure all env vars are set in your hosting platform.
- Inngest cron requires Inngest Cloud or a compatible scheduler hitting `/api/inngest` (when running locally, you can manually trigger events via the Inngest UI/CLI).
- Configure SMTP credentials for email delivery.

## Troubleshooting
- Authentication not working
  - Verify `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
  - Check network access to MongoDB.

- No emails received
  - Confirm `NODEMAILER_EMAIL`/`NODEMAILER_PASSWORD` and SMTP/App Password.
  - Check host spam folder and sending limits.

- No market news / search empty
  - Ensure `FINNHUB_API_KEY` (or `NEXT_PUBLIC_FINNHUB_API_KEY`) is set.

- Inngest jobs not firing
  - For cron, use Inngest Cloud. For dev, trigger `app/send.daily.news` event or test `sendSignUpEmail` by creating a new user.

---

Made with ❤️ by the Signalist team Gohar Abbas & Shoaib Akhtar.

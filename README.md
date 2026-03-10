# Flowly

> Break anything down. Start anyway.

[![Tests](https://github.com/Y2MC/flowly/actions/workflows/test.yml/badge.svg)](https://github.com/Y2MC/flowly/actions/workflows/test.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

**Live:** https://useflowly.vercel.app · **Repo:** https://github.com/Y2MC/flowly

---

## What is Flowly?

Flowly is a SaaS task manager built specifically for people with ADHD. The core idea is simple — instead of showing you a list of things to do, it asks the AI to break each task into steps so small they feel impossible to say no to.

I built this because most productivity apps assume you just need a place to write things down. ADHD doesn't work that way. The problem isn't remembering what to do — it's starting.

---

## How it works

1. Add any task — doesn't matter how vague
2. Click "Break it down" — GPT-4o-mini generates 4-6 concrete micro-steps
3. Click "Focus" — enter focus mode and see one step at a time
4. Mark each step done and move to the next

Free users get 5 AI breakdowns per day. Pro users get unlimited.

---

## Features

**Free**

- Unlimited tasks
- 5 AI breakdowns per day
- Focus mode
- Google sign in

**Pro — NZD $8/month**

- Unlimited AI breakdowns
- Priority support

---

## Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Framework | Next.js 16 (App Router)           |
| Language  | TypeScript                        |
| Styling   | Tailwind CSS v4                   |
| Database  | PostgreSQL via Supabase           |
| ORM       | Prisma 5                          |
| Auth      | NextAuth.js v4 (JWT sessions)     |
| AI        | OpenAI API (GPT-4o-mini)          |
| Payments  | Stripe (subscriptions + webhooks) |
| Hosting   | Vercel                            |
| Testing   | Vitest                            |
| CI/CD     | GitHub Actions                    |

---

## Project Structure

```
flowly/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth Google OAuth handler
│   │   ├── tasks/                # Task CRUD (GET, POST, DELETE)
│   │   ├── breakdown/            # OpenAI task breakdown endpoint
│   │   ├── steps/                # Step fetch + mark done (GET, PATCH)
│   │   └── stripe/
│   │       ├── checkout/         # Stripe checkout session creation
│   │       └── webhook/          # Stripe webhook handler
│   ├── dashboard/                # Main app dashboard (protected)
│   ├── focus/                    # Focus mode — one step at a time
│   ├── login/                    # Google sign in page
│   ├── providers.tsx             # SessionProvider wrapper
│   └── page.tsx                  # Landing page
├── lib/
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   └── schema.prisma             # User, Task, Step, Subscription models
├── __tests__/
│   └── utils.test.ts             # Vitest unit tests
└── .github/
    └── workflows/
        └── test.yml              # CI — runs tests on every push to main
```

---

## Running locally

### Prerequisites

- Node.js v22+
- pnpm
- Supabase project (free tier is fine)
- Stripe account (test mode)
- OpenAI API key

### Setup

```bash
git clone https://github.com/Y2MC/flowly.git
cd flowly
pnpm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
# Database
# Must use Supabase Session Pooler with pgbouncer params
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=1

# Auth
NEXTAUTH_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
```

Push the schema to your database:

```bash
npx prisma db push
npx prisma generate
```

Start the dev server:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

---

## Roadmap

- [x] Phase 0 — Dev environment
- [x] Phase 1 — Project scaffold + Vercel deployment
- [x] Phase 2 — PostgreSQL + Prisma + Supabase
- [x] Phase 3 — Google OAuth (NextAuth.js)
- [x] Phase 4 — Task management (add, view, delete)
- [x] Phase 5 — AI task breakdown (OpenAI GPT-4o-mini)
- [x] Phase 6 — Stripe subscriptions (free tier + Pro)
- [x] Phase 7 — Landing page, focus mode, mobile responsive
- [x] Phase 8 — Vitest + GitHub Actions CI/CD
- [ ] Phase 9 — Crisis mode, daily brain dump, UI polish, public launch

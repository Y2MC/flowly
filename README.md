# Flowly

> Calm task management for ADHD brains.

**Live:** https://useflowly.vercel.app · **Repo:** https://github.com/Y2MC/flowly

---

## What is Flowly?

Flowly is a full stack SaaS application that helps people with ADHD start tasks they've been avoiding. You type anything — a vague worry, a project, a chore — and the AI breaks it into steps so small and specific that not starting feels harder than just doing the first one.

One step at a time. No lists. No overwhelm. Just the next thing.

---

## The Problem

People with ADHD don't lack motivation — they lack the ability to start. The mental effort required to figure out what to do first, how to break it down, and where to begin is often bigger than the task itself. Standard to-do apps make this worse: they show a wall of tasks, create guilt, and offer no guidance on how to begin.

Flowly solves the starting problem, not the organising problem.

---

## Features

### Free Tier

- AI task breakdown (up to 5 tasks/day)
- One-step focus mode — see only the next action, nothing else
- Basic task history

### Pro Tier — NZD $8/month

- Unlimited AI breakdowns
- Crisis Mode — extreme simplification for your worst days
- Daily brain dump → full structured day plan
- Streak tracking with zero-shame resets

---

## Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 14 (App Router)  |
| Language   | TypeScript               |
| Styling    | Tailwind CSS             |
| Database   | PostgreSQL (Supabase)    |
| ORM        | Prisma                   |
| Auth       | NextAuth.js              |
| AI         | OpenAI API (GPT-4o-mini) |
| Payments   | Stripe                   |
| Deployment | Vercel                   |
| CI/CD      | GitHub Actions           |

---

## Architecture

```
flowly/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # REST API endpoints
│   │   ├── auth/         # NextAuth handlers
│   │   ├── tasks/        # Task CRUD
│   │   ├── breakdown/    # OpenAI integration
│   │   └── webhooks/     # Stripe webhooks
│   ├── dashboard/        # Protected app pages
│   └── (auth)/           # Login / signup pages
├── components/           # Reusable React components
├── lib/                  # Shared utilities (db, auth, stripe, openai)
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- A Supabase account (free)
- A Stripe account (free test mode)
- An OpenAI API key

### Installation

```bash
git clone https://github.com/Y2MC/flowly.git
cd flowly
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database setup

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

---

## Development Workflow

This project follows a professional engineering workflow:

- All features are tracked as issues in Linear before any code is written
- Every feature lives on its own branch: `feat/feature-name`
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
- PRs are opened and self-reviewed before merging to main
- GitHub Actions runs lint and tests on every PR
- Vercel auto-deploys on every merge to main

---

## Roadmap

- [x] Phase 0 — Dev environment setup
- [x] Phase 1 — Project scaffold, GitHub, Vercel deployment
- [x] Phase 2 — PostgreSQL database with Prisma ORM (Supabase)
- [x] Phase 3 — Google OAuth authentication (NextAuth.js)
- [x] Phase 4 — Core task management (add, view, delete)
- [x] Phase 5 — AI task breakdown via OpenAI GPT-4o-mini
- [x] Phase 6 — Stripe subscription payments (free/pro tier)
- [x] Phase 7 — Landing page, focus mode, steps API, mobile responsive
- [x] Phase 8 — Vitest Testing + GitHub Actions CI/CD
- [ ] Phase 9 — Public launch

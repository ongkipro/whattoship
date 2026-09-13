# WhatToShip (what-to-ship)

> **Autonomous Software Idea Intelligence Engine** indexing 13,445 validated software opportunities with Google Gemini UI/UX, deep 10-pillar analytical dossiers (including Target Geography, Buyer Personas, and Demographics), SQLite + FTS5 full-text search, and programmatic SEO.
>
> 🌐 **Live Production**: [https://whattoship.vercel.app](https://whattoship.vercel.app)  
> 📦 **GitHub Repository**: [https://github.com/ongkipro/whattoship](https://github.com/ongkipro/whattoship)

---

## 🌟 Key Features

- **Google Gemini Canvas UI/UX & Mobile Web App**:
  - High-contrast Google Gemini light aesthetic (`#ffffff` / `#f8f9fa` surface cards, `#e8eaed` borders, refined dark typography).
  - Floating prompt capsule search bar with ⌘K hotkey and interactive category pills.
  - Interactive multi-dimensional filters (Type, Category, SEO Difficulty, Tech Complexity, Revenue Model, Trending).
  - Native-grade docked **Bottom Navigation Bar** (`BottomNav.tsx`) with safe-area inset (`env(safe-area-inset-bottom)`), $\ge 44\text{px}$ touch targets, and real-time saved count badge.
  - iOS Safari anti-zoom safeguards (minimum 16px font size on inputs to prevent unwanted viewport scaling).
  - Interactive Bookmark Save/Unsave drawer (`/bookmarks`) backed by `useSyncExternalStore` and CSV export.
- **Deep Analytical Intelligence Dossiers (`/ideas/[slug]`)**:
  - **Market Demographics & Target Persona Card**: Verified target countries (Tier-1 US/UK/CA/AU vs Emerging vs Global), buyer persona profile, and audience demographics.
  - **8-Axis SVG Radar Scorecard**: Market Demand, SEO Feasibility, Tech Feasibility, Monetization Potential, Defensibility, Velocity to MVP, Scalability, Capital Efficiency.
  - **Structured Breakdown Sections**:
    1. Market Demand & Search Volume Breakdown
    2. Recommended Technical Architecture & Stack
    3. Monetization Blueprint & Unit Economics
    4. Programmatic SEO Strategy & Target Long-Tails
    5. 7-Day Rapid MVP Execution Checklist
    6. Ready-to-Use AI Starter Prompt (1-click copyable with clipboard feedback)
    7. Competitor Wedge & Unique Advantage
  - Semantic JSON-LD structured data markup (`WebApplication` schema) on every idea page.
- **Dual-Layer Data & Programmatic MDX**:
  - High-performance SQLite database (`data/what_to_ship.db`) with FTS5 search queries executing in $< 2\text{ms}$.
  - On-Demand Programmatic MDX endpoint (`/api/ideas/[slug]/mdx`) generating frontmatter-rich Markdown files on the fly for AI agents or documentation builders.
- **Curated Thematic Hubs (`/collections` & `/collections/[slug]`)**:
  - *Instant Wins & Fast TTM*: Low difficulty, fast build ideas.
  - *High-Yield Micro-SaaS*: B2B and recurring subscription tools.
  - *Breakout Trends (>100% Growth)*: Fast-growing search queries.
  - *AI-Native Utilities*: AI-driven apps, wrappers, and workflows.
  - *Solo Founder Sweetspot*: Manageable tech complexity and solid monetization.
  - *Niche B2B Workflow Tools*: Low churn and high retention workflows.
- **High-Performance Serverless Architecture**:
  - Automated `/tmp` cold-start mirror on Vercel ensuring zero POSIX file locking or EROFS read-only errors.
  - SQLite FTS5 virtual table (`ideas_fts`) executing keyword queries across 13,445 items in ~1.07ms.
  - Dynamic XML Sitemap index (`/sitemap.xml`) routing into chunked sub-sitemaps (`/sitemap-[id].xml` with 2,000 URLs each).
  - Dynamic OpenGraph social share image generator (`/ideas/[slug]/opengraph-image`) rendering 1200x630 PNG badges with `@vercel/og`.
  - Streaming CSV & JSON export API (`/api/export`).

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 20+ (managed via `mise` or system)
- SQLite3 with FTS5 support (included in `better-sqlite3`)

### 2. Installation
```bash
npm install
```

### 3. Database Initialization & Seeding
```bash
# Ingest 13,445 ideas from dataset and seed collections + FTS5 index
npm run db:seed

# Generate 8-pillar analytical intelligence dossiers for all 13,445 ideas
npm run enrich:baseline

# Optional: Run deep LLM enrichment on high-priority ideas
npm run enrich:deep
```

### 4. Development & Production Run
```bash
# Start Next.js development server on port 3000
npm run dev

# Or build and start production server
npm run build
npm start
```

---

## 🧪 Testing & Verification

```bash
# Run linting (zero errors / warnings)
npm run lint

# Run full system verification suite (12 automated checks across UI, API, Sitemaps, OG Images)
npx tsx scripts/verify-all.ts
```

---

## 📂 Project Structure

```
├── data/
│   └── what_to_ship.db          # SQLite DB (ideas, idea_analyses, collections, ideas_fts)
├── scripts/
│   ├── setup-db.ts              # Ingestion & FTS5 seeding script
│   ├── enrich-baseline.ts       # 8-pillar analytical dossier generator
│   ├── enrich-deep.ts           # Deep AI enrichment worker
│   └── verify-all.ts            # 12-point E2E integration test suite
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── export/          # CSV / JSON export API
│   │   │   ├── ideas/           # FTS5 search and idea detail API
│   │   │   └── sitemaps/[id]/   # Chunked XML sitemaps (2,000 URLs/chunk)
│   │   ├── bookmarks/           # User saved ideas & export route
│   │   ├── collections/         # Curated thematic collections
│   │   ├── ideas/[slug]/        # Idea Intelligence Dossier & Dynamic OG Image
│   │   ├── globals.css          # Gemini design system & aura tokens
│   │   ├── layout.tsx           # Root layout with fonts and metadata
│   │   ├── page.tsx             # Explorer homepage with search & filters
│   │   └── sitemap.xml/         # Sitemap index router
│   ├── components/
│   │   ├── AIPromptBox.tsx      # Copyable AI prompt starter component
│   │   ├── FilterBar.tsx        # Multi-dimensional filter controls
│   │   ├── IdeaCard.tsx         # Gemini surface card
│   │   ├── Navbar.tsx           # Frosted glass Gemini navigation bar
│   │   ├── RadarScorecard.tsx   # 8-axis SVG radar visualization
│   │   └── SearchCapsule.tsx    # Floating Gemini prompt capsule search bar
│   ├── db/
│   │   ├── index.ts             # better-sqlite3 connection with WAL & cache
│   │   └── schema.ts            # Drizzle ORM schema definitions
│   └── lib/
│       ├── bookmarks.ts         # useSyncExternalStore localStorage hook
│       └── utils.ts             # Tailwind class mergers & formatters
├── AGENTS.md                    # Agent collaboration contract
├── PRD.md                       # Product Requirements Document
├── PLAN.md                      # Implementation Plan
├── TASKS.md                     # Completed Execution Queue (T1 - T23)
└── STATUS.md                    # Production Readiness Record
```

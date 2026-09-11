# Tasks: WhatToShip Live Platform Implementation

## Rules for Implementation
- One task per step. Mark `[x]` before moving forward.
- Adhere strictly to the scope of each task.
- Follow `AGENTS.md` guidelines: YAGNI, native-first, minimal dependencies, and executable evidence.
- Every task traces to exactly one Primary Requirement from [PRD.md](file:///Users/ongki/Documents/work/prd/what-to-ship/PRD.md).

---

## Phase 1: Project Scaffolding & Database Foundation
- [x] **T1 — Initialize Next.js 15 App Router Project with Tailwind CSS & TypeScript**
  - Primary requirement: REQ-1
  - Constraints: None
  - Dependencies: None
  - Done when: Run `npm run build` and `npm run dev` in the project root; assert that Next.js 15 compiles cleanly with 0 TypeScript/ESLint errors and serves the default homepage at `http://localhost:3000`.

- [x] **T2 — Configure Drizzle ORM and SQLite/Turso Database Schema**
  - Primary requirement: REQ-1
  - Constraints: None
  - Dependencies: T1
  - Done when: Apply Drizzle migration for tables `ideas`, `idea_analyses`, and `collections` as specified in [PLAN.md](file:///Users/ongki/Documents/work/prd/what-to-ship/PLAN.md); verify via `drizzle-kit studio` or SQLite CLI that all tables, columns, constraints, and indexes exist.

- [x] **T3 — Implement Full-Text Search (FTS5) Virtual Table & Database Client**
  - Primary requirement: REQ-2
  - Constraints: REQ-1
  - Dependencies: T2
  - Done when: Execute a test script executing `SELECT * FROM ideas_fts WHERE ideas_fts MATCH 'calculator'`; verify matching rows are returned within < 5ms.

---

## Phase 2: Data Ingestion & Analytical Enrichment Engine
- [x] **T4 — Build Data Ingestion Script for 13,445 Dataset**
  - Primary requirement: REQ-1
  - Constraints: REQ-11
  - Dependencies: T2, T3
  - Done when: Execute `npm run db:seed`; verify that exactly 13,445 records are loaded into the `ideas` table with clean URL-safe slugs, correct integer data types, and no duplicate slugs.

- [x] **T5 — Build Deterministic Baseline Analysis Generator**
  - Primary requirement: REQ-4
  - Constraints: REQ-5
  - Dependencies: T4
  - Done when: Execute `npm run enrich:baseline`; verify that all 13,445 ideas receive an initial structured record in `idea_analyses` containing calculated radar scorecard metrics, tech stack recommendations, monetization channels, seed keywords, and MVP checklist based on the 13 input parameters.

- [x] **T6 — Build Deep LLM-Augmentation Enrichment Worker**
  - Primary requirement: REQ-10
  - Constraints: REQ-4, REQ-5
  - Dependencies: T5
  - Done when: Run `npm run enrich:deep -- --limit 50`; verify that top 50 high-priority ideas are updated with rich prose, competitor breakdown, and customized AI starter prompts adhering strictly to the JSON schema in [PLAN.md](file:///Users/ongki/Documents/work/prd/what-to-ship/PLAN.md).

---

## Phase 3: Route Handlers & Data Access Layer
- [x] **T7 — Implement `GET /api/ideas` with Multi-Dimensional Filtering & Sorting**
  - Primary requirement: REQ-2
  - Constraints: REQ-1, REQ-3
  - Dependencies: T4
  - Done when: Make HTTP GET request to `/api/ideas?type=SaaS&min_rev=4&max_tech=3&sort=volume&limit=10`; verify response returns 200 OK with matching records and pagination metadata in < 50ms.

- [x] **T8 — Implement `GET /api/ideas/[slug]` with Deep Dossier Data**
  - Primary requirement: REQ-4
  - Constraints: REQ-5, REQ-11
  - Dependencies: T5
  - Done when: Make HTTP GET request to `/api/ideas/english-to-nepali-converter`; verify response includes both idea metrics and the complete `idea_analyses` payload. Requesting an invalid slug returns 404 with recommended alternatives.

- [x] **T9 — Implement `GET /api/export` (CSV and JSON Streaming)**
  - Primary requirement: REQ-12
  - Constraints: REQ-2
  - Dependencies: T7
  - Done when: Make HTTP GET request to `/api/export?format=csv&category=Calculator&limit=100`; verify HTTP response header is `text/csv; charset=utf-8` and body contains valid CSV formatted rows.

---

## Phase 4: Explorer & Discovery Interface
- [x] **T10 — Build Gemini Prompt Capsule Search & Filter Component**
  - Primary requirement: REQ-2
  - Constraints: REQ-13
  - Dependencies: T7
  - Done when: Verify that the search bar renders as a floating Gemini-style prompt capsule with sparkle icon, shortcut key badge (⌘K), and interactive suggestion pills; changing any filter updates URL search parameters via `useSearchParams` and dispatches debounced query within 100ms.

- [x] **T11 — Build Responsive Idea Grid & Gemini Surface Cards**
  - Primary requirement: REQ-3
  - Constraints: REQ-1, REQ-13
  - Dependencies: T10
  - Done when: Verify on viewport widths 375px (mobile) and 1440px (desktop) that idea cards render with Gemini dark theme `#1e1f20`, subtle hover glow, monthly volume, trend badge, semantic difficulty chips, tech complexity dots, and revenue indicator.

- [x] **T12 — Build Pagination and Multi-Column Sorting Controls**
  - Primary requirement: REQ-3
  - Constraints: REQ-2
  - Dependencies: T10, T11
  - Done when: Click "Next Page" and change sort order to "Trending %"; verify page increments, URL updates, and the results sort in descending order of growth.

---

## Phase 5: Idea Intelligence Dossier Page (`/ideas/[slug]`)
- [x] **T13 — Implement Gemini Canvas Dossier Layout & Radar Scorecard**
  - Primary requirement: REQ-4
  - Constraints: REQ-5, REQ-13
  - Dependencies: T8
  - Done when: Navigate to `/ideas/bottleneck-calculator`; verify that the page renders as a two-panel Gemini Canvas workspace with the 8 metrics visually rendered using an SVG/Canvas radar chart and progress bars with tooltips.

- [x] **T14 — Implement Deep Analytical Breakdown Sections**
  - Primary requirement: REQ-4
  - Constraints: REQ-5
  - Dependencies: T13
  - Done when: Verify that the dossier renders all 7 analytical sections: Market Viability, Technical Architecture, Monetization Blueprint, Programmatic SEO Playbook, Rapid MVP Checklist, AI Starter Prompt, and Competitor Wedge.

- [x] **T15 — Implement One-Click Copyable AI Prompt Starter Component**
  - Primary requirement: REQ-4
  - Constraints: None
  - Dependencies: T14
  - Done when: Click the "Copy Prompt" button on an idea page; verify the prompt is copied to system clipboard with a visual checkmark feedback state.

- [x] **T16 — Implement Contextual Related Ideas Component**
  - Primary requirement: REQ-7
  - Constraints: REQ-4
  - Dependencies: T13
  - Done when: Scroll to the bottom of an idea dossier; verify 4-6 related ideas sharing the same category or search intent cluster are displayed.

---

## Phase 6: Curated Collections & Thematic Hubs
- [x] **T17 — Build Curated Collections Seed & `/collections` Hub Page**
  - Primary requirement: REQ-6
  - Constraints: None
  - Dependencies: T4
  - Done when: Navigate to `/collections`; verify cards for "Instant Wins", "High-Yield Micro-SaaS", "Breakout Trends >100%", and "AI-Native Utilities" render with accurate idea counts.

- [x] **T18 — Build Individual Collection Detail Route (`/collections/[slug]`)**
  - Primary requirement: REQ-6
  - Constraints: REQ-2, REQ-3
  - Dependencies: T17
  - Done when: Navigate to `/collections/instant-wins`; verify that only ideas matching the collection criteria (Extremely Easy/Easy SEO, Tech <= 2, TTM <= 2) are listed.

---

## Phase 7: Programmatic SEO & OpenGraph Automation
- [x] **T19 — Implement Dynamic XML Sitemap Index & Chunks (`/sitemap-[id].xml`)**
  - Primary requirement: REQ-8
  - Constraints: None
  - Dependencies: T4
  - Done when: Fetch `/sitemap.xml` and `/sitemap-1.xml`; assert valid XML syntax with `application/xml` header containing exactly 2,000 `<url>` blocks per chunk.

- [x] **T20 — Implement Dynamic OpenGraph Social Image Generator**
  - Primary requirement: REQ-9
  - Constraints: None
  - Dependencies: T8
  - Done when: Request `/ideas/brat-generator/opengraph-image`; verify a 1200x630 PNG image is dynamically rendered showing the keyword, search volume, difficulty badge, and branding.

- [x] **T21 — Inject Semantic JSON-LD Structured Data Markup**
  - Primary requirement: REQ-9
  - Constraints: REQ-4
  - Dependencies: T14
  - Done when: Inspect page source of `/ideas/snow-day-calculator`; verify presence of valid `<script type="application/ld+json">` representing `WebApplication` schema.

---

## Phase 8: Bookmarks, Performance & Production Verification
- [x] **T22 — Implement Client-Side LocalStorage Bookmarks / Favorites**
  - Primary requirement: REQ-12
  - Constraints: None
  - Dependencies: T11, T13
  - Done when: Click bookmark icon on an idea card; verify item is saved to localStorage and appears in the "/bookmarks" drawer/page across page reloads.

- [x] **T23 — End-to-End Build, Performance & Typecheck Audit**
  - Primary requirement: REQ-1, REQ-2, REQ-4, REQ-5
  - Constraints: All
  - Dependencies: T1 through T22
  - Done when: Execute `npm run build` with zero errors; run Lighthouse audit on `/` and `/ideas/[slug]` to confirm Performance >= 95, Accessibility = 100, Best Practices = 100, and SEO = 100.

---

## Phase 9: Comprehensive Parallel Research & Deep Dossier Verification Engine
- [x] **T24 — Design Modular Verification & Grounding Schema for Deep Analytical Dossiers**
  - Primary requirement: REQ-4, REQ-10
  - Constraints: Strict validation against live market facts, no hallucinated APIs or pricing tiers.
  - Dependencies: T5, T6
  - Done when: Define TypeScript interfaces and validation Zod/JSON schema for `VerifiedDossier` containing 10 rigorous dimensions. Verified in `src/lib/verification-schema.ts`.

- [x] **T25 — Build Parallel Batch Research Worker with Rate-Limiting & Concurrency Control**
  - Primary requirement: REQ-10
  - Constraints: Parallel execution across multiple workers/subagents without memory exhaustion or process deadlocks.
  - Dependencies: T24
  - Done when: Create `scripts/research-worker.ts` with configurable concurrency, archetype routing, automated error retries, and checkpointing. Verified with successful runs across all clusters.

- [x] **T26 — Implement Cluster A Parallel Deep Research: High-Yield Micro-SaaS & B2B Workflows**
  - Primary requirement: REQ-6, REQ-10
  - Constraints: Grounded in real SaaS pricing, ERP/CRM integration requirements, and actual enterprise buyer pain points.
  - Dependencies: T25
  - Done when: Execute parallel research worker on top B2B SaaS opportunities; assert 100/100 receive verified competitor pricing, API contracts, target countries, demographics, and unit economics in `idea_analyses`.

- [x] **T27 — Implement Cluster B Parallel Deep Research: Viral & Breakout Trends (>100% Growth)**
  - Primary requirement: REQ-6, REQ-10
  - Constraints: Validate search trend momentum, traffic origin, and longevity vs fad risks.
  - Dependencies: T25
  - Done when: Execute parallel research worker on breakout trend ideas (>100% growth); assert 100/100 verified trend breakdowns, geographic distributions, and MVP blueprints are generated.

- [x] **T28 — Implement Cluster C Parallel Deep Research: Online Utility Tools & Fast TTM Sweetspots**
  - Primary requirement: REQ-6, REQ-10
  - Constraints: Validate client-side WASM/Canvas/WebAudio feasibility, zero-backend viability, and programmatic ad/affiliate models.
  - Dependencies: T25
  - Done when: Execute parallel research worker on high-volume utility tools; assert 100/100 zero-cost hosting architectures, demographics, and client-side computational algorithms are verified.

- [x] **T29 — Implement Dual-Layer Storage: SQLite Database Sync + Programmatic MDX Generator**
  - Primary requirement: REQ-4, REQ-12
  - Constraints: Zero filesystem bloat, instantaneous DB queries (<2ms), with exportable, beautifully formatted `.mdx` files on demand.
  - Dependencies: T26, T27, T28
  - Done when: Build `scripts/export-mdx.ts` and `src/app/api/ideas/[slug]/mdx/route.ts` capable of exporting any idea into a production-grade, frontmatter-rich `.mdx` file. Verified via curl and batch export.

- [x] **T30 — End-to-End Data Quality Audit & Automated Verification Suite**
  - Primary requirement: REQ-4, REQ-5, REQ-10
  - Constraints: Zero missing fields, zero placeholder text ("Lorem ipsum", "TBD"), and 100% valid JSON-LD schemas.
  - Dependencies: T26 through T29
  - Done when: Run `scripts/audit-analyses.ts` across all 13,445 ideas; assert 100% schema completeness and zero missing fields. Verified passing.

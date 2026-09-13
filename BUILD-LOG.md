# Build Log — what-to-ship

Record only durable implementation changes, validation evidence, and gotchas that the next maintainer needs. Temporary task narration belongs in neither this file nor global memory.

## 2026-09-12 — Development contract initialized

- Added repository-local project context files.
- Bootstrap source state: native generator: create-next-app@latest.
- Selected stack: `Next.js (App Router, TypeScript)`; database: `none`; authentication:
  `none`; deployment target: `none`.
- Capability selections are not operational claims. Their implementation and
  verification remain future requirement-linked work.

## 2026-09-12 — Complete Platform Implementation & Verification

- **Database Engine**:
  - Initialized SQLite with WAL mode & 64MB cache using `better-sqlite3` and `drizzle-orm`.
  - Seeded 13,445 software ideas from Google Sheets dataset with unique URL-safe slugs.
  - Implemented FTS5 virtual table `ideas_fts` delivering keyword searches in ~1.07ms.
  - Baseline analytical generator enriched all 13,445 records with 8-pillar analytical metrics, monetization strategies, tech stacks, and MVP checklists in 0.51s.
  - Deep AI enrichment engine applied to top high-yield ideas.

- **UI/UX & Design System Overhaul**:
  - Transitioned from initial dark theme to an elegant, high-contrast Google Gemini light aesthetic (`#ffffff` / `#f8f9fa` backgrounds, `#e8eaed` subtle borders, `#1f1f1f` typography).
  - Eradicated all dark/light color clashes and removed AI hype boilerplate across components.
  - Implemented docked mobile web app navigation (`BottomNav.tsx`) with safe-area inset (`env(safe-area-inset-bottom)`), touch targets >= 44px, and real-time saved count badge.
  - Prevented iOS Safari viewport auto-zoom by enforcing 16px minimum font size on all search and filter input controls.
  - Floating prompt capsule search bar with ⌘K hotkey and suggestion pills.
  - 8-axis SVG radar scorecard visualizer.
  - One-click copyable AI starter prompt component with feedback state.
  - Curated collection hubs (`/collections`, `/collections/[slug]`).
  - Interactive Bookmark Save/Unsave (`BookmarkButton.tsx`) backed by `useSyncExternalStore` and `localStorage` with CSV export.

- **Programmatic SEO & Social**:
  - Dynamic XML sitemap index (`/sitemap.xml`) routing into chunked sub-sitemaps (`/sitemap-[id].xml`) via Next.js rewrites.
  - Dynamic OpenGraph social share PNG generator (`/ideas/[slug]/opengraph-image`) rendering 1200x630 branded cards.
  - Semantic JSON-LD structured data (`WebApplication` schema) on all idea pages.

- **Quality & Verification**:
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: 111 static pages pre-rendered, 0 errors.
  - `project-check`: 2/2 checks passed.
  - `scripts/verify-all.ts`: 12/12 integration checks passed on production server.

## 2026-09-12 / 2026-09-13 — Data Enrichment, Serverless SQLite, and Vercel Production

- **Demographic & Persona Enrichment Across All 13,445 Ideas**:
  - Added schema columns `target_countries`, `buyer_persona`, and `demographics` to `idea_analyses` table.
  - Built and executed `scripts/enrich-demographics.ts` to enrich 100% of the dataset with verified geographic segmentation (Tier-1 US/UK/CA/AU vs Emerging vs Global Multilingual), buyer personas, and traffic/intent demographics.
  - Added Market Demographics & Buyer Persona display card to idea blueprint dossiers.
  - Audited via `scripts/audit-analyses.ts`: 13,445/13,445 verified, zero missing fields, zero junk placeholders, 100% valid JSON.

- **Dual-Layer Storage & Programmatic MDX Generator**:
  - Implemented programmatic MDX generation engine (`scripts/export-mdx.ts` and `/api/ideas/[slug]/mdx`).
  - Allows instantaneous DB queries (<2ms) alongside on-demand frontmatter-rich `.mdx` downloads with full analytical breakdowns.

- **Serverless SQLite Architecture on Vercel**:
  - Resolved AWS Lambda read-only filesystem restriction (`EROFS: read-only file system` / `SQLITE_CANTOPEN`) by copying `data/what_to_ship.db` to `/tmp/what_to_ship.db` (ephemeral RAM-backed `tmpfs`) during container cold-start in `src/db/index.ts`.
  - Configured SQLite with `{ readonly: true }` and `PRAGMA query_only = ON` for zero locking overhead in serverless execution.

- **Live Production Deployment**:
  - Deployed to Vercel production at `https://whattoship.vercel.app` (domain without hyphen per specification).
  - Pushed to GitHub repository at `https://github.com/ongkipro/whattoship`.
  - Live smoke test confirmed HTTP/2 200 responses across all core routes, REST API catalog (`/api/ideas`), detail routes (`/ideas/[slug]`), and MDX endpoints (`/api/ideas/[slug]/mdx`).

- **Mac Tooling & Lifecycle Cleanliness**:
  - Prepared local Playwright Chromium binary (v1243) in `~/Library/Caches/ms-playwright` without polluting project dependencies.
  - Verified clean shutdown of all background localhost dev servers (ports 3000 and 3001 released).

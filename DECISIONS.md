# Decision Register — what-to-ship

Updated: 2026-09-12

Record accepted decisions that materially constrain product behavior,
architecture, security, data, operations, or delivery. Repository evidence must
support each decision; AI output alone is not evidence.

| ID | Status | Decision | Drivers | Evidence | Supersedes |
|---|---|---|---|---|---|
| DEC-001 | ACCEPTED | Serverless SQLite via `/tmp` cold-start mirror on Vercel | AWS Lambda read-only root (`EROFS`) prevents SQLite lock files and journal write operations; `/tmp` provides fast writable `tmpfs` | `src/db/index.ts`, live deployment `whattoship.vercel.app` passing with HTTP/2 200 | — |
| DEC-002 | ACCEPTED | Dual-Layer Storage: SQLite indexed storage + on-demand programmatic MDX route | Avoid static filesystem bloat of 13,445 markdown files while supporting rich MDX downloads and AI agent readability | `src/app/api/ideas/[slug]/mdx/route.ts` & `scripts/export-mdx.ts` | — |
| DEC-003 | ACCEPTED | High-contrast Google Gemini Light aesthetic with native Mobile Web App ergonomics | User requirement for clean, non-dark visual consistency, iOS Safari anti-zoom (>=16px inputs), and mobile thumb ergonomics | `src/components/BottomNav.tsx`, `globals.css`, zero dark/light visual clashing | — |
| DEC-004 | ACCEPTED | Reactive client-side bookmarking via `useSyncExternalStore` + `localStorage` | Zero external state libraries (YAGNI), instantaneous reactive updates across idea cards, detail view, and bottom nav | `src/lib/bookmarks.ts`, `src/components/BookmarkButton.tsx` | — |

Use stable IDs such as `DEC-001`. When a decision needs detailed alternatives or
consequences, add a repository-owned ADR and link it from this register. Never
rewrite history silently: mark the old decision superseded and add the new one.

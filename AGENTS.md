# Project Instructions — what-to-ship

## Scope

This file contains repository-specific rules only. Global safety, Git, secret-handling, native-first, and verification policy comes from the user's canonical AI policy.

## Project

- Purpose: Native nextjs baseline. Database=none; auth=none; deploy=none. Selected capabilities are decisions, not operational claims.
- Category: nextjs
- Expected stack: Next.js (App Router, TypeScript)

## Sources of truth

- Accepted product behavior: `PRD.md`; for a specification-suite project it is
  only the entrypoint to canonical `docs/spec/02-PRD.md`
- Sole executable work queue: `TASKS.md`
- Current implementation handoff and semantic review state: `STATUS.md`
- Accepted technical and product constraints: `DECISIONS.md`
- Accepted implementation design when present: `PLAN.md`
- Full architecture decisions when present: `docs/adr/ADR-NNNN-<slug>.md`; `DECISIONS.md` remains the canonical index
- Current release boundary, declared release risk, rollback evidence: `RELEASE.md`
- Post-deploy runtime health contract: `OBSERVABILITY.md`
- Execution evidence and resume projection: `.delivery/`
- Durable implementation notes: `BUILD-LOG.md`
- Architecture and trust boundaries: `ARCHITECTURE.md`

When design and implementation diverge, `ARCHITECTURE.md` records what the code
actually does and therefore outranks a pre-implementation `PLAN.md`. Update the
plan or supersede its decision rather than leaving two current claims.

`STATUS.md` is the only workflow-state authority. `.delivery/current.json` is a projection/evidence index and must never override `STATUS.md`. Do not hand-edit `.delivery/runs/*.jsonl` or `.delivery/releases/*.json`; their integrity is verified by hash chains/self-hashes. Use `delivery-ledger` to start runs, capture an R1-R4 task boundary, record verification, check the final change surface, checkpoint handoffs, finish runs, and snapshot releases. A bounded run may not report `PASS` without a current passing or independently approved boundary result. The canonical behavior and examples live in `~/dotfiles/docs/task-change-boundary.md`.

Delivery metrics are optional immutable sidecars under `.delivery/metrics/`. Use `delivery-benchmark` to record them after a run finishes and to compare model reliability/cost empirically. Benchmark recommendations are advisory only. Do not rewrite routing from a small sample, do not select a cheaper model below the configured reliability floor, and never auto-downgrade R3/R4 work from benchmark output.

Inspect the repository's actual configuration before adding stack-specific rules. Disk and executable behavior override stale documentation. Production readiness must be proven by the repository gates; never infer it from prose alone. `production-gate` also requires `delivery-ledger verify` to pass before a release is production-ready.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Release Manifest — what-to-ship

Release-ID: REL-20260913-01
Base: 30d1113
Environment: production
Declared-Risk: R1
Rollback-Ref: 30d1113
Rollback-Command: vercel rollback
Backup-Proof: NOT_REQUIRED
Status: DEPLOYED
Live-URL: https://whattoship.vercel.app

## Contract

This file defines the current release boundary. It is repository truth for release-specific metadata and MUST describe only the release currently being prepared.

- `Base` is the last deployed/accepted commit and must be an ancestor of `HEAD`.
- `Declared-Risk` is the human/agent-declared release risk (`R0`–`R4`).
- `Rollback-Ref` is the commit to restore if deployment fails; normally it equals `Base`.
- `Rollback-Command` is an explicit supported repository/runbook command, not an assertion such as `true`. Do not put secrets here.
- `Backup-Proof` is `NOT_REQUIRED` unless migration risk requires a structured `backup://`, `snapshot://`, or artifact reference.
- Set `Status: DEPLOYED` confirming production deployment verified at `https://whattoship.vercel.app`.

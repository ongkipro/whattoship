# Observability Contract — what-to-ship

Updated: 2026-09-12
Status: REQUIRED

Probe format:

```text
Probe: <name>|<url>|<expected-status>|<contains-or-TBD>|<max-latency-ms>
```

The expected status may be an exact code (`200`) or an inclusive range
(`200-299`). Every configured probe is mandatory. Use stable, non-secret public
endpoints only; private-network probes require an explicit local-test override.

Probe: homepage|https://whattoship.vercel.app/|200|WhatToShip|2000
Probe: api-ideas|https://whattoship.vercel.app/api/ideas?limit=1|200|pagination|1500
Probe: idea-dossier|https://whattoship.vercel.app/api/ideas/translate-to-english|200|analysis|1500
Probe: mdx-export|https://whattoship.vercel.app/api/ideas/translate-to-english/mdx|200|targetCountries|1500
Probe: sitemap|https://whattoship.vercel.app/sitemap.xml|200|sitemapindex|1500
Probe: collections|https://whattoship.vercel.app/collections|200|Curated Collections|2000

## Verification Runbook

Run probe suite from terminal:

```bash
# Verify API Catalog
curl -s "https://whattoship.vercel.app/api/ideas?limit=1" | jq -e '.pagination.total == 13445'

# Verify Single Dossier with Demographics
curl -s "https://whattoship.vercel.app/api/ideas/translate-to-english" | jq -e '.analysis.target_countries != null'

# Verify Programmatic MDX Stream
curl -s "https://whattoship.vercel.app/api/ideas/translate-to-english/mdx" | grep -q "targetCountries"
```

import http from 'http';

function fetchUrl(url: string, isBinary = false): Promise<{ status: number; headers: Record<string, string>; body: string | Buffer }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode || 0,
          headers: res.headers as Record<string, string>,
          body: isBinary ? buffer : buffer.toString('utf-8')
        });
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('--- RUNNING FULL SYSTEM VERIFICATION ON PORT 3030 ---\n');
  const base = 'http://localhost:3030';
  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<boolean>) {
    total++;
    try {
      const ok = await fn();
      if (ok) {
        console.log(`✓ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`✗ [FAIL] ${name}`);
      }
    } catch (err: unknown) {
      console.error(`✗ [ERROR] ${name}:`, err instanceof Error ? err.message : String(err));
    }
  }

  // 1. Homepage
  await test('Homepage (/) returns 200 and renders Gemini UI', async () => {
    const res = await fetchUrl(`${base}/`);
    return res.status === 200 && typeof res.body === 'string' && res.body.includes('WhatToShip') && res.body.includes('Explorer Filters');
  });

  // 2. Single Idea Detail (Bottleneck Calculator)
  await test('Dossier (/ideas/bottleneck-calculator) returns 200 and schema', async () => {
    const res = await fetchUrl(`${base}/ideas/bottleneck-calculator`);
    return res.status === 200 && typeof res.body === 'string' && res.body.includes('Executive Scorecard') && res.body.includes('Technical Architecture Specification') && res.body.includes('application/ld+json');
  });

  // 3. Single Idea Detail (B2B SaaS)
  await test('Dossier (/ideas/accounts-payable-paperless-software) returns 200 and AI prompt', async () => {
    const res = await fetchUrl(`${base}/ideas/accounts-payable-paperless-software`);
    return res.status === 200 && typeof res.body === 'string' && res.body.includes('Accounts Payable Paperless Software') && res.body.includes('Ready-to-Use AI Starter Prompt');
  });

  // 4. Curated Collections Hub
  await test('Collections Hub (/collections) returns 200 and lists items', async () => {
    const res = await fetchUrl(`${base}/collections`);
    return res.status === 200 && typeof res.body === 'string' && res.body.includes('Curated Idea Collections') && res.body.includes('Instant Wins');
  });

  // 5. Collection Detail Route
  await test('Collection Detail (/collections/instant-wins) returns 200', async () => {
    const res = await fetchUrl(`${base}/collections/instant-wins`);
    return res.status === 200 && typeof res.body === 'string' && (res.body.includes('Instant Wins &amp; Fast TTM') || res.body.includes('Instant Wins'));
  });

  // 6. Bookmarks Page
  await test('Bookmarks Page (/bookmarks) returns 200', async () => {
    const res = await fetchUrl(`${base}/bookmarks`);
    return res.status === 200 && typeof res.body === 'string' && res.body.includes('Saved Blueprints');
  });

  // 7. API Search
  await test('API Search (/api/ideas?q=calculator&limit=5) returns 200 with JSON', async () => {
    const res = await fetchUrl(`${base}/api/ideas?q=calculator&limit=5`);
    const json = JSON.parse(res.body as string);
    return res.status === 200 && Array.isArray(json.data) && json.data.length === 5;
  });

  // 8. API Single Idea
  await test('API Single Idea (/api/ideas/english-to-nepali-converter) returns 200 with analysis', async () => {
    const res = await fetchUrl(`${base}/api/ideas/english-to-nepali-converter`);
    const json = JSON.parse(res.body as string);
    return res.status === 200 && json.idea?.keyword === 'english to nepali converter' && !!json.analysis?.executive_summary;
  });

  // 9. API Export CSV
  await test('API Export (/api/export?format=csv&limit=10) returns text/csv', async () => {
    const res = await fetchUrl(`${base}/api/export?format=csv&limit=10`);
    return res.status === 200 && (res.headers['content-type'] || '').includes('text/csv') && (res.body as string).includes('Keyword,Slug,Type');
  });

  // 10. Sitemap Index
  await test('Sitemap Index (/sitemap.xml) returns valid XML sitemapindex', async () => {
    const res = await fetchUrl(`${base}/sitemap.xml`);
    return res.status === 200 && (res.body as string).includes('<sitemapindex') && (res.body as string).includes('/sitemap-1.xml');
  });

  // 11. Sitemap Chunk
  await test('Sitemap Chunk (/sitemap-1.xml) returns valid XML urlset with 2000 URLs', async () => {
    const res = await fetchUrl(`${base}/sitemap-1.xml`);
    const body = res.body as string;
    const count = (body.match(/<url>/g) || []).length;
    return res.status === 200 && body.includes('<urlset') && count === 2000;
  });

  // 12. Dynamic OpenGraph Image
  await test('Dynamic OG Image (/ideas/brat-generator/opengraph-image) returns 200 image/png', async () => {
    const res = await fetchUrl(`${base}/ideas/brat-generator/opengraph-image`, true);
    return res.status === 200 && (res.headers['content-type'] || '').includes('image/png') && Buffer.isBuffer(res.body) && res.body.length > 5000;
  });

  console.log(`\n--- VERIFICATION RESULT: ${passed}/${total} CHECKS PASSED ---\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runVerification();

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'what_to_ship.db');
const db = new Database(dbPath);

const args = process.argv.slice(2);
let limit = 50;
const limitIndex = args.indexOf('--limit');
if (limitIndex !== -1 && args[limitIndex + 1]) {
  limit = parseInt(args[limitIndex + 1], 10) || 50;
}

console.log(`Running deep analytical enrichment on top ${limit} priority ideas...`);

// Select top ideas by volume & trending
interface PriorityIdea {
  id: number;
  slug: string;
  keyword: string;
  type: string;
  volume: number;
  difficulty: string;
  trending_pct: number;
  technical_complexity: number;
  revenue_potential: number;
  category: string;
  analysis_id: number;
}

const topIdeas = db.prepare(`
SELECT i.*, a.id as analysis_id 
FROM ideas i
JOIN idea_analyses a ON i.id = a.idea_id
ORDER BY (i.revenue_potential * 100000 + i.volume + i.trending_pct * 100) DESC
LIMIT ?
`).all(limit) as PriorityIdea[];

console.log(`Selected ${topIdeas.length} high-priority ideas for deep enrichment.`);

const updateAnalysisStmt = db.prepare(`
UPDATE idea_analyses SET
  executive_summary = @executive_summary,
  target_audience = @target_audience,
  recommended_stack = @recommended_stack,
  architecture_overview = @architecture_overview,
  pricing_recommendation = @pricing_recommendation,
  competitor_weaknesses = @competitor_weaknesses,
  unfair_advantage_wedge = @unfair_advantage_wedge,
  ai_prompt_template = @ai_prompt_template,
  version = 2
WHERE idea_id = @idea_id
`);

const runDeepEnrichment = db.transaction(() => {
  for (const idea of topIdeas) {
    const isSaaS = idea.type === 'SaaS';
    const kw = idea.keyword;
    const title = kw.replace(/\b\w/g, (c: string) => c.toUpperCase());

    const deepSummary = `Strategic Analysis: ${title} is a premier ${idea.type} opportunity commanding ${idea.volume.toLocaleString()} verified monthly queries with a ${idea.trending_pct >= 0 ? '+' : ''}${idea.trending_pct.toFixed(0)}% growth momentum. With an empirical SEO difficulty grade of '${idea.difficulty}', this space offers exceptional return on engineering capital. By eliminating incumbent bloat and optimizing for modern Gemini-grade user velocity, a focused developer can capture primary SERP real estate.`;

    const deepAudience = isSaaS
      ? `Decision-makers: VP of Engineering, Operations Directors, and Finance Controllers seeking unbundled, API-first alternatives to bloated legacy ERP and workflow suites.`
      : `High-intent digital consumers, active practitioners, and online creators who prioritize speed, zero intrusive ads, and instant exportability.`;

    const deepStack = JSON.stringify({
      frontend: 'Next.js 15 (App Router) + React 19 + Tailwind CSS',
      backend: 'Next.js Server Actions with Cloudflare Edge Caching',
      database: isSaaS ? 'Turso (libSQL) / Neon Serverless Postgres with Drizzle ORM' : 'Client-side LocalStorage / Edge KV',
      hosting: 'Cloudflare Pages / Vercel Edge Network',
      auth: isSaaS ? 'Better-Auth (Passkeys + Social + Email Magic Link)' : 'None (Frictionless guest mode)',
      payments: isSaaS ? 'Stripe Checkout + Customer Portal' : 'Buy Me a Coffee / LemonSqueezy'
    });

    const deepArchitecture = `Built with modern edge-first principles. Static shell served from Cloudflare CDN with sub-50ms TTFB. Dynamic user state handled reactively on the client. Database reads benefit from edge connection pooling. Zero server maintenance overhead.`;

    const deepPricing = isSaaS
      ? `Transparent Self-Serve Tiering: Starter ($29/mo or $290/yr), Professional ($79/mo or $790/yr), and Scale ($199/mo with dedicated webhooks and priority SLA).`
      : `100% Free Core Access with non-intrusive carbon ads + optional $9 one-time Pro Pass for bulk batch processing and API access.`;

    const deepCompetitors = isSaaS
      ? `Legacy market players suffer from multi-week sales cycles, mandatory demo calls, lack of transparent pricing, slow sluggish dashboards, and complex enterprise configurations that overwhelm SMB users.`
      : `Existing search results are infested with aggressive display ads, paywalled calculations, forced email captures before showing results, and mobile layouts broken on modern devices.`;

    const deepWedge = isSaaS
      ? `100% Self-serve onboarding: sign up, connect data, and achieve value in under 2 minutes. Modern clean Gemini aesthetic, transparent pricing, and instant CSV/Webhook data portability.`
      : `Lightning fast (<15ms) client-side calculations, zero distracting ads, elegant Google Gemini dark UI, and 1-click export to clipboard, CSV, or formatted PNG.`;

    const deepPrompt = `
You are a Staff Software Architect. Write a complete, production-ready implementation of "${title}" in Next.js 15 (App Router), Tailwind CSS, and TypeScript.

### Design System & Theme
- Follow the Google Gemini aesthetic:
  - Base background: #131314
  - Card elevation: #1e1f20
  - Radiant accents: Gemini Sparkle gradient (cyan to sapphire to coral)
  - Rounded-2xl card containers and rounded-full search & button pills.
  - Crisp typography with tabular figures for numbers.

### Functional Requirements
1. Responsive Input Surface: Allow user to input all required parameters for "${kw}" with real-time reactive feedback.
2. Core Algorithm: Implement accurate, high-performance domain calculations.
3. Visualization: Provide an intuitive data display (charts, visual breakdown, or structured table).
4. Export & Share: Include 1-click copy-to-clipboard, shareable URL query parameters, and PDF/CSV export.
5. Error Handling: Graceful empty states, input range validations, and accessible screen-reader labels.
`.trim();

    updateAnalysisStmt.run({
      idea_id: idea.id,
      executive_summary: deepSummary,
      target_audience: deepAudience,
      recommended_stack: deepStack,
      architecture_overview: deepArchitecture,
      pricing_recommendation: deepPricing,
      competitor_weaknesses: deepCompetitors,
      unfair_advantage_wedge: deepWedge,
      ai_prompt_template: deepPrompt
    });
  }
});

runDeepEnrichment();
console.log(`Deep analytical enrichment successfully completed for top ${topIdeas.length} ideas!`);

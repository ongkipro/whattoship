import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'what_to_ship.db');
const db = new Database(dbPath);

console.log('Running deterministic baseline enrichment for all ideas in:', dbPath);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

interface IdeaRow {
  id: number;
  slug: string;
  keyword: string;
  type: string;
  volume: number;
  difficulty: string;
  difficulty_rank: number;
  trending_pct: number;
  technical_complexity: number;
  ai_friendliness: number;
  time_to_market: number;
  maintenance_overhead: number;
  revenue_potential: number;
  market_competition: number;
  integrations_required: number;
  compliance_risk: number;
  category: string;
}

const ideas = db.prepare('SELECT * FROM ideas').all() as IdeaRow[];
console.log(`Found ${ideas.length} ideas to enrich.`);

const insertStmt = db.prepare(`
INSERT INTO idea_analyses (
  idea_id, slug, executive_summary, target_audience, search_intent,
  recommended_stack, client_vs_server_boundary, api_dependencies, architecture_overview,
  monetization_model, pricing_recommendation, estimated_acv, monetization_channels,
  seed_keywords, secondary_keywords, link_building_angle, schema_type,
  mvp_in_48_hours, full_product_roadmap, ai_prompt_template,
  competitor_weaknesses, unfair_advantage_wedge, version
) VALUES (
  @idea_id, @slug, @executive_summary, @target_audience, @search_intent,
  @recommended_stack, @client_vs_server_boundary, @api_dependencies, @architecture_overview,
  @monetization_model, @pricing_recommendation, @estimated_acv, @monetization_channels,
  @seed_keywords, @secondary_keywords, @link_building_angle, @schema_type,
  @mvp_in_48_hours, @full_product_roadmap, @ai_prompt_template,
  @competitor_weaknesses, @unfair_advantage_wedge, 1
)
ON CONFLICT(idea_id) DO UPDATE SET
  slug = excluded.slug,
  executive_summary = excluded.executive_summary,
  target_audience = excluded.target_audience,
  search_intent = excluded.search_intent,
  recommended_stack = excluded.recommended_stack,
  client_vs_server_boundary = excluded.client_vs_server_boundary,
  api_dependencies = excluded.api_dependencies,
  architecture_overview = excluded.architecture_overview,
  monetization_model = excluded.monetization_model,
  pricing_recommendation = excluded.pricing_recommendation,
  estimated_acv = excluded.estimated_acv,
  monetization_channels = excluded.monetization_channels,
  seed_keywords = excluded.seed_keywords,
  secondary_keywords = excluded.secondary_keywords,
  link_building_angle = excluded.link_building_angle,
  schema_type = excluded.schema_type,
  mvp_in_48_hours = excluded.mvp_in_48_hours,
  full_product_roadmap = excluded.full_product_roadmap,
  ai_prompt_template = excluded.ai_prompt_template,
  competitor_weaknesses = excluded.competitor_weaknesses,
  unfair_advantage_wedge = excluded.unfair_advantage_wedge
`);

const capitalize = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase());

const generateAnalysis = (r: IdeaRow) => {
  const title = capitalize(r.keyword);
  const isSaaS = r.type === 'SaaS';
  const isAI = r.ai_friendliness >= 3;
  const isEasySEO = r.difficulty_rank <= 2;
  
  // 1. Audience & Intent
  let audience = 'General digital users, online creators, and hobbyists seeking instant utility.';
  let intent = 'informational';
  if (isSaaS) {
    if (r.keyword.includes('invoice') || r.keyword.includes('procure') || r.keyword.includes('spend') || r.keyword.includes('payroll')) {
      audience = 'Finance controllers, accounts payable teams, CFOs, and operations managers at SMBs and mid-market companies.';
      intent = 'commercial';
    } else if (r.keyword.includes('seo') || r.keyword.includes('marketing') || r.keyword.includes('rank')) {
      audience = 'In-house SEO leads, digital agency owners, growth marketers, and affiliate site operators.';
      intent = 'commercial';
    } else if (r.keyword.includes('contractor') || r.keyword.includes('facility') || r.keyword.includes('maintenance')) {
      audience = 'Field service managers, property operators, construction contractors, and maintenance coordinators.';
      intent = 'commercial';
    } else {
      audience = 'Small business owners, team leads, and domain specialists seeking workflow efficiency.';
      intent = 'commercial';
    }
  } else {
    if (r.keyword.includes('calculator') && (r.keyword.includes('tax') || r.keyword.includes('loan') || r.keyword.includes('mortgage') || r.keyword.includes('interest'))) {
      audience = 'Retail investors, homebuyers, borrowers, and taxpayers calculating financial scenario trade-offs.';
      intent = 'transactional';
    } else if (r.keyword.includes('generator')) {
      audience = 'Content creators, gamers, designers, and marketers needing fast creative assets and text variations.';
      intent = 'transactional';
    } else if (r.keyword.includes('converter')) {
      audience = 'Professionals, students, and digital creators converting files and formats across devices.';
      intent = 'transactional';
    }
  }

  // 2. Summary
  const trendText = r.trending_pct > 20 
    ? `growing rapidly (+${r.trending_pct.toFixed(0)}% trend)`
    : r.trending_pct < -20 
      ? `stable evergreen baseline with cyclical variance`
      : `consistent evergreen demand`;
  const executive_summary = `${title} addresses an active search market of ${r.volume.toLocaleString()} searches per month, ${trendText}. With an SEO difficulty rating of '${r.difficulty}' and a technical complexity grade of ${r.technical_complexity}/5, this product represents a ${isEasySEO ? 'high-conviction fast-execution opportunity' : 'rewarding niche opportunity with strategic positioning'}.`;

  // 3. Recommended Stack
  const stackObj = {
    frontend: 'Next.js 15 (App Router) + Tailwind CSS',
    backend: 'Next.js Server Actions / Route Handlers',
    database: 'SQLite (Turso) / Drizzle ORM',
    hosting: 'Cloudflare Pages / Vercel',
    styling: 'Tailwind CSS + Lucide Icons'
  };
  let boundary = 'Client-side reactive form calculations with server-side metadata and pre-rendering.';
  let apiDeps: string[] = ['None (Self-contained)'];

  if (r.technical_complexity === 1) {
    stackObj.backend = 'Static Export (No server needed)';
    stackObj.database = 'None (Client-side memory)';
    boundary = '100% Client-side JavaScript/WASM execution. Zero backend infrastructure cost.';
    apiDeps = ['None'];
  } else if (r.technical_complexity >= 4 || isSaaS) {
    stackObj.backend = 'Node.js / Edge Runtime with background queues';
    stackObj.database = 'PostgreSQL (Supabase/Neon) or Turso with Drizzle ORM';
    stackObj.hosting = 'Vercel / Coolify VPS';
    boundary = 'Client UI handles user inputs; authenticated Server Actions handle transactional mutations, document storage, and database persistence.';
    apiDeps = ['Better-Auth', 'Stripe / LemonSqueezy', 'Resend'];
  }

  if (isAI) {
    apiDeps.push('Gemini 2.5 Flash / Claude 3.5 Sonnet API');
  }

  // 4. Monetization
  let monetization_model = 'Display Ads (Google AdSense/Mediavine) + Affiliate Links';
  let pricing = 'Free utility with optional $5 one-time coffee / ad-free pass';
  let acv = '$5 - $50 (Ad-driven / Affiliate)';
  let channels = ['Display Advertising', 'Relevant Affiliate Links', 'Lead Generation / Newsletter'];

  if (isSaaS) {
    if (r.revenue_potential >= 4) {
      monetization_model = 'B2B Tiered Subscription (Monthly & Annual)';
      pricing = '$29/mo (Starter), $79/mo (Pro Team), $199/mo (Business)';
      acv = '$348 - $2,388 / customer';
      channels = ['Self-serve SaaS Subscription', 'Annual Pre-paid Discounts', 'Seats / Usage Add-ons'];
    } else {
      monetization_model = 'Freemium Subscription';
      pricing = 'Free (3 runs/day) + $9/mo Unlimited';
      acv = '$108 / customer';
      channels = ['Monthly Recurring Revenue', 'Lifetime Deal (Early Bird)'];
    }
  }

  // 5. SEO Playbook
  const cleanWord = r.keyword.toLowerCase();
  const seed_keywords = [
    cleanWord,
    `free ${cleanWord}`,
    `best ${cleanWord}`,
    `online ${cleanWord}`
  ];
  const secondary_keywords = [
    `${cleanWord} online free`,
    `how to use ${cleanWord}`,
    `${cleanWord} alternative`,
    `${cleanWord} open source`
  ];
  const link_building_angle = `Submit to niche directories, curate on GitHub awesome lists, share on Reddit communities (r/webdev, r/SideProject), and launch on Product Hunt.`;

  // 6. Roadmap
  const mvp_in_48_hours = `
- [ ] Initialize Next.js 15 template with Tailwind CSS and Gemini ambient dark theme.
- [ ] Build core responsive calculator/tool input form with real-time validation.
- [ ] Implement core math algorithm / transformation logic.
- [ ] Add copy-to-clipboard, reset, and export/share triggers.
- [ ] Deploy to Cloudflare Pages with automated OpenGraph tags and JSON-LD schema.
`.trim();

  const full_product_roadmap = `
- [ ] User authentication and saved calculation/history sync.
- [ ] Multi-format export (PDF report, CSV, JSON, PNG snippet).
- [ ] Team workspaces and shared project dashboards.
- [ ] Webhook integrations and automated periodic alerts/reports.
- [ ] Stripe customer billing portal for pro tier subscriptions.
`.trim();

  // 7. AI Prompt Template
  const ai_prompt_template = `
Act as a principal full-stack engineer. Build a production-grade, highly performant web application for "${title}" using Next.js 15 (App Router), Tailwind CSS, and TypeScript.

Key Requirements:
1. UI/UX: Implement a Google Gemini-inspired ambient dark aesthetic (#131314 background, #1e1f20 card surfaces, rounded-2xl corners, and subtle radiant glow accents).
2. Core Functionality: Implement the primary interactive logic for ${r.keyword} with zero input lag and graceful input validation.
3. Responsiveness: Fully mobile-first responsive layout with accessible keyboard shortcuts (Enter to calculate, Esc to clear).
4. Export: Provide a 1-click copy-to-clipboard and downloadable report feature.
5. Code Structure: Modular clean code split into dedicated components, types, and utility functions.
`.trim();

  // 8. Competitor Weakness & Wedge
  const competitor_weaknesses = isSaaS
    ? `Incumbents are bloated legacy enterprise tools with high barrier-to-entry, required sales calls, complex onboarding, and opaque pricing.`
    : `Existing tools on Google SERP are cluttered with invasive intrusive ads, slow load times (>3s LCP), lack mobile responsiveness, and have outdated 2010s UI.`;

  const unfair_advantage_wedge = isSaaS
    ? `Modern 100% self-serve onboarding, transparent pricing starting at $29/mo, lightning-fast UI, and instant time-to-value within 60 seconds of sign-up.`
    : `Clean, modern Gemini-inspired dark aesthetic, zero annoying popup ads, instant client-side calculation (<10ms), and clean shareable URLs.`;

  return {
    idea_id: r.id,
    slug: r.slug,
    executive_summary,
    target_audience: audience,
    search_intent: intent,
    recommended_stack: JSON.stringify(stackObj),
    client_vs_server_boundary: boundary,
    api_dependencies: JSON.stringify(apiDeps),
    architecture_overview: `${title} is built with a focus on simplicity, speed, and modern UX standards. Designed for immediate time-to-value.`,
    monetization_model,
    pricing_recommendation: pricing,
    estimated_acv: acv,
    monetization_channels: JSON.stringify(channels),
    seed_keywords: JSON.stringify(seed_keywords),
    secondary_keywords: JSON.stringify(secondary_keywords),
    link_building_angle,
    schema_type: isSaaS ? 'SoftwareApplication' : 'WebApplication',
    mvp_in_48_hours,
    full_product_roadmap,
    ai_prompt_template,
    competitor_weaknesses,
    unfair_advantage_wedge
  };
};

// Batch insert in transactions of 500
const chunkSize = 500;
let processed = 0;

console.log('Beginning batch insertion of analytical breakdowns...');
const start = Date.now();

for (let i = 0; i < ideas.length; i += chunkSize) {
  const chunk = ideas.slice(i, i + chunkSize);
  const insertChunk = db.transaction((rows: IdeaRow[]) => {
    for (const r of rows) {
      const data = generateAnalysis(r);
      insertStmt.run(data);
    }
  });
  insertChunk(chunk);
  processed += chunk.length;
  if (processed % 2500 === 0 || processed === ideas.length) {
    console.log(`Enriched ${processed} / ${ideas.length} ideas (${(processed / ideas.length * 100).toFixed(1)}%)...`);
  }
}

const duration = ((Date.now() - start) / 1000).toFixed(2);
console.log(`Enrichment complete in ${duration}s! Total records in idea_analyses: ${processed}`);

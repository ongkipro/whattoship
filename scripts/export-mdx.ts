import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { IdeaRecord, IdeaAnalysisRaw } from '../src/types';

const dbPath = path.join(process.cwd(), 'data', 'what_to_ship.db');
const db = new Database(dbPath);

console.log('=== Exporting Programmatic MDX Dossiers ===');

const outDir = path.join(process.cwd(), 'content', 'dossiers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const args = process.argv.slice(2);
const limit = parseInt(args[0], 10) || 50;

const ideas = db.prepare(`
  SELECT 
    i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
    i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
    i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
    i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
    i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
    i.compliance_risk as complianceRisk, i.category
  FROM ideas i
  ORDER BY volume DESC
  LIMIT ?
`).all(limit) as IdeaRecord[];

console.log(`Exporting top ${ideas.length} ideas to ${outDir}...`);

let exported = 0;
for (const idea of ideas) {
  const analysis = db.prepare('SELECT * FROM idea_analyses WHERE idea_id = ?').get(idea.id) as IdeaAnalysisRaw | undefined;
  if (!analysis) continue;

  const title = idea.keyword.replace(/\b\w/g, c => c.toUpperCase());
  const stack = JSON.parse(analysis.recommended_stack || '{}');
  const apiDeps = JSON.parse(analysis.api_dependencies || '[]');
  const channels = JSON.parse(analysis.monetization_channels || '[]');
  const seedKw = JSON.parse(analysis.seed_keywords || '[]');
  const secKw = JSON.parse(analysis.secondary_keywords || '[]');

  const content = `---
title: "${title}"
slug: "${idea.slug}"
keyword: "${idea.keyword}"
category: "${idea.category}"
type: "${idea.type}"
monthlyVolume: ${idea.volume}
difficulty: "${idea.difficulty}"
difficultyRank: ${idea.difficultyRank}
trendingPct: ${idea.trendingPct}
revenuePotential: ${idea.revenuePotential}
technicalComplexity: ${idea.technicalComplexity}
aiFriendliness: ${idea.aiFriendliness}
timeToMarket: ${idea.timeToMarket}
targetCountries: "${analysis.target_countries}"
buyerPersona: "${analysis.buyer_persona}"
demographics: "${analysis.demographics}"
searchIntent: "${analysis.search_intent}"
schemaType: "${analysis.schema_type}"
createdAt: "2026-09-12"
---

# ${title} — Product Execution Dossier

## 1. Executive Summary
${analysis.executive_summary}

---

## 2. Market Demographics & Buyer Persona
- **Target Geography**: ${analysis.target_countries}
- **Buyer Persona**: ${analysis.buyer_persona}
- **Demographic Attributes**: ${analysis.demographics}
- **Search Intent**: \`${analysis.search_intent.toUpperCase()}\`
- **Estimated Monthly Search Volume**: ${idea.volume.toLocaleString()} / month (${idea.trendingPct >= 0 ? '+' : ''}${idea.trendingPct}% trend)

---

## 3. Technical Architecture Specification
- **Frontend Framework**: ${stack.frontend || 'Next.js 15 App Router'}
- **Backend Runtime**: ${stack.backend || 'Next.js Server Actions'}
- **Database & Persistence**: ${stack.database || 'SQLite / Turso + Drizzle ORM'}
- **Target Hosting**: ${stack.hosting || 'Cloudflare Pages / Vercel'}
- **Client vs Server Boundary**: ${analysis.client_vs_server_boundary}

### API Dependencies
${apiDeps.map((dep: string) => `- ${dep}`).join('\n')}

---

## 4. Monetization & Business Blueprint
- **Primary Model**: ${analysis.monetization_model}
- **Pricing Strategy**: ${analysis.pricing_recommendation}
- **Estimated ACV**: ${analysis.estimated_acv}

### Revenue Channels
${channels.map((ch: string) => `- ${ch}`).join('\n')}

---

## 5. Competitive Moat & Unfair Advantage
- **Incumbent Weaknesses**: ${analysis.competitor_weaknesses}
- **Defensible Wedge**: ${analysis.unfair_advantage_wedge}

---

## 6. Phased Execution Roadmap

### 48-Hour Rapid MVP Checklist
${analysis.mvp_in_48_hours}

### Full Product Launch Milestones
${analysis.full_product_roadmap}

---

## 7. Programmatic SEO Keywords
- **Seed Keywords**: ${seedKw.join(', ')}
- **Long-tail Variations**: ${secKw.join(', ')}
- **Link Building & Distribution**: ${analysis.link_building_angle}

---

## 8. AI Implementation Starter Prompt
\`\`\`markdown
${analysis.ai_prompt_template}
\`\`\`
`;

  fs.writeFileSync(path.join(outDir, `${idea.slug}.mdx`), content, 'utf-8');
  exported++;
}

console.log(`Successfully exported ${exported} MDX files to content/dossiers/`);

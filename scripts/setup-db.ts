import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'what_to_ship.db');
const db = new Database(dbPath);

console.log('Running database setup and schema migration on:', dbPath);

db.pragma('journal_mode = WAL');

// 1. Check if slug column exists on ideas table
const tableInfo = db.prepare("PRAGMA table_info(ideas)").all() as Array<{ name: string }>;
const hasSlug = tableInfo.some(c => c.name === 'slug');

if (!hasSlug) {
  console.log('Adding slug column to ideas table...');
  db.prepare("ALTER TABLE ideas ADD COLUMN slug TEXT").run();
}

// 2. Generate clean URL slugs for all rows
console.log('Generating URL-safe slugs for all ideas...');
const rows = db.prepare("SELECT id, keyword FROM ideas").all() as Array<{ id: number; keyword: string }>;

const slugCount = new Map<string, number>();
const updateStmt = db.prepare("UPDATE ideas SET slug = ? WHERE id = ?");

const generateSlug = (kw: string): string => {
  let s = kw.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!s) s = 'idea';
  
  const count = slugCount.get(s) || 0;
  slugCount.set(s, count + 1);
  if (count > 0) {
    return `${s}-${count + 1}`;
  }
  return s;
};

const updateAll = db.transaction(() => {
  for (const r of rows) {
    const slug = generateSlug(r.keyword);
    updateStmt.run(slug, r.id);
  }
});

updateAll();
console.log(`Generated slugs for ${rows.length} ideas.`);

// Add unique index on slug
db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_ideas_slug ON ideas(slug)").run();

// 3. Create idea_analyses table
db.prepare(`
CREATE TABLE IF NOT EXISTS idea_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL UNIQUE REFERENCES ideas(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  executive_summary TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  search_intent TEXT NOT NULL,
  recommended_stack TEXT NOT NULL,
  client_vs_server_boundary TEXT NOT NULL,
  api_dependencies TEXT NOT NULL,
  architecture_overview TEXT NOT NULL,
  monetization_model TEXT NOT NULL,
  pricing_recommendation TEXT NOT NULL,
  estimated_acv TEXT NOT NULL,
  monetization_channels TEXT NOT NULL,
  seed_keywords TEXT NOT NULL,
  secondary_keywords TEXT NOT NULL,
  link_building_angle TEXT NOT NULL,
  schema_type TEXT NOT NULL DEFAULT 'SoftwareApplication',
  mvp_in_48_hours TEXT NOT NULL,
  full_product_roadmap TEXT NOT NULL,
  ai_prompt_template TEXT NOT NULL,
  competitor_weaknesses TEXT NOT NULL,
  unfair_advantage_wedge TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1
)
`).run();

db.prepare("CREATE INDEX IF NOT EXISTS idx_analysis_idea_id ON idea_analyses(idea_id)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_analysis_slug ON idea_analyses(slug)").run();
console.log('Verified idea_analyses table.');

// 4. Create collections table
db.prepare(`
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Sparkles',
  filter_criteria TEXT NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
)
`).run();

db.prepare("CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug)").run();

// 5. Seed Curated Collections
const defaultCollections = [
  {
    slug: 'instant-wins',
    title: 'Instant Wins & Fast TTM',
    tagline: 'High volume tools you can code and ship in under 48 hours',
    description: 'Curated free online utilities and calculators with low technical complexity (1-2), fast time-to-market, and easy SEO competition.',
    icon_name: 'Zap',
    filter_criteria: JSON.stringify({ difficulty_rank_max: 2, tech_max: 2, ttm_max: 2, sort: 'volume' }),
    sort_order: 1,
  },
  {
    slug: 'high-yield-micro-saas',
    title: 'High-Yield B2B Micro-SaaS',
    tagline: 'High revenue potential B2B subscriptions with low churn',
    description: 'Software ideas with top monetization scores (4-5), high ACV potential ($29-$199/mo), and realistic organic search competition.',
    icon_name: 'TrendingUp',
    filter_criteria: JSON.stringify({ type: 'SaaS', min_rev: 4, difficulty_rank_max: 3, sort: 'volume' }),
    sort_order: 2,
  },
  {
    slug: 'breakout-trends',
    title: 'Breakout Viral Trends',
    tagline: 'Exploding search volume with +100% to +800% growth',
    description: 'Fast-rising software and utility search queries experiencing massive momentum. Capture early search dominance before incumbents.',
    icon_name: 'Flame',
    filter_criteria: JSON.stringify({ min_trending: 100, sort: 'trending' }),
    sort_order: 3,
  },
  {
    slug: 'ai-native-utilities',
    title: 'AI-Native Utilities & Wrappers',
    tagline: 'High perceived value tools powered by LLMs and generative APIs',
    description: 'Keywords and digital products where modern AI models provide 10x value with minimal custom backend logic.',
    icon_name: 'Sparkles',
    filter_criteria: JSON.stringify({ min_ai: 4, sort: 'volume' }),
    sort_order: 4,
  },
  {
    slug: 'financial-calculators',
    title: 'High-RPM Financial Calculators',
    tagline: 'High-intent calculators with premium ad rates and fintech affiliate potential',
    description: 'Investment, tax, loan, and retirement calculators generating high-RPM impressions and high-value lead conversions.',
    icon_name: 'DollarSign',
    filter_criteria: JSON.stringify({ category: 'Calculator', search: 'tax,interest,loan,mortgage,deposit,salary,swp', sort: 'volume' }),
    sort_order: 5,
  },
  {
    slug: 'file-converters',
    title: 'High-Volume File & Media Converters',
    tagline: 'Evergreen daily utility tools with massive organic demand',
    description: 'Document, image, audio, and video converters that can run directly in the browser via WebAssembly or lightweight edge workers.',
    icon_name: 'FileText',
    filter_criteria: JSON.stringify({ category: 'Converter', sort: 'volume' }),
    sort_order: 6,
  },
];

const insertCollectionStmt = db.prepare(`
INSERT INTO collections (slug, title, tagline, description, icon_name, filter_criteria, item_count, sort_order)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  tagline = excluded.tagline,
  description = excluded.description,
  icon_name = excluded.icon_name,
  filter_criteria = excluded.filter_criteria,
  sort_order = excluded.sort_order
`);

for (const c of defaultCollections) {
  insertCollectionStmt.run(c.slug, c.title, c.tagline, c.description, c.icon_name, c.filter_criteria, 0, c.sort_order);
}
console.log('Seeded curated collections.');

// 6. Setup SQLite FTS5 Virtual Table for Instant Full-Text Search
console.log('Configuring FTS5 virtual search index...');
db.prepare("DROP TABLE IF EXISTS ideas_fts").run();
db.prepare(`
CREATE VIRTUAL TABLE ideas_fts USING fts5(
  keyword,
  category,
  type,
  content='ideas',
  content_rowid='id'
)
`).run();

// Populate FTS5 table
db.prepare(`
INSERT INTO ideas_fts(rowid, keyword, category, type)
SELECT id, keyword, category, type FROM ideas
`).run();

const ftsCount = db.prepare("SELECT count(*) as count FROM ideas_fts").get() as { count: number };
console.log(`FTS5 virtual index populated with ${ftsCount.count} entries.`);

console.log('Database setup and migration successfully finished!');

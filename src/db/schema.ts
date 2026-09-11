import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const ideas = sqliteTable('ideas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  keyword: text('keyword').notNull(),
  type: text('type').notNull(), // 'Online Tool' | 'SaaS'
  volume: integer('volume').notNull().default(0),
  difficulty: text('difficulty').notNull(),
  difficultyRank: integer('difficulty_rank').notNull().default(3), // 1: Extremely Easy .. 5: Extremely Hard
  trendingPct: real('trending_pct').notNull().default(0.0),
  technicalComplexity: integer('technical_complexity').notNull().default(1), // 1-5
  aiFriendliness: integer('ai_friendliness').notNull().default(1), // 1-5
  timeToMarket: integer('time_to_market').notNull().default(1), // 1-5
  maintenanceOverhead: integer('maintenance_overhead').notNull().default(1), // 1-5
  revenuePotential: integer('revenue_potential').notNull().default(1), // 1-5
  marketCompetition: integer('market_competition').notNull().default(1), // 1-5
  integrationsRequired: integer('integrations_required').notNull().default(1), // 1-5
  complianceRisk: integer('compliance_risk').notNull().default(1), // 1-5
  category: text('category').notNull().default('General / Other'),
}, (table) => ({
  slugIdx: index('idx_ideas_slug').on(table.slug),
  typeIdx: index('idx_ideas_type').on(table.type),
  volumeIdx: index('idx_ideas_volume').on(table.volume),
  diffRankIdx: index('idx_ideas_diff_rank').on(table.difficultyRank),
  trendIdx: index('idx_ideas_trend').on(table.trendingPct),
  catIdx: index('idx_ideas_category').on(table.category),
  revIdx: index('idx_ideas_revenue').on(table.revenuePotential),
  techIdx: index('idx_ideas_tech').on(table.technicalComplexity),
}));

export const ideaAnalyses = sqliteTable('idea_analyses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ideaId: integer('idea_id').notNull().references(() => ideas.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  
  // Executive Summary & Audience
  executiveSummary: text('executive_summary').notNull(),
  targetAudience: text('target_audience').notNull(),
  targetCountries: text('target_countries').notNull().default('Global (US, UK, CA, AU priority)'),
  buyerPersona: text('buyer_persona').notNull().default('Digital solopreneurs, remote professionals & SMB operators'),
  demographics: text('demographics').notNull().default('Age 22-45, tech-literate, desktop & mobile web users'),
  searchIntent: text('search_intent').notNull(), // informational | transactional | commercial
  
  // Technical Architecture Specification
  recommendedStack: text('recommended_stack').notNull(), // JSON string: { frontend, backend, database, hosting }
  clientVsServerBoundary: text('client_vs_server_boundary').notNull(),
  apiDependencies: text('api_dependencies').notNull(), // JSON string array
  architectureOverview: text('architecture_overview').notNull(),
  
  // Business & Monetization Blueprint
  monetizationModel: text('monetization_model').notNull(),
  pricingRecommendation: text('pricing_recommendation').notNull(),
  estimatedAcv: text('estimated_acv').notNull(),
  monetizationChannels: text('monetization_channels').notNull(), // JSON string array
  
  // SEO & Growth Playbook
  seedKeywords: text('seed_keywords').notNull(), // JSON string array
  secondaryKeywords: text('secondary_keywords').notNull(), // JSON string array
  linkBuildingAngle: text('link_building_angle').notNull(),
  schemaType: text('schema_type').notNull().default('SoftwareApplication'),
  
  // Execution Roadmap & Milestones
  mvpIn48Hours: text('mvp_in_48_hours').notNull(), // Markdown checklist
  fullProductRoadmap: text('full_product_roadmap').notNull(), // Markdown checklist
  
  // Ready-to-use AI Prompt Template
  aiPromptTemplate: text('ai_prompt_template').notNull(),
  
  // Competitor & Differentiation Wedge
  competitorWeaknesses: text('competitor_weaknesses').notNull(),
  unfairAdvantageWedge: text('unfair_advantage_wedge').notNull(),
  
  version: integer('version').notNull().default(1),
}, (table) => ({
  ideaIdIdx: index('idx_analysis_idea_id').on(table.ideaId),
  slugIdx: index('idx_analysis_slug').on(table.slug),
}));

export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('Sparkles'),
  filterCriteria: text('filter_criteria').notNull(), // JSON string
  itemCount: integer('item_count').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  slugIdx: index('idx_collections_slug').on(table.slug),
}));

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
export type IdeaAnalysis = typeof ideaAnalyses.$inferSelect;
export type NewIdeaAnalysis = typeof ideaAnalyses.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

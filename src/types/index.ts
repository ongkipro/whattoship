export interface IdeaRecord {
  id: number;
  slug: string;
  keyword: string;
  type: string;
  volume: number;
  difficulty: string;
  difficultyRank: number;
  trendingPct: number;
  technicalComplexity: number;
  aiFriendliness: number;
  timeToMarket: number;
  maintenanceOverhead: number;
  revenuePotential: number;
  marketCompetition: number;
  integrationsRequired: number;
  complianceRisk: number;
  category: string;
}

export interface IdeaAnalysisRaw {
  id: number;
  idea_id: number;
  slug: string;
  executive_summary: string;
  target_audience: string;
  target_countries: string;
  buyer_persona: string;
  demographics: string;
  search_intent: string;
  recommended_stack: string;
  client_vs_server_boundary: string;
  api_dependencies: string;
  architecture_overview: string;
  monetization_model: string;
  pricing_recommendation: string;
  estimated_acv: string;
  monetization_channels: string;
  seed_keywords: string;
  secondary_keywords: string;
  link_building_angle: string;
  schema_type: string;
  mvp_in_48_hours: string;
  full_product_roadmap: string;
  ai_prompt_template: string;
  competitor_weaknesses: string;
  unfair_advantage_wedge: string;
  version: number;
}

export interface CollectionRecord {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon_name: string;
  filter_criteria: string;
  item_count: number;
  sort_order: number;
}

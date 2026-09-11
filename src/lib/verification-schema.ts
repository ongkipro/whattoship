export interface VerifiedDossier {
  ideaId: number;
  slug: string;
  keyword: string;
  category: string;
  type: 'Online Tool' | 'SaaS';
  
  // 1. Search Volume & Geographic Distribution
  marketVolume: {
    monthlySearches: number;
    trendingGrowthPct: number;
    difficultyRating: string;
    difficultyScore: number;
    targetCountries: string;
    demographics: string;
  };

  // 2. Buyer Persona & Target Audience
  marketAudience: {
    targetPersona: string;
    targetAudience: string;
    searchIntent: 'informational' | 'transactional' | 'commercial';
  };

  // 3. Exact Tech Stack & Unit Economics
  techArchitecture: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    clientServerBoundary: string;
    apiDependencies: string[];
    technicalComplexityScore: number; // 1-5
  };

  // 4. Monetization & Business Blueprint
  monetization: {
    model: string;
    pricingRecommendation: string;
    estimatedAcv: string;
    revenueChannels: string[];
    revenuePotentialScore: number; // 1-5
  };

  // 5. Competitive Moat & Wedge
  competitorIntelligence: {
    incumbentWeaknesses: string;
    unfairAdvantageWedge: string;
    marketCompetitionScore: number; // 1-5
  };

  // 6. Actionable Roadmaps
  execution: {
    mvpIn48Hours: string;
    fullProductRoadmap: string;
    timeToMarketWeeks: number;
  };

  // 7. Prompt Engineering
  aiStarterPrompt: string;

  // 8. Programmatic SEO & Acquisition
  acquisition: {
    seedKeywords: string[];
    secondaryKeywords: string[];
    linkBuildingAngle: string;
    schemaType: string;
  };
}

export function validateVerifiedDossier(d: Partial<VerifiedDossier>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!d.slug) errors.push('Missing slug');
  if (!d.keyword) errors.push('Missing keyword');
  if (!d.marketVolume?.monthlySearches || d.marketVolume.monthlySearches < 0) errors.push('Invalid monthlySearches');
  if (!d.marketAudience?.targetPersona) errors.push('Missing targetPersona');
  if (!d.marketAudience?.targetAudience) errors.push('Missing targetAudience');
  if (!d.marketVolume?.targetCountries) errors.push('Missing targetCountries');
  if (!d.techArchitecture?.frontend) errors.push('Missing frontend stack');
  if (!d.techArchitecture?.backend) errors.push('Missing backend stack');
  if (!d.monetization?.model) errors.push('Missing monetization model');
  if (!d.competitorIntelligence?.unfairAdvantageWedge) errors.push('Missing unfairAdvantageWedge');
  if (!d.execution?.mvpIn48Hours) errors.push('Missing mvpIn48Hours');
  if (!d.aiStarterPrompt) errors.push('Missing aiStarterPrompt');

  return {
    valid: errors.length === 0,
    errors
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/db';
import { IdeaRecord, IdeaAnalysisRaw } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const ideaStmt = sqlite.prepare(`
      SELECT 
        i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
        i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
        i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
        i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
        i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
        i.compliance_risk as complianceRisk, i.category
      FROM ideas i
      WHERE i.slug = ?
    `);

    const idea = ideaStmt.get(slug) as IdeaRecord | undefined;

    if (!idea) {
      // Return 404 with trending alternatives
      const alternatives = sqlite.prepare(`
        SELECT slug, keyword, type, volume, difficulty, trending_pct as trendingPct
        FROM ideas
        ORDER BY trending_pct DESC, volume DESC
        LIMIT 4
      `).all();

      return NextResponse.json(
        {
          error: 'Idea not found',
          alternatives
        },
        { status: 404 }
      );
    }

    // Fetch analysis
    const analysisStmt = sqlite.prepare(`
      SELECT * FROM idea_analyses WHERE idea_id = ?
    `);
    const analysisRaw = analysisStmt.get(idea.id) as IdeaAnalysisRaw | undefined;

    // Parse JSON fields in analysis
    let analysis = null;
    if (analysisRaw) {
      analysis = {
        ...analysisRaw,
        recommendedStack: JSON.parse(analysisRaw.recommended_stack || '{}'),
        apiDependencies: JSON.parse(analysisRaw.api_dependencies || '[]'),
        monetizationChannels: JSON.parse(analysisRaw.monetization_channels || '[]'),
        seedKeywords: JSON.parse(analysisRaw.seed_keywords || '[]'),
        secondaryKeywords: JSON.parse(analysisRaw.secondary_keywords || '[]'),
      };
    }

    // Fetch 4 related ideas in same category
    const relatedStmt = sqlite.prepare(`
      SELECT slug, keyword, type, volume, difficulty, trending_pct as trendingPct,
             revenue_potential as revenuePotential, technical_complexity as technicalComplexity
      FROM ideas
      WHERE category = ? AND id != ?
      ORDER BY volume DESC
      LIMIT 4
    `);
    const related = relatedStmt.all(idea.category, idea.id);

    return NextResponse.json({
      idea,
      analysis,
      related
    });
  } catch (error: unknown) {
    console.error('Error in /api/ideas/[slug]:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

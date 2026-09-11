import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q')?.trim() || '';
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || '';
  const minVol = parseInt(searchParams.get('min_vol') || '0', 10);
  const maxVol = searchParams.get('max_vol') ? parseInt(searchParams.get('max_vol')!, 10) : null;
  const difficulty = searchParams.get('difficulty') || '';
  const easyOnly = searchParams.get('easy_only') === 'true';
  const maxTech = searchParams.get('max_tech') ? parseInt(searchParams.get('max_tech')!, 10) : null;
  const minRev = searchParams.get('min_rev') ? parseInt(searchParams.get('min_rev')!, 10) : null;
  const minAi = searchParams.get('min_ai') ? parseInt(searchParams.get('min_ai')!, 10) : null;
  const maxRisk = searchParams.get('max_risk') ? parseInt(searchParams.get('max_risk')!, 10) : null;
  const trending = searchParams.get('trending') ? parseFloat(searchParams.get('trending')!) : null;
  const sort = searchParams.get('sort') || 'volume';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));
  const offset = (page - 1) * limit;

  try {
    const whereClauses: string[] = ['1=1'];
    const params: (string | number)[] = [];

    // FTS5 Search or Substring Search
    if (q) {
      // Use clean alphanumeric query for FTS5
      const cleanQ = q.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
      if (cleanQ) {
        // Match prefix tokens: token*
        const ftsTokens = cleanQ.split(/\s+/).map(t => `"${t}"*`).join(' AND ');
        whereClauses.push(`i.id IN (SELECT rowid FROM ideas_fts WHERE ideas_fts MATCH ?)`);
        params.push(ftsTokens);
      }
    }

    if (type && type !== 'all') {
      whereClauses.push('i.type = ?');
      params.push(type);
    }

    if (category) {
      whereClauses.push('i.category = ?');
      params.push(category);
    }

    if (minVol > 0) {
      whereClauses.push('i.volume >= ?');
      params.push(minVol);
    }

    if (maxVol !== null) {
      whereClauses.push('i.volume <= ?');
      params.push(maxVol);
    }

    if (difficulty) {
      whereClauses.push('i.difficulty = ?');
      params.push(difficulty);
    } else if (easyOnly) {
      whereClauses.push('i.difficulty_rank <= 2');
    }

    if (maxTech !== null) {
      whereClauses.push('i.technical_complexity <= ?');
      params.push(maxTech);
    }

    if (minRev !== null) {
      whereClauses.push('i.revenue_potential >= ?');
      params.push(minRev);
    }

    if (minAi !== null) {
      whereClauses.push('i.ai_friendliness >= ?');
      params.push(minAi);
    }

    if (maxRisk !== null) {
      whereClauses.push('i.compliance_risk <= ?');
      params.push(maxRisk);
    }

    if (trending !== null) {
      whereClauses.push('i.trending_pct >= ?');
      params.push(trending);
    }

    const whereSql = whereClauses.join(' AND ');

    // Count query
    const countStmt = sqlite.prepare(`SELECT count(*) as total FROM ideas i WHERE ${whereSql}`);
    const { total } = countStmt.get(...params) as { total: number };

    // Sort mapping
    let orderBy = 'i.volume DESC';
    if (sort === 'trending') orderBy = 'i.trending_pct DESC';
    else if (sort === 'revenue') orderBy = 'i.revenue_potential DESC, i.volume DESC';
    else if (sort === 'tech') orderBy = 'i.technical_complexity ASC, i.volume DESC';
    else if (sort === 'difficulty') orderBy = 'i.difficulty_rank ASC, i.volume DESC';

    // Data query
    const dataStmt = sqlite.prepare(`
      SELECT 
        i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
        i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
        i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
        i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
        i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
        i.compliance_risk as complianceRisk, i.category
      FROM ideas i
      WHERE ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `);

    const data = dataStmt.all(...params, limit, offset);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: unknown) {
    console.error('Error in /api/ideas:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

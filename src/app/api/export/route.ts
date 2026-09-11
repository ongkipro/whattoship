import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const format = searchParams.get('format') || 'csv';
  const q = searchParams.get('q')?.trim() || '';
  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category') || '';
  const minVol = parseInt(searchParams.get('min_vol') || '0', 10);
  const difficulty = searchParams.get('difficulty') || '';
  const easyOnly = searchParams.get('easy_only') === 'true';
  const maxTech = searchParams.get('max_tech') ? parseInt(searchParams.get('max_tech')!, 10) : null;
  const minRev = searchParams.get('min_rev') ? parseInt(searchParams.get('min_rev')!, 10) : null;
  const trending = searchParams.get('trending') ? parseFloat(searchParams.get('trending')!) : null;
  const limit = Math.min(5000, Math.max(1, parseInt(searchParams.get('limit') || '1000', 10)));

  try {
    const whereClauses: string[] = ['1=1'];
    const params: (string | number)[] = [];

    if (q) {
      const cleanQ = q.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
      if (cleanQ) {
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

    if (trending !== null) {
      whereClauses.push('i.trending_pct >= ?');
      params.push(trending);
    }

    const whereSql = whereClauses.join(' AND ');

    const rowsStmt = sqlite.prepare(`
      SELECT 
        i.keyword, i.slug, i.type, i.category, i.volume, i.difficulty,
        i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
        i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
        i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
        i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
        i.compliance_risk as complianceRisk
      FROM ideas i
      WHERE ${whereSql}
      ORDER BY i.volume DESC
      LIMIT ?
    `);

    const rows = rowsStmt.all(...params, limit) as Array<{
      keyword: string;
      slug: string;
      type: string;
      category: string;
      volume: number;
      difficulty: string;
      trendingPct: number;
      technicalComplexity: number;
      aiFriendliness: number;
      timeToMarket: number;
      maintenanceOverhead: number;
      revenuePotential: number;
      marketCompetition: number;
      integrationsRequired: number;
      complianceRisk: number;
    }>;

    if (format === 'json') {
      return new NextResponse(JSON.stringify(rows, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'attachment; filename="what-to-ship-export.json"'
        }
      });
    }

    // CSV Format
    const headers = [
      'Keyword', 'Slug', 'Type', 'Category', 'Volume', 'Difficulty',
      'Trending %', 'Technical Complexity', 'AI Friendliness', 'Time-to-Market',
      'Maintenance', 'Revenue Potential', 'Competition', 'Integrations', 'Compliance Risk'
    ];

    const escapeCsv = (val: string | number | null | undefined) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map(r => [
        escapeCsv(r.keyword),
        escapeCsv(r.slug),
        escapeCsv(r.type),
        escapeCsv(r.category),
        r.volume,
        escapeCsv(r.difficulty),
        `${r.trendingPct}%`,
        r.technicalComplexity,
        r.aiFriendliness,
        r.timeToMarket,
        r.maintenanceOverhead,
        r.revenuePotential,
        r.marketCompetition,
        r.integrationsRequired,
        r.complianceRisk
      ].join(','))
    ];

    return new NextResponse(csvLines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="what-to-ship-export.csv"'
      }
    });
  } catch (error: unknown) {
    console.error('Error in /api/export:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

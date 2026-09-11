import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sqlite } from '@/db';
import Navbar from '@/components/Navbar';
import IdeaCard, { IdeaItem } from '@/components/IdeaCard';
import { CollectionRecord } from '@/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const list = sqlite.prepare('SELECT slug FROM collections').all() as Array<{ slug: string }>;
  return list.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = sqlite.prepare('SELECT title, tagline, description FROM collections WHERE slug = ?').get(slug) as Pick<CollectionRecord, 'title' | 'tagline' | 'description'> | undefined;

  if (!col) return { title: 'Collection Not Found | WhatToShip' };

  return {
    title: `${col.title} — Curated Opportunities | WhatToShip`,
    description: `${col.description} Explore verified search volume, SEO difficulty, and architecture blueprints.`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;

  const col = sqlite.prepare('SELECT * FROM collections WHERE slug = ?').get(slug) as CollectionRecord | undefined;
  if (!col) notFound();

  const criteria = JSON.parse(col.filter_criteria || '{}');
  const where: string[] = ['1=1'];
  const queryParams: (string | number)[] = [];

  if (criteria.type) {
    where.push('i.type = ?');
    queryParams.push(criteria.type);
  }
  if (criteria.category) {
    where.push('i.category = ?');
    queryParams.push(criteria.category);
  }
  if (criteria.difficulty_rank_max) {
    where.push('i.difficulty_rank <= ?');
    queryParams.push(criteria.difficulty_rank_max);
  }
  if (criteria.tech_max) {
    where.push('i.technical_complexity <= ?');
    queryParams.push(criteria.tech_max);
  }
  if (criteria.ttm_max) {
    where.push('i.time_to_market <= ?');
    queryParams.push(criteria.ttm_max);
  }
  if (criteria.min_rev) {
    where.push('i.revenue_potential >= ?');
    queryParams.push(criteria.min_rev);
  }
  if (criteria.min_ai) {
    where.push('i.ai_friendliness >= ?');
    queryParams.push(criteria.min_ai);
  }
  if (criteria.min_trending) {
    where.push('i.trending_pct >= ?');
    queryParams.push(criteria.min_trending);
  }
  if (criteria.search) {
    const words = (criteria.search as string).split(',').map((w: string) => `i.keyword LIKE '%${w.trim()}%'`);
    where.push(`(${words.join(' OR ')})`);
  }

  let orderBy = 'i.volume DESC';
  if (criteria.sort === 'trending') orderBy = 'i.trending_pct DESC';

  const ideas = sqlite.prepare(`
    SELECT 
      i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
      i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
      i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
      i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
      i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
      i.compliance_risk as complianceRisk, i.category
    FROM ideas i
    WHERE ${where.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT 48
  `).all(...queryParams) as IdeaItem[];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center min-h-[44px] sm:min-h-auto gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Back to All Collections</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Curated Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
                {col.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {col.description}
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-left sm:text-right shrink-0">
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Showing</span>
              <span className="text-lg font-bold text-slate-900 tabular-nums">{ideas.length}</span>
              <span className="text-xs text-slate-500 ml-1">opportunities</span>
            </div>
          </div>
        </div>

        {/* Grid of Collection Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </main>
    </div>
  );
}

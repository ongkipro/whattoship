import { Metadata } from 'next';
import Link from 'next/link';
import { sqlite } from '@/db';
import Navbar from '@/components/Navbar';
import { CollectionRecord } from '@/types';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  DollarSign,
  FileText,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Idea Collections | WhatToShip',
  description: 'Hand-picked thematic collections of software, micro-SaaS, and online tool opportunities categorized by time-to-market, revenue potential, and search momentum.',
};

interface CollectionWithCount extends CollectionRecord {
  liveCount: number;
}

interface FilterCriteriaJSON {
  type?: string;
  category?: string;
  difficulty_rank_max?: number;
  tech_max?: number;
  ttm_max?: number;
  min_rev?: number;
  min_ai?: number;
  min_trending?: number;
  search?: string;
}

export default async function CollectionsPage() {
  const collections = sqlite.prepare('SELECT * FROM collections ORDER BY sort_order ASC').all() as CollectionRecord[];

  // Calculate live item count for each collection
  const collectionsWithCounts: CollectionWithCount[] = collections.map((col) => {
    const criteria: FilterCriteriaJSON = JSON.parse(col.filter_criteria || '{}');
    const where: string[] = ['1=1'];
    const params: (string | number)[] = [];

    if (criteria.type) {
      where.push('type = ?');
      params.push(criteria.type);
    }
    if (criteria.category) {
      where.push('category = ?');
      params.push(criteria.category);
    }
    if (criteria.difficulty_rank_max) {
      where.push('difficulty_rank <= ?');
      params.push(criteria.difficulty_rank_max);
    }
    if (criteria.tech_max) {
      where.push('technical_complexity <= ?');
      params.push(criteria.tech_max);
    }
    if (criteria.ttm_max) {
      where.push('time_to_market <= ?');
      params.push(criteria.ttm_max);
    }
    if (criteria.min_rev) {
      where.push('revenue_potential >= ?');
      params.push(criteria.min_rev);
    }
    if (criteria.min_ai) {
      where.push('ai_friendliness >= ?');
      params.push(criteria.min_ai);
    }
    if (criteria.min_trending) {
      where.push('trending_pct >= ?');
      params.push(criteria.min_trending);
    }
    if (criteria.search) {
      const words = criteria.search.split(',').map((w: string) => `keyword LIKE '%${w.trim()}%'`);
      where.push(`(${words.join(' OR ')})`);
    }

    const { count } = sqlite.prepare(`SELECT count(*) as count FROM ideas WHERE ${where.join(' AND ')}`).get(...params) as { count: number };
    return {
      ...col,
      liveCount: count,
    };
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-cyan-600" />;
      case 'FileText': return <FileText className="w-5 h-5 text-blue-600" />;
      default: return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Thematic Collections</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight break-words">
            Curated <span className="gemini-gradient-text">Idea Collections</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Pre-filtered hubs designed for specific builder strategies: rapid weekend projects, high-margin solo SaaS, viral breakout waves, and AI wrappers.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsWithCounts.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group flex flex-col justify-between rounded-2xl bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-blue-300 p-6 transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    {getIcon(col.icon_name)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tabular-nums">
                    {col.liveCount.toLocaleString()} ideas
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {col.title}
                </h2>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {col.tagline}
                </p>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Bookmark, Sparkles, Clock, Zap } from 'lucide-react';
import { useBookmarks } from '@/lib/bookmarks';

export interface IdeaItem {
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

interface IdeaCardProps {
  idea: IdeaItem;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(idea.slug);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(idea.slug);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Extremely Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Easy':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Extremely Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const title = idea.keyword.replace(/\b\w/g, (c) => c.toUpperCase());
  const isPositiveTrend = idea.trendingPct >= 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white hover:bg-slate-50/50 border border-slate-200/90 hover:border-blue-300 p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-md">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {idea.type}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(idea.difficulty)}`}>
              {idea.difficulty}
            </span>
            {idea.aiFriendliness >= 4 && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                AI
              </span>
            )}
          </div>

          <button
            onClick={handleToggle}
            aria-label={bookmarked ? `Remove ${title} from bookmarks` : `Add ${title} to bookmarks`}
            className={`min-w-[44px] min-h-[44px] -mr-2 -mt-2.5 p-2.5 rounded-full flex items-center justify-center transition-colors touch-manipulation ${
              bookmarked
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/ideas/${idea.slug}`} className="block">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug break-words">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{idea.category}</p>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          {/* Monthly Volume */}
          <div>
            <span className="block text-[10px] uppercase font-medium text-slate-500 tracking-wider">
              Search Volume
            </span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {idea.volume.toLocaleString()}<span className="text-[11px] font-normal text-slate-500">/mo</span>
            </span>
          </div>

          {/* Trending Growth */}
          <div>
            <span className="block text-[10px] uppercase font-medium text-slate-500 tracking-wider">
              Trending Growth
            </span>
            <div className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${isPositiveTrend ? 'text-emerald-600' : 'text-slate-500'}`}>
              {isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{isPositiveTrend ? `+${idea.trendingPct}%` : `${idea.trendingPct}%`}</span>
            </div>
          </div>
        </div>

        {/* Technical & Revenue Dots */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5" title={`Technical Complexity: ${idea.technicalComplexity}/5`}>
            <span className="text-[10px] uppercase font-medium">Tech:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-1.5 h-1.5 rounded-full ${
                    step <= idea.technicalComplexity ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5" title={`Revenue Potential: ${idea.revenuePotential}/5`}>
            <span className="text-[10px] uppercase font-medium">Rev:</span>
            <div className="flex gap-0.5 font-bold text-xs">
              {[1, 2, 3, 4, 5].map((step) => (
                <span
                  key={step}
                  className={step <= idea.revenuePotential ? 'text-amber-500' : 'text-slate-200'}
                >
                  $
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/ideas/${idea.slug}`}
          className="inline-flex items-center min-h-[36px] sm:min-h-auto gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1"
        >
          <span>Inspect Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          {idea.timeToMarket <= 2 ? (
            <>
              <Zap className="w-3 h-3 text-amber-500" />
              <span>&lt;1 wk TTM</span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-slate-400" />
              <span>2-4 wks TTM</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

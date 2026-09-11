'use client';

import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterState {
  type: string;
  category: string;
  difficulty: string;
  easyOnly: boolean;
  maxTech: number | null;
  minRev: number | null;
  trending: number | null;
  sort: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
}

const CATEGORIES = [
  'All Categories',
  'Calculator',
  'Generator',
  'Converter',
  'Analyzer / Utility',
  'FinTech & B2B Ops SaaS',
  'Marketing & SEO SaaS',
  'General / Niche SaaS',
  'Healthcare & Wellness SaaS',
  'EdTech SaaS',
  'Other Tool'
];

export default function FilterBar({ filters, onChange, onReset, totalCount }: FilterBarProps) {
  const isFiltered = filters.type !== 'all' || 
                     filters.category !== '' || 
                     filters.difficulty !== '' || 
                     filters.easyOnly || 
                     filters.maxTech !== null || 
                     filters.minRev !== null || 
                     filters.trending !== null;

  return (
    <div className="w-full bg-white border border-slate-200/90 shadow-xs rounded-2xl p-4 sm:p-5 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-sm font-semibold text-slate-900">Explorer Filters</span>
            <span className="text-xs text-slate-500 ml-1 font-medium">
              ({totalCount.toLocaleString()} matches)
            </span>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {isFiltered && (
            <button
              onClick={onReset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-slate-500 font-medium shrink-0">Sort by:</span>
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              className="w-full sm:w-auto bg-slate-50 text-slate-800 text-base sm:text-xs font-medium px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[34px] rounded-full border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="volume">Search Volume (High to Low)</option>
              <option value="trending">Trending Momentum (%)</option>
              <option value="rev">Revenue Potential</option>
              <option value="tech">Tech Simplicity (Easiest)</option>
              <option value="difficulty">SEO Difficulty (Easiest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Type Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Product Type
          </label>
          <div className="flex rounded-full bg-slate-100 p-1 border border-slate-200 min-h-[44px] sm:min-h-auto items-center">
            {['all', 'Online Tool', 'SaaS'].map((t) => (
              <button
                key={t}
                onClick={() => onChange({ type: t })}
                className={`flex-1 py-2 sm:py-1 text-xs font-medium rounded-full transition-all min-h-[36px] sm:min-h-auto flex items-center justify-center ${
                  filters.type === t
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value === 'All Categories' ? '' : e.target.value })}
            className="w-full bg-slate-50 text-slate-800 text-base sm:text-xs px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'All Categories' ? '' : c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Difficulty */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            SEO Difficulty
          </label>
          <select
            value={filters.easyOnly ? 'easy-only' : filters.difficulty}
            onChange={(e) => {
              if (e.target.value === 'easy-only') {
                onChange({ easyOnly: true, difficulty: '' });
              } else {
                onChange({ easyOnly: false, difficulty: e.target.value });
              }
            }}
            className="w-full bg-slate-50 text-slate-800 text-base sm:text-xs px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy-only">Easy & Extremely Easy Only</option>
            <option value="Extremely Easy">Extremely Easy</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
            <option value="Extremely Hard">Extremely Hard</option>
          </select>
        </div>

        {/* Tech / Revenue Quick Toggles */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Fast Filters
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChange({ maxTech: filters.maxTech === 2 ? null : 2 })}
              className={`flex-1 py-2 sm:py-1.5 px-2 min-h-[44px] sm:min-h-[38px] rounded-xl text-xs font-medium border transition-colors flex items-center justify-center ${
                filters.maxTech === 2
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Tech ≤ 2
            </button>
            <button
              onClick={() => onChange({ minRev: filters.minRev === 4 ? null : 4 })}
              className={`flex-1 py-2 sm:py-1.5 px-2 min-h-[44px] sm:min-h-[38px] rounded-xl text-xs font-medium border transition-colors flex items-center justify-center ${
                filters.minRev === 4
                  ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Rev ≥ 4
            </button>
            <button
              onClick={() => onChange({ trending: filters.trending === 50 ? null : 50 })}
              className={`flex-1 py-2 sm:py-1.5 px-2 min-h-[44px] sm:min-h-[38px] rounded-xl text-xs font-medium border transition-colors flex items-center justify-center ${
                filters.trending === 50
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Trend ≥ 50%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SearchCapsule from '@/components/SearchCapsule';
import FilterBar from '@/components/FilterBar';
import IdeaCard, { IdeaItem } from '@/components/IdeaCard';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

interface FilterCriteria {
  q?: string;
  type?: string;
  easyOnly?: boolean;
  maxTech?: number;
  minRev?: number;
  trending?: number;
  category?: string;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    difficulty: '',
    easyOnly: false,
    maxTech: null as number | null,
    minRev: null as number | null,
    trending: null as number | null,
    sort: 'volume',
  });
  const [page, setPage] = useState(1);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [total, setTotal] = useState(13445);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ideas from API
  const fetchIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.category) params.set('category', filters.category);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.easyOnly) params.set('easy_only', 'true');
      if (filters.maxTech !== null) params.set('max_tech', String(filters.maxTech));
      if (filters.minRev !== null) params.set('min_rev', String(filters.minRev));
      if (filters.trending !== null) params.set('trending', String(filters.trending));
      params.set('sort', filters.sort);
      params.set('page', String(page));
      params.set('limit', '24');

      const res = await fetch(`/api/ideas?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setIdeas(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to load ideas:', e);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, page]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIdeas();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchIdeas]);

  const handleFilterChange = (updated: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...updated }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setQuery('');
    setFilters({
      type: 'all',
      category: '',
      difficulty: '',
      easyOnly: false,
      maxTech: null,
      minRev: null,
      trending: null,
      sort: 'volume',
    });
    setPage(1);
  };

  const handleSelectChip = (params: FilterCriteria) => {
    setPage(1);
    if (params.q !== undefined) setQuery(params.q);
    setFilters(prev => ({
      ...prev,
      type: params.type || prev.type,
      easyOnly: params.easyOnly !== undefined ? params.easyOnly : prev.easyOnly,
      maxTech: params.maxTech !== undefined ? params.maxTech : prev.maxTech,
      minRev: params.minRev !== undefined ? params.minRev : prev.minRev,
      trending: params.trending !== undefined ? params.trending : prev.trending,
      category: params.category || prev.category,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 shadow-2xs mb-5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>13,445 Curated Software Opportunities</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-600 font-semibold">234.7M Monthly Queries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight break-words">
            What will you <span className="gemini-gradient-text">ship next?</span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Instant search volume, SEO difficulty, technical architectures, monetization blueprints, and 1-click AI starter prompts.
          </p>
        </section>

        {/* Gemini Prompt Capsule Search */}
        <SearchCapsule
          value={query}
          onChange={(val) => {
            setQuery(val);
            setPage(1);
          }}
          onSelectChip={handleSelectChip}
        />

        {/* Multi-Dimensional Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={total}
        />

        {/* Results Grid */}
        <section className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-white border border-slate-200/80 animate-pulse p-5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="w-24 h-5 rounded-full bg-slate-100" />
                    <div className="w-3/4 h-6 rounded-lg bg-slate-100" />
                    <div className="w-1/2 h-4 rounded-md bg-slate-100" />
                  </div>
                  <div className="w-full h-10 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          ) : ideas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center sm:text-left">
                    Showing <span className="font-semibold text-slate-900">{(page - 1) * 24 + 1}</span> to{' '}
                    <span className="font-semibold text-slate-900">{Math.min(page * 24, total)}</span> of{' '}
                    <span className="font-semibold text-slate-900">{total.toLocaleString()}</span> ideas
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      aria-label="Previous Page"
                      className="flex items-center justify-center min-h-[44px] sm:min-h-[36px] gap-1 px-4 py-2 sm:py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-2xs transition-colors touch-manipulation"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <span className="min-h-[44px] sm:min-h-[36px] flex items-center px-3.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full border border-slate-200 tabular-nums">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      aria-label="Next Page"
                      className="flex items-center justify-center min-h-[44px] sm:min-h-[36px] gap-1 px-4 py-2 sm:py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-2xs transition-colors touch-manipulation"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No matching opportunities found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters, selecting &apos;All Types&apos;, or searching for a different keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 min-h-[44px] px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs inline-flex items-center justify-center touch-manipulation"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WhatToShip. Discover high-demand software opportunities.</p>
          <div className="flex items-center gap-4">
            <Link href="/collections" className="min-h-[44px] sm:min-h-auto inline-flex items-center hover:text-slate-900 transition-colors">Collections</Link>
            <a href="/api/export?format=csv&limit=5000" download className="min-h-[44px] sm:min-h-auto inline-flex items-center hover:text-slate-900 transition-colors">Export CSV</a>
            <Link href="/api/ideas?limit=10" className="min-h-[44px] sm:min-h-auto inline-flex items-center hover:text-slate-900 transition-colors">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import IdeaCard, { IdeaItem } from '@/components/IdeaCard';
import { Bookmark, ArrowLeft, Trash2, Sparkles, Download } from 'lucide-react';
import { useBookmarks } from '@/lib/bookmarks';

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSavedIdeas() {
      if (bookmarks.length === 0) {
        setIdeas([]);
        return;
      }

      setIsLoading(true);
      try {
        const fetched: IdeaItem[] = [];
        for (const slug of bookmarks.slice(0, 50)) {
          const res = await fetch(`/api/ideas/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.idea) fetched.push(data.idea);
          }
        }
        if (active) {
          setIdeas(fetched);
        }
      } catch (e) {
        console.error('Failed to load saved ideas', e);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSavedIdeas();

    return () => {
      active = false;
    };
  }, [bookmarks]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all saved bookmarks?')) {
      clearBookmarks();
      setIdeas([]);
    }
  };

  const exportSavedCsv = () => {
    if (ideas.length === 0) return;
    const headers = ['Keyword', 'Slug', 'Type', 'Category', 'Volume', 'Difficulty', 'Trend %', 'Tech', 'Rev'];
    const lines = [
      headers.join(','),
      ...ideas.map(i => [
        `"${i.keyword}"`,
        i.slug,
        i.type,
        `"${i.category}"`,
        i.volume,
        i.difficulty,
        `${i.trendingPct}%`,
        i.technicalComplexity,
        i.revenuePotential
      ].join(','))
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'what-to-ship-saved-bookmarks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] sm:min-h-auto gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Back to Explorer</span>
            </Link>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight break-words flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span>Saved Blueprints</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {bookmarks.length} saved
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your shortlisted product ideas stored securely in your browser&apos;s local storage.
            </p>
          </div>

          {ideas.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={exportSavedCsv}
                aria-label="Export saved ideas to CSV"
                className="flex-1 sm:flex-initial flex items-center justify-center min-h-[44px] sm:min-h-[36px] gap-1.5 px-4 py-2 sm:py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-2xs transition-all touch-manipulation"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleClear}
                aria-label="Clear all saved bookmarks"
                className="flex-1 sm:flex-initial flex items-center justify-center min-h-[44px] sm:min-h-[36px] gap-1.5 px-4 py-2 sm:py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 shadow-2xs transition-all touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200/80 animate-pulse p-5 shadow-xs" />
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Bookmark className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No saved blueprints yet</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
              Click the bookmark icon on any idea card while exploring to save it to your private shortlist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] gap-1.5 mt-5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Explore 13,445 Opportunities</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

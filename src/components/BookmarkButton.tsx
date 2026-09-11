'use client';

import { Bookmark, Check } from 'lucide-react';
import { useBookmarks } from '@/lib/bookmarks';

interface BookmarkButtonProps {
  slug: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

export default function BookmarkButton({ slug, title, className = '', compact = false }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(slug);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        aria-label={saved ? `Remove ${title || slug} from shortlist` : `Save ${title || slug} to shortlist`}
        title={saved ? 'Remove from shortlist' : 'Save to shortlist'}
        className={`min-w-[44px] min-h-[44px] p-2.5 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation select-none ${
          saved
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200'
        } ${className}`}
      >
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? `Unsave ${title || slug}` : `Save ${title || slug} to shortlist`}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 touch-manipulation select-none ${
        saved
          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 shadow-2xs'
          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300'
      } ${className}`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-blue-600' : 'text-slate-500'}`} />
      <span>{saved ? 'Saved to Shortlist' : 'Save Blueprint'}</span>
      {saved && <Check className="w-3.5 h-3.5 text-blue-600 ml-0.5" />}
    </button>
  );
}

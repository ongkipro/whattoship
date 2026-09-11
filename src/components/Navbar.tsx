import Link from 'next/link';
import { Compass, Bookmark, Download, Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Typographic Logo without Icon */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            WhatTo<span className="text-blue-600">Ship</span>
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            13.4k
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link
            href="/"
            aria-label="Explorer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Explorer</span>
          </Link>

          <Link
            href="/collections"
            aria-label="Collections"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Collections</span>
          </Link>

          <Link
            href="/bookmarks"
            aria-label="Saved Ideas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Saved</span>
          </Link>

          <a
            href="/api/export?format=csv&limit=5000"
            download
            aria-label="Export CSV"
            className="flex items-center gap-1.5 ml-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300/80 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </a>
        </nav>

        {/* Mobile Action: Quick Export CSV */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href="/api/export?format=csv&limit=5000"
            download
            aria-label="Export CSV"
            className="inline-flex items-center justify-center min-h-[36px] px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300/80 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-slate-600" />
            <span>Export</span>
          </a>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, X, Zap, DollarSign, Flame, Bot, BarChart3, LucideIcon } from 'lucide-react';

interface SearchCapsuleProps {
  value: string;
  onChange: (val: string) => void;
  onSelectChip: (params: { q?: string; type?: string; easyOnly?: boolean; minRev?: number; maxTech?: number; trending?: number; category?: string }) => void;
}

interface ChipItem {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  params: { q?: string; type?: string; easyOnly?: boolean; minRev?: number; maxTech?: number; trending?: number; category?: string };
}

export default function SearchCapsule({ value, onChange, onSelectChip }: SearchCapsuleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const chips: ChipItem[] = [
    { label: 'Instant Wins (<48h)', icon: Zap, iconColor: 'text-amber-600', params: { easyOnly: true, maxTech: 2 } },
    { label: 'High-Yield SaaS', icon: DollarSign, iconColor: 'text-cyan-600', params: { type: 'SaaS', minRev: 4 } },
    { label: 'Breakout Trends (>100%)', icon: Flame, iconColor: 'text-orange-600', params: { trending: 100 } },
    { label: 'AI-Native Tools', icon: Bot, iconColor: 'text-purple-600', params: { q: 'ai ' } },
    { label: 'Financial Calculators', icon: BarChart3, iconColor: 'text-blue-600', params: { category: 'Calculator', q: 'calculator' } },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Floating Prompt Capsule */}
      <div className="relative w-full group">
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-sm opacity-40 group-focus-within:opacity-100 group-focus-within:blur-md transition-all duration-300 pointer-events-none" />
        
        <div className="relative flex items-center w-full h-14 sm:h-16 px-4 sm:px-5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 shadow-lg shadow-slate-200/50 transition-all">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mr-3 sm:mr-3.5 transition-transform group-focus-within:scale-110" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search 13,445 software ideas, calculators, or niche SaaS..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-lg focus:outline-none tracking-normal truncate"
          />

          {value && (
            <button
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-auto flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mr-1 sm:mr-2"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs text-slate-400 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 font-sans">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 font-sans">K</kbd>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 mt-3.5 w-full overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
        <span className="text-xs text-slate-500 font-medium shrink-0 hidden sm:inline-block mr-1">
          Suggestions:
        </span>
        {chips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectChip(chip.params)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 min-h-[38px] sm:min-h-auto rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all touch-manipulation"
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${chip.iconColor}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

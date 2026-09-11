'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Layers, Bookmark, Search } from 'lucide-react';
import { useBookmarks } from '@/lib/bookmarks';

export default function BottomNav() {
  const pathname = usePathname();
  const { bookmarks } = useBookmarks();

  const handleSearchTap = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>('input[type="text"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const navItems = [
    {
      label: 'Explorer',
      href: '/',
      icon: Compass,
      active: pathname === '/',
    },
    {
      label: 'Search',
      href: '/#search',
      icon: Search,
      active: false,
      onClick: handleSearchTap,
    },
    {
      label: 'Collections',
      href: '/collections',
      icon: Layers,
      active: pathname.startsWith('/collections'),
    },
    {
      label: 'Saved',
      href: '/bookmarks',
      icon: Bookmark,
      active: pathname === '/bookmarks',
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 rounded-xl transition-all active:scale-95 touch-manipulation select-none ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 active:text-slate-800'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>

              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

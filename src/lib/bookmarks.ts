'use client';

import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'wts_bookmarks';

const SERVER_SNAPSHOT: string[] = [];
let cachedRaw: string | null = null;
let cachedBookmarks: string[] = SERVER_SNAPSHOT;

function getSnapshot(): string[] {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedBookmarks;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedBookmarks = SERVER_SNAPSHOT;
    } else {
      const parsed = JSON.parse(raw);
      cachedBookmarks = Array.isArray(parsed) ? parsed : SERVER_SNAPSHOT;
    }
    return cachedBookmarks;
  } catch {
    return SERVER_SNAPSHOT;
  }
}

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleBookmark = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = getSnapshot();
      const next = current.includes(slug)
        ? current.filter(s => s !== slug)
        : [...current, slug];
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      cachedRaw = raw;
      cachedBookmarks = next;
      notify();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  }, []);

  const clearBookmarks = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      cachedRaw = null;
      cachedBookmarks = SERVER_SNAPSHOT;
      notify();
    } catch (err) {
      console.error('Failed to clear bookmarks:', err);
    }
  }, []);

  const isBookmarked = useCallback((slug: string) => {
    return bookmarks.includes(slug);
  }, [bookmarks]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
  };
}

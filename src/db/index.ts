import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1';
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'what_to_ship.db');

// Ensure parent directory exists (in local / writable environments)
if (!isVercel) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Open sqlite database: on Vercel serverless, open as readonly to avoid EROFS filesystem errors
export const sqlite = new Database(DB_PATH, {
  readonly: isVercel,
  fileMustExist: isVercel,
});

if (!isVercel) {
  // Enable WAL mode for high concurrent local performance
  try {
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('synchronous = NORMAL');
    sqlite.pragma('cache_size = -64000'); // 64MB cache
  } catch {
    // Fallback gracefully
  }
} else {
  // Production serverless read-only optimization
  try {
    sqlite.pragma('query_only = ON');
    sqlite.pragma('cache_size = -32000'); // 32MB cache
  } catch {
    // Fallback gracefully
  }
}

export const db = drizzle(sqlite, { schema });

export default db;

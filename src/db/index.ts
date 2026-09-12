import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1';

function resolveDatabasePath(): string {
  const sourcePath = path.join(process.cwd(), 'data', 'what_to_ship.db');

  if (isVercel) {
    const tmpPath = path.join('/tmp', 'what_to_ship.db');
    if (fs.existsSync(tmpPath)) {
      return tmpPath;
    }

    if (fs.existsSync(sourcePath)) {
      try {
        console.log(`Preparing database in /tmp for serverless execution...`);
        fs.copyFileSync(sourcePath, tmpPath);
        console.log(`Database ready at ${tmpPath}`);
        return tmpPath;
      } catch (err) {
        console.error('Failed to copy database to /tmp:', err);
      }
    } else {
      console.error('Source database not found at:', sourcePath);
    }
  }

  // Ensure local directory exists in dev
  const dir = path.dirname(sourcePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return sourcePath;
}

const activeDbPath = resolveDatabasePath();

// Open database: in Vercel, opening from /tmp avoids read-only filesystem locks
export const sqlite = new Database(activeDbPath, {
  readonly: isVercel,
  fileMustExist: false,
});

if (!isVercel) {
  try {
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('synchronous = NORMAL');
    sqlite.pragma('cache_size = -64000');
  } catch {
    // Graceful fallback
  }
} else {
  try {
    sqlite.pragma('query_only = ON');
    sqlite.pragma('cache_size = -32000');
  } catch {
    // Graceful fallback
  }
}

export const db = drizzle(sqlite, { schema });

export default db;

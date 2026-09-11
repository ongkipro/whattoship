import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/db';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://whattoship.io';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);

  if (isNaN(id) || id < 1) {
    return new NextResponse('Invalid sitemap chunk', { status: 400 });
  }

  const chunkSize = 2000;
  const offset = (id - 1) * chunkSize;

  const rows = sqlite.prepare(`
    SELECT slug, volume FROM ideas 
    ORDER BY id ASC 
    LIMIT ? OFFSET ?
  `).all(chunkSize, offset) as Array<{ slug: string; volume: number }>;

  if (!rows || rows.length === 0) {
    return new NextResponse('Sitemap chunk out of range', { status: 404 });
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const r of rows) {
    const priority = r.volume > 50000 ? '0.9' : r.volume > 5000 ? '0.8' : '0.6';
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/ideas/${r.slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}

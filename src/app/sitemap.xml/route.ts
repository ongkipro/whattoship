import { NextResponse } from 'next/server';
import { sqlite } from '@/db';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://whattoship.io';

export async function GET() {
  const { total } = sqlite.prepare('SELECT count(*) as total FROM ideas').get() as { total: number };
  const chunkSize = 2000;
  const chunkCount = Math.ceil(total / chunkSize);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (let i = 1; i <= chunkCount; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${BASE_URL}/sitemap-${i}.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += '</sitemapindex>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}

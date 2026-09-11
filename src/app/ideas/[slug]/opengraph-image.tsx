import { ImageResponse } from 'next/og';
import { sqlite } from '@/db';
import { IdeaRecord } from '@/types';

export const runtime = 'nodejs';
export const alt = 'WhatToShip Opportunity Blueprint';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idea = sqlite.prepare(`
    SELECT keyword, type, volume, difficulty, category, trending_pct as trendingPct,
           technical_complexity as technicalComplexity, revenue_potential as revenuePotential
    FROM ideas WHERE slug = ?
  `).get(slug) as Pick<IdeaRecord, 'keyword' | 'type' | 'volume' | 'difficulty' | 'category'> | undefined;

  const title = idea
    ? idea.keyword.replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Digital Product Opportunity';

  const volume = idea ? `${idea.volume.toLocaleString()}/mo` : '10,000+/mo';
  const difficulty = idea ? idea.difficulty : 'Easy';
  const type = idea ? idea.type : 'Online Tool';
  const category = idea ? idea.category : 'General';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#0f172a',
          position: 'relative',
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-60px',
            width: '650px',
            height: '450px',
            borderRadius: '100%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 70%)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#0f172a' }}>
              WhatTo<span style={{ color: '#2563eb' }}>Ship</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: '#f1f5f9',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                border: '1px solid #cbd5e1',
              }}
            >
              {type}
            </span>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                fontSize: '14px',
                fontWeight: 600,
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10, maxWidth: '1000px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b' }}>
            Product Intelligence Dossier
          </span>
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0f172a',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 36px',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>
              Search Demand
            </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
              {volume}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>
              SEO Competition
            </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
              {difficulty}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>
              Execution Strategy
            </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
              Build & Monetize
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

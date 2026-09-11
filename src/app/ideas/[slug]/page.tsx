import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sqlite } from '@/db';
import Navbar from '@/components/Navbar';
import RadarScorecard from '@/components/RadarScorecard';
import AIPromptBox from '@/components/AIPromptBox';
import BookmarkButton from '@/components/BookmarkButton';
import IdeaCard, { IdeaItem } from '@/components/IdeaCard';
import { IdeaRecord, IdeaAnalysisRaw } from '@/types';
import {
  Sparkles,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Layers,
  Cpu,
  DollarSign,
  Search,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Zap,
  Rocket,
  Globe,
  Users,
  UserCheck,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

interface ParsedAnalysis {
  executive_summary: string;
  target_audience: string;
  target_countries?: string;
  buyer_persona?: string;
  demographics?: string;
  search_intent: string;
  recommendedStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    hosting?: string;
  };
  client_vs_server_boundary: string;
  apiDependencies: string[];
  architecture_overview: string;
  monetization_model: string;
  pricing_recommendation: string;
  estimated_acv: string;
  monetizationChannels: string[];
  seedKeywords: string[];
  secondaryKeywords: string[];
  link_building_angle: string;
  schema_type: string;
  mvp_in_48_hours: string;
  full_product_roadmap: string;
  ai_prompt_template: string;
  competitor_weaknesses: string;
  unfair_advantage_wedge: string;
}

// Pre-render top 100 high-priority ideas for instant static edge cache
export async function generateStaticParams() {
  const topIdeas = sqlite.prepare(`
    SELECT slug FROM ideas 
    ORDER BY volume DESC 
    LIMIT 100
  `).all() as Array<{ slug: string }>;

  return topIdeas.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idea = sqlite.prepare('SELECT keyword, type, volume, difficulty FROM ideas WHERE slug = ?').get(slug) as Pick<IdeaRecord, 'keyword' | 'type' | 'volume' | 'difficulty'> | undefined;

  if (!idea) {
    return { title: 'Idea Not Found | WhatToShip' };
  }

  const title = idea.keyword.replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `${title} — Build Plan, Search Volume & Intelligence Dossier | WhatToShip`,
    description: `Comprehensive build blueprint for ${title} (${idea.type}). Search Volume: ${idea.volume.toLocaleString()}/mo, SEO Difficulty: ${idea.difficulty}. Recommended tech stack, monetization, and ready-to-run AI prompts.`,
    openGraph: {
      title: `${title} (${idea.type}) — WhatToShip Intelligence`,
      description: `${idea.volume.toLocaleString()} searches/mo • ${idea.difficulty} SEO • Full Architecture & AI Starter Blueprint.`,
      type: 'article',
    },
  };
}

export default async function IdeaDossierPage({ params }: Props) {
  const { slug } = await params;

  const ideaStmt = sqlite.prepare(`
    SELECT 
      i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
      i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
      i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
      i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
      i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
      i.compliance_risk as complianceRisk, i.category
    FROM ideas i
    WHERE i.slug = ?
  `);
  const idea = ideaStmt.get(slug) as IdeaItem | undefined;

  if (!idea) {
    notFound();
  }

  const analysisRaw = sqlite.prepare('SELECT * FROM idea_analyses WHERE idea_id = ?').get(idea.id) as IdeaAnalysisRaw | undefined;

  let analysis: ParsedAnalysis | null = null;
  if (analysisRaw) {
    analysis = {
      ...analysisRaw,
      recommendedStack: JSON.parse(analysisRaw.recommended_stack || '{}'),
      apiDependencies: JSON.parse(analysisRaw.api_dependencies || '[]'),
      monetizationChannels: JSON.parse(analysisRaw.monetization_channels || '[]'),
      seedKeywords: JSON.parse(analysisRaw.seed_keywords || '[]'),
      secondaryKeywords: JSON.parse(analysisRaw.secondary_keywords || '[]'),
    };
  }

  // 3 related ideas in same category
  const related = sqlite.prepare(`
    SELECT 
      i.id, i.slug, i.keyword, i.type, i.volume, i.difficulty, i.difficulty_rank as difficultyRank,
      i.trending_pct as trendingPct, i.technical_complexity as technicalComplexity,
      i.ai_friendliness as aiFriendliness, i.time_to_market as timeToMarket,
      i.maintenance_overhead as maintenanceOverhead, i.revenue_potential as revenuePotential,
      i.market_competition as marketCompetition, i.integrations_required as integrationsRequired,
      i.compliance_risk as complianceRisk, i.category
    FROM ideas i
    WHERE i.category = ? AND i.id != ?
    ORDER BY i.volume DESC
    LIMIT 3
  `).all(idea.category, idea.id) as IdeaItem[];

  const title = idea.keyword.replace(/\b\w/g, (c: string) => c.toUpperCase());
  const isPositiveTrend = idea.trendingPct >= 0;

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': idea.type === 'SaaS' ? 'SoftwareApplication' : 'WebApplication',
    name: title,
    applicationCategory: idea.category,
    operatingSystem: 'All',
    description: analysis?.executive_summary || `Digital product blueprint for ${title}.`,
    offers: {
      '@type': 'Offer',
      price: idea.type === 'SaaS' ? '29.00' : '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500 font-medium gap-2">
          <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1 min-h-[36px] sm:min-h-auto shrink-0 font-medium">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Explorer</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="truncate">{idea.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 hidden sm:inline" />
            <span className="text-slate-900 font-semibold truncate hidden sm:inline">{title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              {idea.type}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header Title Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                <span>Category: <strong className="text-slate-800 font-semibold">{idea.category}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Search Intent: <strong className="text-slate-800 font-semibold uppercase">{analysis?.search_intent}</strong></span>
                <span className="text-slate-300">•</span>
                <span>SEO Difficulty: <strong className="text-emerald-600 font-semibold">{idea.difficulty}</strong></span>
              </p>
            </div>

            {/* Quick Badges & Save Action */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center sm:text-right">
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Volume</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {idea.volume.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span>
                </span>
              </div>

              <div className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center sm:text-right">
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Momentum</span>
                <span className={`text-base font-bold tabular-nums flex items-center justify-center sm:justify-end gap-1 ${isPositiveTrend ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                  <span>{isPositiveTrend ? `+${idea.trendingPct}%` : `${idea.trendingPct}%`}</span>
                </span>
              </div>

              {/* Bookmark Save/Unsave Button */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
                <BookmarkButton slug={idea.slug} title={title} className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Gemini Canvas Split Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Radar Scorecard & Vitals (Sticky on Desktop) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <RadarScorecard
              metrics={{
                technicalComplexity: idea.technicalComplexity,
                aiFriendliness: idea.aiFriendliness,
                timeToMarket: idea.timeToMarket,
                maintenanceOverhead: idea.maintenanceOverhead,
                revenuePotential: idea.revenuePotential,
                marketCompetition: idea.marketCompetition,
                integrationsRequired: idea.integrationsRequired,
                complianceRisk: idea.complianceRisk,
              }}
            />

            {/* Target Geography, Buyer Persona & Demographics Card */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5 text-xs text-slate-600 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Market Demographics & Target Persona</span>
              </h4>

              {/* Target Countries / Geography */}
              <div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  Target Geography
                </span>
                <p className="leading-relaxed text-slate-800 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {analysis?.target_countries || 'Global Tier-1 (US, UK, CA, AU priority)'}
                </p>
              </div>

              {/* Buyer Persona */}
              <div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Buyer Persona
                </span>
                <p className="leading-relaxed text-slate-800 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {analysis?.buyer_persona || analysis?.target_audience}
                </p>
              </div>

              {/* Demographics & Behavior */}
              <div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Demographics & Platform Split
                </span>
                <p className="leading-relaxed text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {analysis?.demographics || 'Age 22-50, tech-literate, high desktop/mobile intent during weekday working hours.'}
                </p>
              </div>
            </div>

            {/* Link Building & Distribution Angle */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5 text-xs text-slate-600">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-purple-600" />
                <span>Distribution & Launch Angle</span>
              </h4>
              <p className="leading-relaxed text-slate-800 font-medium">
                {analysis?.link_building_angle}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: The Intelligence Canvas */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Executive Summary */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Executive Summary
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {analysis?.executive_summary}
              </p>
            </div>

            {/* 2. Technical Architecture Specification */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Technical Architecture Specification
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Frontend Framework</span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {analysis?.recommendedStack?.frontend || 'Next.js 15 App Router'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Backend & API Layer</span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {analysis?.recommendedStack?.backend || 'Server Actions & Edge Functions'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Database & ORM</span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {analysis?.recommendedStack?.database || 'SQLite / Turso + Drizzle ORM'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Hosting Target</span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {analysis?.recommendedStack?.hosting || 'Cloudflare Pages / Vercel'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-900">Client vs Server Boundary:</strong> {analysis?.client_vs_server_boundary}
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <strong className="text-slate-900">API Dependencies:</strong>
                  {analysis?.apiDependencies?.map((dep: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Monetization Blueprint */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Monetization & Pricing Blueprint
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Monetization Model</span>
                  <span className="text-sm font-semibold text-emerald-700 mt-0.5 block">
                    {analysis?.monetization_model}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] uppercase text-slate-500 font-medium">Estimated ACV / User</span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {analysis?.estimated_acv}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  <strong className="text-slate-900">Pricing Recommendation:</strong> {analysis?.pricing_recommendation}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <strong className="text-slate-900">Revenue Channels:</strong>
                  {analysis?.monetizationChannels?.map((ch: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Ready-to-Use AI Starter Prompt */}
            {analysis?.ai_prompt_template && (
              <AIPromptBox prompt={analysis.ai_prompt_template} title={title} />
            )}

            {/* 5. Execution Roadmap Checklists */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Phased Execution Roadmap
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>48-Hour Rapid MVP Checklist</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line break-words leading-relaxed overflow-x-auto">
                    {analysis?.mvp_in_48_hours}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                    <Rocket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Full Product Launch Milestones</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line break-words leading-relaxed overflow-x-auto">
                    {analysis?.full_product_roadmap}
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Competitor Landscape & Unfair Advantage Wedge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Incumbent Weaknesses
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis?.competitor_weaknesses}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center gap-2 mb-2 text-cyan-700">
                  <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Your Unfair Advantage Wedge
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis?.unfair_advantage_wedge}
                </p>
              </div>
            </div>

            {/* 7. Programmatic SEO Keywords */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Search className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Programmatic SEO Keyword Clusters
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {analysis?.seedKeywords?.map((kw: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium break-all">
                    {kw}
                  </span>
                ))}
                {analysis?.secondaryKeywords?.map((kw: string, idx: number) => (
                  <span key={`sec-${idx}`} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium break-all">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* 8. Related Opportunities */}
            {related.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Related Opportunities in {idea.category}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {related.map((rel) => (
                    <IdeaCard key={rel.id} idea={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

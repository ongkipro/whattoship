'use client';

interface RadarScorecardProps {
  metrics: {
    technicalComplexity: number;
    aiFriendliness: number;
    timeToMarket: number;
    maintenanceOverhead: number;
    revenuePotential: number;
    marketCompetition: number;
    integrationsRequired: number;
    complianceRisk: number;
  };
}

export default function RadarScorecard({ metrics }: RadarScorecardProps) {
  const axes = [
    { key: 'technicalComplexity', label: 'Tech Complexity', score: metrics.technicalComplexity, inv: false },
    { key: 'aiFriendliness', label: 'AI-Friendliness', score: metrics.aiFriendliness, inv: false },
    { key: 'timeToMarket', label: 'Time-to-Market', score: metrics.timeToMarket, inv: false },
    { key: 'maintenanceOverhead', label: 'Maintenance', score: metrics.maintenanceOverhead, inv: false },
    { key: 'revenuePotential', label: 'Revenue Potential', score: metrics.revenuePotential, inv: false },
    { key: 'marketCompetition', label: 'Competition', score: metrics.marketCompetition, inv: false },
    { key: 'integrationsRequired', label: 'Integrations', score: metrics.integrationsRequired, inv: false },
    { key: 'complianceRisk', label: 'Compliance/Risk', score: metrics.complianceRisk, inv: false },
  ];

  // SVG Radar Polygon calculations
  const size = 260;
  const center = size / 2;
  const radius = center - 40;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (score / 5) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon points
  const points = axes.map((a, i) => {
    const { x, y } = getCoordinates(i, a.score);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
        <span>Executive Scorecard</span>
        <span className="text-xs text-slate-400 font-mono">8 Dimensions</span>
      </h3>

      {/* SVG Radar Chart */}
      <div className="flex justify-center items-center py-2 w-full">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[260px] h-auto overflow-visible mx-auto"
        >
          {/* Background web concentric circles */}
          {[1, 2, 3, 4, 5].map((level) => {
            const levelRadius = (level / 5) * radius;
            return (
              <circle
                key={level}
                cx={center}
                cy={center}
                r={levelRadius}
                fill="none"
                stroke="rgba(0, 0, 0, 0.06)"
                strokeDasharray={level < 5 ? '2 2' : 'none'}
              />
            );
          })}

          {/* Spokes from center to edge */}
          {axes.map((_, i) => {
            const { x, y } = getCoordinates(i, 5);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(0, 0, 0, 0.08)"
              />
            );
          })}

          {/* Filled radar polygon */}
          <polygon
            points={points}
            fill="rgba(37, 99, 235, 0.15)"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Metric dot vertices */}
          {axes.map((a, i) => {
            const { x, y } = getCoordinates(i, a.score);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Detailed Progress Bars */}
      <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-100">
        {axes.map((a) => {
          const pct = (a.score / 5) * 100;
          return (
            <div key={a.key} className="text-xs">
              <div className="flex justify-between text-slate-600 mb-1 font-medium">
                <span>{a.label}</span>
                <span className="font-semibold text-slate-900 font-mono">{a.score}/5</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background:
                      a.key === 'revenuePotential'
                        ? 'linear-gradient(90deg, #f59e0b, #10b981)'
                        : a.key === 'aiFriendliness'
                        ? 'linear-gradient(90deg, #8b5cf6, #06b6d4)'
                        : 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

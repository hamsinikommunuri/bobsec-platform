import React from 'react';
import { useApp } from '../context/AppContext';

export const IntelligencePage: React.FC = () => {
  const { stats, historyList } = useApp();

  const totalTelemetry = stats ? 1284 + stats.total : 1284;
  const highRiskIntercepts = stats ? 412 + stats.highRisk : 412;

  // Trend coordinates for SVG chart
  const trendPoints = [
    { week: 'W01', val: 35 },
    { week: 'W02', val: 42 },
    { week: 'W03', val: 38 },
    { week: 'W04', val: 55 },
    { week: 'W05', val: 62 },
    { week: 'W06', val: 58 },
    { week: 'W07', val: 74 },
    { week: 'W08', val: 68 },
    { week: 'W09', val: 82 },
    { week: 'W10', val: 78 },
    { week: 'W11', val: 91 },
    { week: 'W12', val: 94 }
  ];

  const svgPath = `M 20 ${180 - (trendPoints[0].val / 100) * 140} ` +
    trendPoints.map((p, i) => `L ${20 + i * 52} ${180 - (p.val / 100) * 140}`).join(' ');

  const areaPath = `${svgPath} L ${20 + 11 * 52} 180 L 20 180 Z`;

  return (
    <div className="flex flex-col w-full max-w-[1240px] mx-auto px-4 lg:px-8 pt-4 pb-20 space-y-8">
      {/* Title & Institutional Metadata Header */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-error shadow-[0_0_10px_#ffb4ab]" />
            <span className="font-label-instrument text-xs uppercase tracking-widest text-on-surface-variant font-mono">
              THREAT RECONNAISSANCE // BOBSEC SPECTRAL ENGINE
            </span>
            <span className="font-label-tabular text-outline">|</span>
            <span className="font-label-tabular text-xs text-primary-fixed-dim font-mono">SEC-GRADE LEVEL IV</span>
          </div>
          <h1 className="font-display-verdict text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight leading-none font-medium">
            Scam Intelligence &amp; Threat Matrix
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
            Synthesized behavioral correlation, syndicate vectors, and heuristic telemetry across {totalTelemetry.toLocaleString()} verified analyses.
          </p>
        </div>

        <div className="flex flex-col xl:items-end gap-1.5 self-start xl:self-auto bg-surface-container-high/40 backdrop-blur-xl px-4 py-3 rounded-lg border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-tertiary-container animate-pulse">
              satellite_alt
            </span>
            <span className="font-label-instrument text-xs uppercase tracking-wider text-primary font-mono">
              CORRELATED NODES: 48,912
            </span>
          </div>
          <div className="font-label-tabular text-xs text-on-surface-variant font-mono">
            SYNTHETIC DEMO POOL <span className="text-outline">·</span> Q1 ACTIVE REGISTRY
          </div>
        </div>
      </section>

      {/* Hero Metric Composition */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Primary Anchor Slab (7 Cols) */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-xl bg-surface-container/60 backdrop-blur-2xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] border border-white/[0.06] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-error/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                <span className="font-label-instrument text-xs uppercase tracking-widest text-error font-semibold font-mono">
                  CRITICAL INTERCEPTION ANCHOR
                </span>
              </div>
              <span className="font-label-tabular text-xs text-on-surface-variant bg-surface-container-highest/60 px-2.5 py-1 rounded font-mono border border-white/[0.04]">
                CONFIDENCE: 99.8%
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-monumental-numeral text-5xl sm:text-6xl font-light text-primary tracking-tighter leading-none">
                {highRiskIntercepts}
              </span>
              <div className="flex flex-col">
                <span className="font-title-lg text-base sm:text-lg text-on-surface font-medium">
                  High-Risk Inbound Intercepts Neutralized
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-error text-xs font-mono">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+14.2% severity escalation vs 30-day baseline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 bg-surface-container-low/80 rounded-lg p-4 border border-white/[0.04]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-error-container/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[18px]">gavel</span>
                </div>
                <div>
                  <div className="font-label-instrument text-[10px] uppercase tracking-wider text-outline font-mono">
                    PRIMARY VECTOR FOCUS
                  </div>
                  <div className="font-body-md text-sm text-on-surface font-medium">
                    Digital Arrest &amp; Coercive Law Impersonation
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container px-3 py-1.5 rounded border border-white/[0.05]">
                <span className="font-label-tabular text-xs text-primary-container font-semibold font-mono">
                  42% of critical cases
                </span>
                <span className="material-symbols-outlined text-[14px] text-primary-container">warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Telemetry Multi-Deck Strip (5 Cols) */}
        <div className="lg:col-span-5 grid grid-rows-3 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-high/50 backdrop-blur-xl p-5 shadow-lg border border-white/[0.05] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-label-instrument text-[10px] uppercase tracking-widest text-outline font-mono">
                TOTAL TELEMETRY PROCESSED
              </span>
              <div className="font-headline-md text-2xl font-semibold text-on-surface font-mono">
                {totalTelemetry.toLocaleString()}
              </div>
              <span className="font-label-tabular text-xs text-on-surface-variant font-mono">
                Zero raw plain-text payload retention
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest/60 flex items-center justify-center text-primary-fixed-dim">
              <span className="material-symbols-outlined text-[24px]">dataset</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-surface-container-high/50 backdrop-blur-xl p-5 shadow-lg border border-white/[0.05] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-label-instrument text-[10px] uppercase tracking-widest text-outline font-mono">
                AVG ON-DEVICE TRIAGE LATENCY
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-md text-2xl font-semibold text-on-surface font-mono">42</span>
                <span className="font-label-tabular text-xs text-tertiary-container font-semibold uppercase font-mono">
                  ms // Hardware Enclave
                </span>
              </div>
              <span className="font-label-tabular text-xs text-on-surface-variant font-mono">
                Nominal threshold &lt;100ms
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest/60 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-surface-container-high/50 backdrop-blur-xl p-5 shadow-lg border border-white/[0.05] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-label-instrument text-[10px] uppercase tracking-widest text-outline font-mono">
                SYNDICATED FRAUD LOSS ABORTED
              </span>
              <div className="font-headline-md text-2xl font-semibold text-tertiary-container font-mono">
                ₹3.42 <span className="text-sm font-normal text-on-surface">Cr</span>
              </div>
              <span className="font-label-tabular text-xs text-on-surface-variant font-mono">
                Validated via 1930 alert telemetry match
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest/60 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[24px]">shield_with_heart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Central Visualization Plane: Dual Spectral Instruments */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Spectral Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl bg-surface-container/70 backdrop-blur-2xl p-6 shadow-2xl border border-white/[0.05] flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#8cebff]" />
                <h2 className="font-title-lg text-base font-semibold text-on-surface">
                  Risk Severity Trend &amp; Incidence Trajectory
                </h2>
              </div>
              <p className="font-label-tabular text-xs text-on-surface-variant mt-0.5 font-mono">
                Temporal cohort W01–W12 · Rolling confidence interval 99.4%
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-outline bg-surface-container-highest/40 px-2.5 py-1 rounded">
              <span className="w-2 h-0.5 bg-error" />
              <span>Severity Index</span>
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="w-full h-48 relative overflow-hidden flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f06063" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f06063" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#343536" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#343536" strokeDasharray="3 3" />
              <line x1="0" y1="160" x2="600" y2="160" stroke="#343536" strokeDasharray="3 3" />

              {/* Area fill */}
              <path d={areaPath} fill="url(#trendGrad)" />

              {/* Line */}
              <path d={svgPath} fill="none" stroke="#f06063" strokeWidth="2.5" />

              {/* Data points */}
              {trendPoints.map((p, idx) => (
                <circle
                  key={idx}
                  cx={20 + idx * 52}
                  cy={180 - (p.val / 100) * 140}
                  r="3.5"
                  fill="#effcff"
                  stroke="#f06063"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* Week Labels */}
          <div className="flex justify-between text-[10px] font-mono text-outline border-t border-white/[0.04] pt-2">
            {trendPoints.map((p) => (
              <span key={p.week}>{p.week}</span>
            ))}
          </div>
        </div>

        {/* Right Distribution Breakdown (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl bg-surface-container/70 backdrop-blur-2xl p-6 shadow-2xl border border-white/[0.05] flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-container shadow-[0_0_8px_#6cf6b4]" />
              <h2 className="font-title-lg text-base font-semibold text-on-surface">Tactical Vector Breakdown</h2>
            </div>
            <p className="font-label-tabular text-xs text-on-surface-variant mt-0.5 font-mono">
              Prevalence by threat archetype
            </p>
          </div>

          {/* Bar breakdowns */}
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface">Digital Arrest Extortion</span>
                <span className="text-error font-semibold">42%</span>
              </div>
              <div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-error rounded shadow-[0_0_6px_#f06063]" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface">Bank KYC &amp; NetBanking</span>
                <span className="text-[#e8aa42] font-semibold">28%</span>
              </div>
              <div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-[#e8aa42] rounded" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface">UPI Reverse PIN / Collect</span>
                <span className="text-primary-container font-semibold">18%</span>
              </div>
              <div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary-container rounded" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface">Remote Job &amp; Escrow Task</span>
                <span className="text-tertiary-container font-semibold">12%</span>
              </div>
              <div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-tertiary-container rounded" style={{ width: '12%' }} />
              </div>
            </div>
          </div>

          {/* Top Threat Indicators Pills */}
          <div className="pt-3 border-t border-white/[0.04] space-y-2">
            <span className="font-label-instrument text-[10px] uppercase text-outline font-mono block">
              Top Syndicate Indicators:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-error-container/20 text-error border border-error/20">
                +92 / +880 foreign series
              </span>
              <span className="px-2 py-0.5 rounded bg-[#e8aa42]/20 text-[#e8aa42] border border-[#e8aa42]/20">
                -kyc-verify.cc domains
              </span>
              <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary border border-primary-container/20">
                Mule VPAs @okaxis
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

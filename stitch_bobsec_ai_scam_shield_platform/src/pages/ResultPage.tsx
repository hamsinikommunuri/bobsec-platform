import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskDial } from '../components/RiskDial';
import { AgentTraceView } from '../components/AgentTraceView';

export const ResultPage: React.FC = () => {
  const { currentAnalysis, setActiveTab, setActiveModal, submitFeedback } = useApp();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);

  if (!currentAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <span className="material-symbols-outlined text-5xl text-outline">radar</span>
        <h2 className="text-xl font-medium text-on-surface">No Active Forensic Analysis</h2>
        <p className="text-sm text-outline max-w-md">
          Please submit a message, link, phone number, or UPI ID on the Analyze console to view full threat diagnostics.
        </p>
        <button
          onClick={() => setActiveTab('analyze')}
          className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-white transition-all shadow-md"
        >
          Open Analyze Console
        </button>
      </div>
    );
  }

  const { verdict, redFlags, entities, agentTrace, metadata, input, recommendations } = currentAnalysis;
  const isHighRisk = verdict.score >= 70;
  const isCaution = verdict.score >= 45 && verdict.score < 70;

  const handleFeedback = async (rating: 'CORRECT' | 'INCORRECT' | 'UNSURE') => {
    const success = await submitFeedback(rating);
    if (success) {
      setFeedbackSubmitted(rating);
      setTimeout(() => setFeedbackSubmitted(null), 3500);
    }
  };

  const topDirectives = recommendations.slice(0, 2);

  return (
    <div className="flex flex-col w-full gap-10 max-w-[1240px] mx-auto px-4 lg:px-8 pt-4 pb-28">
      {/* TOP VERDICT COMPOSITION: Smoked Glass Chronometric Apparatus */}
      <section className="relative w-full rounded-xl bg-[#121418]/70 backdrop-blur-[48px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] border border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] bg-gradient-to-b from-white/[0.04] to-transparent" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Executive Verdict & Directives (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            {/* Micro-eyebrow telemetric header */}
            <div className="flex items-center gap-2 text-outline font-label-instrument text-xs uppercase tracking-widest">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isHighRisk ? 'bg-error animate-pulse' : isCaution ? 'bg-[#e8aa42]' : 'bg-tertiary-container'
                }`}
              />
              <span>TELEMETRY REF: #{currentAnalysis.id}</span>
              <span className="text-outline-variant">·</span>
              <span>ON-DEVICE ENCLAVE</span>
              <span className="text-outline-variant">·</span>
              <span className="text-tertiary-fixed-dim font-label-tabular font-mono">
                {metadata.processingTimeMs || 42}MS TRIAGE
              </span>
            </div>

            {/* Monumental Verdict Title */}
            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="font-headline-lg text-4xl sm:text-5xl font-normal text-on-surface tracking-tight flex items-center gap-3">
                <span
                  className={`inline-block w-3.5 h-3.5 rounded-full ${
                    isHighRisk
                      ? 'bg-[#f06063] shadow-[0_0_12px_#f06063]'
                      : isCaution
                      ? 'bg-[#e8aa42] shadow-[0_0_12px_#e8aa42]'
                      : 'bg-[#35c88a] shadow-[0_0_12px_#35c88a]'
                  }`}
                />
                {verdict.level.toUpperCase()}
              </h1>
              <span
                className={`font-label-instrument text-xs uppercase tracking-widest py-0.5 px-2.5 rounded border ${
                  isHighRisk
                    ? 'bg-error-container/20 text-error border-error/20'
                    : isCaution
                    ? 'bg-[#e8aa42]/15 text-[#e8aa42] border-[#e8aa42]/20'
                    : 'bg-tertiary-container/20 text-tertiary-fixed-dim border-tertiary-container/20'
                }`}
              >
                {isHighRisk
                  ? 'CRITICAL INTERVENTION REQUIRED'
                  : isCaution
                  ? 'ELEVATED SUSPICION · VERIFY OFFLINE'
                  : 'VERIFIED LOW RISK'}
              </span>
            </div>

            {/* Categorization */}
            <h2 className="font-title-lg text-lg text-secondary-fixed font-normal tracking-tight -mt-1">
              {verdict.categoryLabel}
            </h2>

            {/* Concise Diagnostic Statement */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {verdict.summary}
            </p>

            {/* Directives Strip: Clean, Borderless High-Contrast Insets */}
            {topDirectives.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {topDirectives.map((directive, dIdx) => (
                  <div
                    key={directive.id || dIdx}
                    className="flex-1 p-3.5 rounded-lg bg-surface-container-high/40 flex items-start gap-3 shadow-inner border border-white/[0.04]"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                        directive.type === 'DO_NOT' ? 'text-[#f06063]' : 'text-primary-fixed-dim'
                      }`}
                    >
                      {directive.type === 'DO_NOT' ? 'phonelink_erase' : 'security_update_warning'}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-instrument text-[11px] text-on-surface uppercase tracking-wider">
                        Protocol Directive 0{dIdx + 1}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant mt-0.5 leading-snug">
                        {directive.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Precision Horological Complication Dial (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <RiskDial score={verdict.score} confidence={verdict.confidence} level={verdict.level} />
          </div>
        </div>
      </section>

      {/* ASYMMETRIC DEEP FORENSIC STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN (7 cols): Evidentiary Artifact Deconstruction */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <span className="font-label-instrument text-xs uppercase tracking-widest text-on-surface">
                EVIDENTIARY ARTIFACT DECONSTRUCTION
              </span>
              <span className="font-label-tabular text-xs text-outline px-2 py-0.5 rounded bg-surface-container-low font-mono">
                {input.type} PAYLOAD
              </span>
            </div>
            <span className="font-label-instrument text-xs text-tertiary-fixed-dim uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[14px]">verified</span> HASH:{' '}
              {(metadata.reportHash || 'SEALED').slice(0, 8).toUpperCase()}
            </span>
          </div>


          {/* Obsidian Glass Tablet for Document Inspection */}
          <div className="relative rounded-xl bg-surface-container-lowest p-6 lg:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9)] border border-white/[0.05] overflow-hidden">
            {/* Subtle Grid watermark on artifact */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-high/20 via-transparent to-transparent pointer-events-none" />

            {/* Evidence Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                </div>
                <div>
                  <div className="font-label-tabular text-sm text-on-surface font-semibold tracking-wide">
                    {verdict.categoryLabel}
                  </div>
                  <div className="font-label-instrument text-[10px] text-outline uppercase font-mono">
                    PROVENANCE: UNTRUSTED CLIENT INBOUND
                  </div>
                </div>
              </div>
              <div
                className={`font-label-tabular text-xs px-2.5 py-1 rounded font-mono ${
                  isHighRisk
                    ? 'bg-error-container/20 text-error'
                    : isCaution
                    ? 'bg-[#e8aa42]/15 text-[#e8aa42]'
                    : 'bg-tertiary-container/20 text-tertiary-container'
                }`}
              >
                {isHighRisk ? 'FRAUD SIGNATURE DETECTED' : isCaution ? 'SUSPICIOUS INDICATORS' : 'CLEAN CONTROL'}
              </div>
            </div>

            {/* Evidence Body with Snippets */}
            <div className="pt-5 space-y-4 font-body-md text-on-surface leading-relaxed text-sm">
              <p className="p-3 rounded bg-surface-container-high/25 border border-white/[0.03] text-on-surface-variant font-mono text-xs leading-relaxed whitespace-pre-wrap">
                "{input.sanitizedText}"
              </p>
            </div>

            {/* Red Flag Details List */}
            {redFlags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-surface-container-highest/40 space-y-3">
                <span className="font-label-instrument text-[11px] text-outline uppercase tracking-wider block">
                  Identified Tactical Threat Vectors:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {redFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="p-3 rounded-lg bg-surface-container-low border border-white/[0.04] flex items-start gap-3"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                          flag.severity === 'CRITICAL' ? 'text-error' : 'text-[#e8aa42]'
                        }`}
                      >
                        warning
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-label-tabular text-sm font-medium text-on-surface">
                            {flag.title}
                          </span>
                          <span
                            className={`font-label-instrument text-[10px] uppercase font-mono px-1.5 py-0.2 rounded ${
                              flag.severity === 'CRITICAL'
                                ? 'bg-error/20 text-error'
                                : 'bg-[#e8aa42]/20 text-[#e8aa42]'
                            }`}
                          >
                            {flag.severity}
                          </span>
                        </div>
                        <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                          {flag.description}
                        </p>
                        {flag.evidenceSnippet && (
                          <div className="mt-1.5 font-mono text-[11px] text-primary-fixed-dim bg-surface-container/60 px-2 py-0.5 rounded inline-block">
                            Evidence: "{flag.evidenceSnippet}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Forensic Annotation Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col">
              <span className="font-label-instrument text-[10px] text-outline uppercase">COERCION LEVEL</span>
              <span
                className={`font-headline-md text-lg font-bold mt-1 leading-none ${
                  isHighRisk ? 'text-error' : 'text-on-surface'
                }`}
              >
                {isHighRisk ? 'HIGH' : isCaution ? 'MEDIUM' : 'LOW'}
              </span>
              <span className="font-label-tabular text-xs text-on-surface-variant mt-1 truncate">
                {isHighRisk ? 'Extreme pressure' : 'Nominal baseline'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col">
              <span className="font-label-instrument text-[10px] text-outline uppercase">SPOOFED VECTOR</span>
              <span className="font-headline-md text-lg font-bold text-on-surface mt-1 leading-none truncate">
                {verdict.category.replace('_', ' ')}
              </span>
              <span className="font-label-tabular text-xs text-on-surface-variant mt-1">Insignia match</span>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col">
              <span className="font-label-instrument text-[10px] text-outline uppercase">ENCLAVE SHIELD</span>
              <span className="font-headline-md text-lg font-bold text-tertiary-container mt-1 leading-none">
                ACTIVE
              </span>
              <span className="font-label-tabular text-xs text-on-surface-variant mt-1">100% On-Device</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Entity Matrix & Continuous Luminous Agent Rail */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          {/* Section 1: Precision Entity Intelligence Table */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-instrument text-xs uppercase tracking-widest text-on-surface">
                ENTITY TELEMETRY MATRIX
              </span>
              <span className="font-label-instrument text-xs text-outline uppercase font-mono">
                {entities.length} DETECTIONS
              </span>
            </div>

            <div className="rounded-xl bg-surface-container-low p-5 space-y-4 border border-white/[0.05]">
              {entities.length === 0 ? (
                <div className="text-center py-6 text-xs text-outline font-mono">
                  No extracted phone, UPI, or URL identifiers found.
                </div>
              ) : (
                entities.map((entity, eIdx) => {
                  const isSuspicious = entity.status === 'Suspicious';
                  return (
                    <div
                      key={eIdx}
                      className={`flex flex-col gap-1 ${
                        eIdx < entities.length - 1 ? 'pb-3 border-b border-surface-variant/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-instrument text-[10px] uppercase text-outline font-mono">
                          {entity.type} VECTOR
                        </span>
                        <span
                          className={`font-label-instrument text-[10px] uppercase flex items-center gap-1.5 font-mono ${
                            isSuspicious ? 'text-error' : 'text-outline'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSuspicious ? 'bg-[#f06063] shadow-[0_0_6px_#f06063]' : 'bg-outline'
                            }`}
                          />
                          {entity.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="font-label-tabular text-on-surface font-semibold text-sm font-mono truncate mr-2">
                          {entity.maskedValue}
                        </span>
                        <span className="font-body-md text-on-surface-variant text-xs truncate max-w-[50%]">
                          {entity.notes || 'Identified'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Continuous Luminous Agent Rail */}
          <AgentTraceView trace={agentTrace} totalPipelineMs={metadata.processingTimeMs} />
        </div>
      </div>

      {/* FLOATING SMOKED GLASS ACTION DOCK */}
      <div className="sticky bottom-6 z-40 w-full flex justify-center pt-4">
        <div className="flex flex-wrap items-center justify-center gap-3 p-2 rounded-xl bg-surface-container/85 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] border border-white/[0.08]">
          {/* Export Forensic Dossier */}
          <button
            onClick={() => setActiveModal('report')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-on-surface text-surface font-title-lg text-sm font-medium hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Export Forensic Dossier</span>
          </button>

          {/* Cybercrime 1930 Helper */}
          <button
            onClick={() => setActiveModal('report')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high/70 text-on-surface font-title-lg text-sm font-medium hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-container">assignment</span>
            <span>Cybercrime 1930 Draft</span>
          </button>

          {/* Feedback Buttons */}
          <div className="flex items-center gap-1 bg-surface-container-lowest/60 p-1 rounded-lg border border-white/[0.04]">
            <button
              onClick={() => handleFeedback('CORRECT')}
              className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                feedbackSubmitted === 'CORRECT' ? 'text-tertiary-container font-bold' : 'text-outline hover:text-on-surface'
              }`}
              title="Verdict Accurate"
            >
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span className="hidden sm:inline">Accurate</span>
            </button>
            <button
              onClick={() => handleFeedback('INCORRECT')}
              className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                feedbackSubmitted === 'INCORRECT' ? 'text-error font-bold' : 'text-outline hover:text-on-surface'
              }`}
              title="Verdict Inaccurate"
            >
              <span className="material-symbols-outlined text-[16px]">thumb_down</span>
              <span className="hidden sm:inline">Inaccurate</span>
            </button>
          </div>

          <div className="hidden sm:block w-px h-6 bg-surface-variant/40 mx-1" />

          {/* Quick Dial Link */}
          <a
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-outline hover:text-on-surface transition-colors font-label-tabular text-xs font-mono"
            href="tel:1930"
          >
            <span className="material-symbols-outlined text-[16px] text-error">call</span>
            <span>DIAL 1930</span>
          </a>
        </div>
      </div>
    </div>
  );
};

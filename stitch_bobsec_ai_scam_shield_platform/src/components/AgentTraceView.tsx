import React, { useState } from 'react';
import { AgentTraceNode } from '../../../shared/types/index.js';

interface AgentTraceViewProps {
  trace: AgentTraceNode[];
  totalPipelineMs?: number;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({ trace, totalPipelineMs }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const totalTime = totalPipelineMs || trace.reduce((acc, curr) => acc + curr.durationMs, 0);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-label-instrument text-label-instrument uppercase tracking-widest text-on-surface">
          OBSERVABILITY EXECUTION TRACE
        </span>
        <span className="font-label-tabular text-label-tabular text-outline uppercase font-mono">
          {totalTime} MS TOTAL PIPELINE
        </span>
      </div>

      <div className="relative rounded-xl bg-surface-container-low p-6 border border-white/[0.05]">
        {/* Continuous Vertical Cyan/Silver Luminous Beam */}
        <div className="absolute left-9 top-8 bottom-8 w-px bg-gradient-to-b from-primary-fixed-dim via-primary to-surface-variant/40 pointer-events-none" />

        <div className="space-y-6 relative">
          {trace.map((node, idx) => {
            const isExpanded = expandedIndex === idx;
            const hasWarnings = node.findings.some(
              (f) => f.toLowerCase().includes('high') || f.toLowerCase().includes('threat') || f.toLowerCase().includes('violation') || f.toLowerCase().includes('injection')
            );
            const dotColor = hasWarnings ? 'bg-error' : 'bg-primary-fixed-dim';
            const shadowColor = hasWarnings
              ? 'shadow-[0_0_10px_rgba(240,96,99,0.5)]'
              : 'shadow-[0_0_10px_rgba(116,212,232,0.4)]';

            return (
              <div
                key={idx}
                className="flex flex-col rounded-lg p-2 transition-colors hover:bg-surface-container-high/20 cursor-pointer"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-start gap-5">
                  {/* Node Icon */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 ${shadowColor}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <div className="font-label-tabular text-label-tabular text-on-surface font-medium">
                        {node.displayName || node.agentName}
                      </div>
                      <div className="font-body-md text-body-md text-outline text-xs">
                        {node.purpose || node.sanitizedInputSummary}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-label-tabular text-label-tabular font-mono text-xs ${
                          hasWarnings ? 'text-error' : 'text-tertiary-fixed-dim'
                        }`}
                      >
                        {hasWarnings ? 'Alert' : 'Done'} · {node.durationMs}ms
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="ml-11 mt-3 p-3 rounded bg-surface-container-highest/50 border border-white/[0.04] text-xs font-mono space-y-1.5 animate-fadeIn">
                    <div className="text-outline uppercase text-[10px] font-label-instrument">Agent Findings:</div>
                    <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                      {node.findings.map((f, fIdx) => (
                        <li key={fIdx} className="leading-relaxed">
                          {f}
                        </li>
                      ))}
                    </ul>
                    {node.sanitizedInputSummary && (
                      <div className="pt-2 border-t border-white/[0.04] text-[11px] text-outline">
                        Context: {node.sanitizedInputSummary}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

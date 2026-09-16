import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const HistoryPage: React.FC = () => {
  const { historyList, refreshHistory, loadAnalysisById, deleteAnalysisById, clearVaultHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'caution' | 'clear'>('all');

  useEffect(() => {
    let levelFilter: string | undefined;
    if (activeFilter === 'high') levelFilter = 'High Risk';
    else if (activeFilter === 'caution') levelFilter = 'Caution';
    else if (activeFilter === 'clear') levelFilter = 'Low Risk';

    refreshHistory({ search: searchTerm || undefined, level: levelFilter });
  }, [searchTerm, activeFilter, refreshHistory]);

  const handleExportCSV = () => {
    if (historyList.length === 0) return;
    const headers = ['ID', 'CreatedAt', 'InputType', 'ShortText', 'Score', 'Level', 'Category', 'ReportHash'];
    const rows = historyList.map((item) => [
      item.id,
      item.createdAt,
      item.inputType,
      `"${item.shortText.replace(/"/g, '""')}"`,
      item.score,
      item.level,
      item.categoryLabel,
      item.reportHash
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BobSec-Ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const highRiskCount = historyList.filter((i) => i.score >= 70).length;
  const cautionCount = historyList.filter((i) => i.score >= 20 && i.score < 70).length;
  const clearCount = historyList.filter((i) => i.score < 20).length;

  return (
    <div className="flex flex-col w-full max-w-[1240px] mx-auto px-4 lg:px-8 pt-4 pb-20">
      {/* Glow Anchor */}
      <div className="relative w-full">
        <div className="absolute -top-12 left-1/4 w-96 h-48 bg-primary-fixed-dim/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-24 right-1/3 w-80 h-36 bg-error/5 blur-[100px] pointer-events-none rounded-full" />

        {/* Screen Title & Monolithic Metadata Header */}
        <section className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed shadow-[0_0_8px_#8cebff]" />
              <span className="font-label-instrument text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                NODE ENCLAVE // AUDIT LEDGER
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-label-tabular text-xs text-outline font-mono">
                <span>VAULT INTEGRITY</span>
                <span className="text-tertiary-container">SHA-256 VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-1">
            <div>
              <h1 className="font-display-verdict text-3xl sm:text-4xl font-medium text-primary tracking-[-0.035em]">
                Audit Ledger
              </h1>
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-3xl mt-1 leading-relaxed">
                Chronological ledger of intercepted communications, analyzed threat vectors, and cryptographic incident
                hashes stored locally on this machine.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-end">
              <div className="flex flex-col items-end px-3 py-1.5 rounded-lg bg-surface-container/40 backdrop-blur-md border border-white/[0.04]">
                <span className="font-label-instrument text-[10px] uppercase text-outline">Hardware Signature</span>
                <span className="font-label-tabular text-xs text-on-surface tracking-wider font-mono">
                  ENCLAVE-882-BETA
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Instrument Control Ribbon */}
        <section className="mb-6">
          <div className="rounded-xl p-3 bg-surface-container-low/70 backdrop-blur-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] border border-white/[0.05] flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Rig */}
            <div className="relative w-full lg:w-96 flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter entities, VPA, digests, or fragments..."
                className="w-full h-10 pl-9 pr-14 bg-surface-container-lowest/80 text-on-surface placeholder:text-outline/70 rounded-lg text-sm font-body-md focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/[0.04] transition-all"
              />
              <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-label-instrument uppercase text-on-surface-variant tracking-wider font-mono">
                <span>⌘</span>
                <span>F</span>
              </div>
            </div>

            {/* Telemetry State Segmented Filters */}
            <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto p-1 rounded-lg bg-surface-container-lowest/60 border border-white/[0.03]">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all ${
                  activeFilter === 'all'
                    ? 'text-on-surface bg-surface-container font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="font-label-instrument uppercase tracking-wider">All Telemetry</span>
                <span className="font-label-tabular text-on-surface-variant font-mono">{historyList.length}</span>
              </button>

              <button
                onClick={() => setActiveFilter('high')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all ${
                  activeFilter === 'high'
                    ? 'text-on-surface bg-surface-container font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_8px_#ffb4ab]" />
                <span className="font-label-instrument uppercase tracking-wider">High Risk</span>
                <span className="font-label-tabular text-outline font-mono">{highRiskCount}</span>
              </button>

              <button
                onClick={() => setActiveFilter('caution')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all ${
                  activeFilter === 'caution'
                    ? 'text-on-surface bg-surface-container font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8AA42] shadow-[0_0_8px_#E8AA42]" />
                <span className="font-label-instrument uppercase tracking-wider">Cautionary</span>
                <span className="font-label-tabular text-outline font-mono">{cautionCount}</span>
              </button>

              <button
                onClick={() => setActiveFilter('clear')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all ${
                  activeFilter === 'clear'
                    ? 'text-on-surface bg-surface-container font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_8px_#6cf6b4]" />
                <span className="font-label-instrument uppercase tracking-wider">Verified Clear</span>
                <span className="font-label-tabular text-outline font-mono">{clearCount}</span>
              </button>
            </div>

            {/* Master Instrument Operations */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface text-xs font-medium transition-all border border-white/[0.04]"
                title="Download CSV"
              >
                <span className="material-symbols-outlined text-[16px] text-primary-container">download</span>
                <span className="font-label-instrument uppercase tracking-wider">Export CSV</span>
              </button>

              <button
                onClick={async () => {
                  if (window.confirm('Wipe entire SQLite forensic ledger?')) {
                    await clearVaultHistory();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-error-container/20 hover:bg-error-container/40 text-error text-xs font-medium transition-all border border-error/20"
                title="Wipe Ledger"
              >
                <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                <span className="font-label-instrument uppercase tracking-wider">Purge Vault</span>
              </button>
            </div>
          </div>
        </section>

        {/* The Master Ledger Surface */}
        <div className="w-full rounded-2xl bg-surface-container-low/60 backdrop-blur-[44px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] border border-white/[0.05] overflow-hidden flex flex-col">
          {/* Table Header Columns */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-high/40 text-on-surface-variant font-label-instrument text-[11px] uppercase tracking-[0.14em] border-b border-white/[0.04]">
            <div className="col-span-12 lg:col-span-5 flex items-center gap-2">
              <span>Incident Excerpt &amp; Source</span>
              <span className="text-outline">/</span>
              <span className="text-outline lowercase font-mono">pcap-stream</span>
            </div>
            <div className="col-span-6 lg:col-span-2">Verdict &amp; Score</div>
            <div className="col-span-6 lg:col-span-2">Threat Vector</div>
            <div className="hidden lg:block lg:col-span-2">Digest Hash</div>
            <div className="hidden lg:block lg:col-span-1 text-right">Actions</div>
          </div>

          {/* Rows Assemblage */}
          <div className="divide-y divide-white/[0.03] flex flex-col">
            {historyList.length === 0 ? (
              <div className="text-center py-16 text-outline font-mono text-sm">
                No analyses recorded in audit ledger. Run an analysis to log forensic indicators.
              </div>
            ) : (
              historyList.map((item) => {
                const isHigh = item.score >= 70;
                const isCaut = item.score >= 45 && item.score < 70;

                return (
                  <article
                    key={item.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors duration-150 hover:bg-surface-container-high/30 group cursor-pointer"
                    onClick={() => loadAnalysisById(item.id)}
                  >
                    {/* Col 1: Excerpt */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-label-tabular text-xs font-mono text-primary font-medium">
                          #{item.id}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline" />
                        <span className="font-label-instrument text-[10px] uppercase text-on-surface-variant tracking-wider">
                          {item.inputType}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-outline text-[10px] uppercase font-mono ml-auto lg:ml-0">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-body-md text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                        "{item.shortText}"
                      </p>
                    </div>

                    {/* Col 2: Verdict */}
                    <div className="col-span-6 lg:col-span-2 flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isHigh
                            ? 'bg-error shadow-[0_0_10px_#ffb4ab]'
                            : isCaut
                            ? 'bg-[#E8AA42] shadow-[0_0_10px_#E8AA42]'
                            : 'bg-tertiary-container shadow-[0_0_10px_#6cf6b4]'
                        }`}
                      />
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`font-label-tabular text-sm font-mono font-medium ${
                            isHigh ? 'text-error' : isCaut ? 'text-[#E8AA42]' : 'text-tertiary-container'
                          }`}
                        >
                          {item.score}
                        </span>
                        <span className="font-label-instrument text-[10px] uppercase tracking-widest text-on-surface-variant">
                          {item.level.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Col 3: Category */}
                    <div className="col-span-6 lg:col-span-2 flex items-center">
                      <span className="font-body-md text-xs text-on-surface font-medium truncate">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Col 4: Hash */}
                    <div className="hidden lg:flex lg:col-span-2 items-center gap-1 text-outline font-mono text-[11px]">
                      <span className="truncate">{item.reportHash.slice(0, 16)}...</span>
                    </div>

                    {/* Col 5: Actions */}
                    <div className="hidden lg:flex lg:col-span-1 items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysisById(item.id);
                        }}
                        className="p-1 rounded text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                        title="Delete from ledger"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                        chevron_right
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

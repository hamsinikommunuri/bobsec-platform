import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api, ReportResponse } from '../services/api';

export const ReportModal: React.FC = () => {
  const { currentAnalysis, activeModal, setActiveModal } = useApp();
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied-summary' | 'copied-draft'>('idle');
  const [activeTab, setActiveTab] = useState<'brief' | 'cybercrime'>('brief');

  useEffect(() => {
    if (activeModal === 'report' && currentAnalysis) {
      setLoading(true);
      api
        .generateReport(currentAnalysis.id)
        .then(setReportData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeModal, currentAnalysis]);

  if (activeModal !== 'report' || !currentAnalysis) return null;

  const handleCopySummary = async () => {
    if (!reportData) return;
    await navigator.clipboard.writeText(reportData.textSummary);
    setCopyStatus('copied-summary');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleCopyCybercrimeDraft = async () => {
    if (!reportData) return;
    const draft = reportData.cybercrimeDraft;
    const text = `NATIONAL CYBERCRIME REPORT DRAFT (1930 HELPER)
Incident ID: ${draft.incidentId}
Timestamp: ${draft.timestamp}
Category: ${draft.scamCategory}
Severity: ${draft.severity}

INCIDENT SUMMARY:
${draft.incidentSummary}

SUSPECT IDENTIFIERS:
• Phone Number(s): ${draft.phoneNumbers.join(', ') || 'N/A'}
• UPI ID(s): ${draft.upiIds.join(', ') || 'N/A'}
• URL(s): ${draft.urls.join(', ') || 'N/A'}
• Demanded Amount: ${draft.amounts.join(', ') || 'N/A'}

EVIDENCE PAYLOAD:
"${draft.evidenceText}"

RECOMMENDED ACTION:
${draft.recommendedOfficialAction}

Official Helpline: 1930 | Portal: https://cybercrime.gov.in`;

    await navigator.clipboard.writeText(text);
    setCopyStatus('copied-draft');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownload = () => {
    if (!reportData) return;
    const blob = new Blob([reportData.textSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BobSec-Report-${currentAnalysis.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-xl bg-surface-container-low border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-surface-container/60">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary-container">description</span>
            <div>
              <h3 className="font-title-lg text-base font-semibold text-primary">
                Forensic Incident Briefing &amp; Evidence Vault
              </h3>
              <div className="flex items-center gap-2 font-label-tabular text-xs text-outline">
                <span>REF: {currentAnalysis.id}</span>
                <span>·</span>
                <span className="font-mono text-[10px] text-tertiary-fixed-dim">
                  HASH: {(currentAnalysis.metadata.reportHash || 'SEALED').slice(0, 16)}...
                </span>
              </div>

            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-4 border-b border-white/[0.04]">
          <button
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 font-label-tabular text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'brief'
                ? 'border-primary-container text-primary font-medium'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            Forensic Dossier Summary
          </button>
          <button
            onClick={() => setActiveTab('cybercrime')}
            className={`pb-2.5 font-label-tabular text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'cybercrime'
                ? 'border-primary-container text-primary font-medium'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            Cybercrime 1930 Helper Draft
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-outline">
              <span className="material-symbols-outlined text-[32px] animate-spin text-primary-container">
                progress_activity
              </span>
              <span>Sealing cryptographic evidence record...</span>
            </div>
          ) : reportData ? (
            activeTab === 'brief' ? (
              <pre className="p-4 rounded-lg bg-surface-container-lowest text-on-surface whitespace-pre-wrap font-mono text-xs selection:bg-primary-container selection:text-on-primary-container border border-white/[0.03]">
                {reportData.textSummary}
              </pre>
            ) : (
              <div className="space-y-4 font-sans text-on-surface">
                <div className="p-4 rounded-lg bg-surface-container-highest/30 border border-white/[0.05] space-y-2">
                  <div className="flex items-center gap-2 text-error font-semibold text-sm">
                    <span className="material-symbols-outlined text-[18px]">emergency</span>
                    <span>National Cybercrime Helpline: Call 1930</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    If you have transferred funds or shared banking credentials, report immediately within the "Golden
                    Hour" at <strong>1930</strong> or on <strong>cybercrime.gov.in</strong> to freeze illicit account
                    transactions.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-container-lowest border border-white/[0.03] space-y-3 font-mono text-xs">
                  <div className="flex justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-outline uppercase">Incident ID:</span>
                    <span className="text-primary font-semibold">{reportData.cybercrimeDraft.incidentId}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-outline uppercase">Suspect Category:</span>
                    <span className="text-primary">{reportData.cybercrimeDraft.scamCategory}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-outline uppercase">Suspect Originator:</span>
                    <span className="text-error">{reportData.cybercrimeDraft.suspiciousSender}</span>
                  </div>
                  <div>
                    <span className="text-outline uppercase block mb-1">Pre-Structured Incident Narrative:</span>
                    <p className="p-2.5 rounded bg-surface-container-high/40 text-on-surface-variant leading-relaxed">
                      {reportData.cybercrimeDraft.incidentSummary}
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-outline">No report data available.</div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-surface-container-lowest border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-outline font-label-tabular text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-tertiary-container">verified</span>
            <span>Zero Cloud Leak · Report Sealed Locally</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'brief' ? (
              <>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copyStatus === 'copied-summary' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copyStatus === 'copied-summary' ? 'Copied Brief' : 'Copy Brief'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-white transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download .TXT</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleCopyCybercrimeDraft}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container/40 text-error hover:bg-error-container/60 text-xs font-medium transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copyStatus === 'copied-draft' ? 'check' : 'assignment'}
                </span>
                <span>{copyStatus === 'copied-draft' ? 'Copied 1930 Draft' : 'Copy Formatted 1930 Draft'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

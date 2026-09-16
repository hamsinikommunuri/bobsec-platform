import React from 'react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    saveToHistory,
    setSaveToHistory,
    clearVaultHistory,
    config,
    historyList
  } = useApp();

  if (activeModal !== 'settings') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl bg-surface-container-low border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-surface-container/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary-container text-[20px]">tune</span>
            <h3 className="font-title-lg text-base font-semibold text-primary">Hardware Enclave &amp; Ledger Settings</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Privacy Option */}
          <div className="p-4 rounded-lg bg-surface-container-lowest border border-white/[0.04] flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <div className="font-semibold text-on-surface text-sm">Do not save my analyses (Incognito Mode)</div>
              <div className="text-xs text-outline leading-relaxed">
                When enabled, analyses are processed in ephemeral memory without saving records to the local SQLite audit
                ledger.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!saveToHistory}
                onChange={(e) => setSaveToHistory(!e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>

          {/* AI Subsystem Diagnostics */}
          <div className="p-4 rounded-lg bg-surface-container-lowest border border-white/[0.04] space-y-2 text-xs font-mono">
            <div className="text-outline uppercase text-[10px] font-label-instrument">Subsystem Telemetry</div>
            <div className="flex justify-between text-on-surface">
              <span>Environment Mode:</span>
              <span className="text-tertiary-fixed-dim uppercase">{config?.demoMode ? 'Demo / Offline' : 'Live'}</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>AI Provider Engine:</span>
              <span className="text-primary uppercase">{config?.aiProvider || 'MockAIProvider'}</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>Active Ledger Entries:</span>
              <span className="text-on-surface font-semibold">{historyList.length}</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>Jurisdiction Target:</span>
              <span className="text-outline">Republic of India (+91 / UPI / IN)</span>
            </div>
          </div>

          {/* Ledger Purge Action */}
          <div className="p-4 rounded-lg bg-error-container/10 border border-error/20 flex items-center justify-between">
            <div>
              <div className="font-semibold text-error text-xs uppercase tracking-wider font-label-instrument">
                Purge Security Ledger
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                Permanently wipes all SQLite forensic entries from this device.
              </div>
            </div>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to purge all local analysis records? This cannot be undone.')) {
                  await clearVaultHistory();
                  setActiveModal(null);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-error-container/30 hover:bg-error-container/50 text-error text-xs font-medium transition-colors"
            >
              Purge All
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-lowest border-t border-white/[0.06] flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-medium transition-colors"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

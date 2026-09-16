import React from 'react';
import { useApp, ActiveNavTab } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentAnalysis, setActiveModal } = useApp();

  const navItems: { id: ActiveNavTab; label: string; icon: string; enabled?: boolean }[] = [
    { id: 'analyze', label: 'Analyze Console', icon: 'radar' },
    { id: 'result', label: 'Forensic Inspection', icon: 'verified_user', enabled: !!currentAnalysis },
    { id: 'history', label: 'Security Ledger', icon: 'history' },
    { id: 'intelligence', label: 'Threat Matrix', icon: 'analytics' }
  ];

  return (
    <aside className="fixed left-5 top-5 bottom-5 w-20 z-50 rounded-xl flex flex-col items-center justify-between py-5 bg-surface-container-low/70 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] border border-white/[0.05]">
      {/* Top Brand Monogram */}
      <div className="flex flex-col items-center w-full">
        <button
          onClick={() => setActiveTab('analyze')}
          className="w-10 h-10 rounded-lg p-1 bg-surface-container-high/60 flex items-center justify-center shadow-inner hover:scale-105 transition-transform"
          title="BobSec Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-8 h-8 object-contain"
            fill="none"
          >
            <rect width="48" height="48" rx="12" fill="#0D1119" />
            <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#4F7CFF" strokeOpacity="0.35" />
            <path
              d="M15 12H25.5C28.5376 12 31 14.4624 31 17.5C31 20.5376 28.5376 23 25.5 23H15V12Z"
              stroke="#F4F7FB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 23H27C30.3137 23 33 25.6863 33 29C33 32.3137 30.3137 35 27 35H15V23Z"
              stroke="#F4F7FB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="15" y1="12" x2="15" y2="35" stroke="#4F7CFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="27" cy="29" r="2" fill="#4F7CFF" />
            <circle cx="25.5" cy="17.5" r="1.5" fill="#35C88A" />
          </svg>
        </button>
        <span className="font-label-instrument text-label-instrument uppercase text-outline tracking-widest mt-2 scale-90 select-none">
          BOBSEC
        </span>
      </div>

      {/* Navigation Rail */}
      <nav className="flex flex-col items-center gap-4 w-full px-2.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isDisabled = item.enabled === false;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setActiveTab(item.id)}
              disabled={isDisabled}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                isActive
                  ? 'bg-surface-container-high text-primary shadow-[0_0_12px_rgba(116,212,232,0.25)] border border-primary/20'
                  : isDisabled
                  ? 'text-outline/40 cursor-not-allowed'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-primary-container shadow-[0_0_8px_#8cebff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Auxiliary Modals */}
      <div className="flex flex-col items-center gap-4 w-full px-2.5">
        <div className="group relative flex items-center justify-center cursor-help" title="Hardware Enclave Active">
          <div className="w-2 h-2 rounded-full bg-tertiary-container shadow-[0_0_8px_#6cf6b4] animate-pulse" />
        </div>

        <button
          onClick={() => setActiveModal('help')}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 transition-colors"
          title="System Manual"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        <button
          onClick={() => setActiveModal('settings')}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 transition-colors"
          title="Hardware Enclave Settings"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>

        <div className="p-0.5 rounded-full bg-surface-container-highest">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">security</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

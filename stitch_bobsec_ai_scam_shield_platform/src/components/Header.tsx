import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { language, setLanguage, config } = useApp();

  return (
    <header className="h-16 w-full pr-14 pl-4 flex items-center justify-between border-b border-white/[0.04] bg-[#0d0e0f]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Hierarchy Path */}
      <div className="flex items-center gap-2">
        <span className="font-label-instrument text-label-instrument uppercase text-on-surface tracking-widest">
          {config?.name || 'BOBSEC'} INSTRUMENT
        </span>
        <span className="font-label-instrument text-label-instrument text-outline">/</span>
        <span className="font-label-instrument text-label-instrument uppercase text-on-surface-variant tracking-wider">
          PRECISION SCAM SHIELD
        </span>
      </div>

      {/* Badges & Internationalization */}
      <div className="flex items-center gap-4">
        {/* Zero Cloud Leak Enclave Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container/60 backdrop-blur-md border border-white/[0.05]">
          <span className="material-symbols-outlined text-[14px] text-tertiary-container">lock</span>
          <span className="font-label-tabular text-label-tabular text-on-surface-variant uppercase tracking-wider">
            {config?.demoMode ? 'Local Sovereign Enclave · Demo Active' : 'Zero Cloud Leak · Enclave Protected'}
          </span>
        </div>

        {/* Language Selector EN / HI */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface-container-low border border-white/[0.06]">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded text-xs font-label-tabular transition-all ${
              language === 'en'
                ? 'bg-surface-container-high text-primary font-medium shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            EN
          </button>
          <span className="text-outline/40 px-0.5 text-xs">/</span>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded text-xs font-label-tabular transition-all ${
              language === 'hi'
                ? 'bg-surface-container-high text-primary font-medium shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            HI (हिंदी)
          </button>
        </div>
      </div>
    </header>
  );
};

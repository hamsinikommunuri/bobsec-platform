import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { InputType, ThreatArchetypeSample } from '../../../shared/types/index.js';



export const AnalyzePage: React.FC = () => {
  const { runAnalysis, isAnalyzing, analysisError, samples, language } = useApp();
  const [inputText, setInputText] = useState(
    'URGENT NOTICE: Telecom Department & Mumbai Cyber Crime have flagged your SIM card (98201-XXXXX) for illegal broadcasting and financial fraud. Case ID: MH/CB/8492. Your number and Aadhaar-linked accounts will be deactivated in 90 minutes. Connect immediately with Inspector Vikram Rathore on Skype for mandatory statement recording. Do not disconnect or inform third parties.'
  );
  const [selectedMode, setSelectedMode] = useState<InputType>('MESSAGE');

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to analyze
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (inputText.trim() && !isAnalyzing) {
          runAnalysis(inputText, selectedMode);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, isAnalyzing, selectedMode, runAnalysis]);

  const handleSelectSample = (sample: ThreatArchetypeSample) => {
    setInputText(sample.sampleText);
    setSelectedMode(sample.inputType);
  };

  const handleRun = () => {
    if (!inputText.trim()) return;
    runAnalysis(inputText, selectedMode);
  };

  const modeTabs: { mode: InputType; label: string; icon: string }[] = [
    { mode: 'MESSAGE', label: 'Message', icon: 'chat' },
    { mode: 'URL', label: 'Link / URL', icon: 'link' },
    { mode: 'PHONE', label: 'Phone', icon: 'call' },
    { mode: 'UPI', label: 'UPI ID / VPA', icon: 'account_balance_wallet' }
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* Background Ambient Radial Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1100px] h-[720px] rounded-full bg-gradient-to-b from-primary-fixed-dim/5 via-primary-container/[0.015] to-transparent blur-3xl -z-10" />

      <div className="w-full max-w-[1180px] mx-auto px-4 lg:px-8 pt-6 pb-20 flex flex-col items-center">
        {/* Hero Title & Eyebrow */}
        <div className="w-full max-w-[920px] flex flex-col items-start mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_8px_#6cf6b4]" />
            <span className="font-label-instrument text-label-instrument uppercase tracking-[0.2em] text-on-surface-variant">
              Sovereign Heuristic Core · Level 4 Forensics
            </span>
            <span className="text-outline-variant font-label-tabular text-label-tabular">/</span>
            <span className="font-label-tabular text-label-tabular text-outline uppercase tracking-wider font-mono">
              Zero Cloud Leak
            </span>
          </div>

          <h1 className="font-display-verdict text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-primary via-on-surface to-outline tracking-tight pb-2 font-medium">
            {language === 'hi' ? 'क्या यह कोई धोखाधड़ी (स्कैम) है?' : 'Is this a scam?'}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[65ch] mt-1 leading-relaxed">
            {language === 'hi'
              ? 'संदेहास्पद संदेश, बैंक नोटिस, डिजिटल अरेस्ट समन या यूपीआई भुगतान लिंक को पेस्ट करें। बॉबसेक का ऑन-डिवाइस इंजन तुरंत सुरक्षा जांच करेगा।'
              : 'Submit suspicious messages, payment demands, or authority communications to BobSec’s local forensic engine. Zero data leaves your device.'}
          </p>
        </div>

        {/* Forensic Input Console Card */}
        <div className="w-full max-w-[920px] rounded-xl bg-[#101216]/75 backdrop-blur-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.95)] border border-white/[0.06]">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Mode Selector Ribbon */}
          <div className="px-7 pt-5 pb-3 flex flex-wrap items-center justify-between border-b border-white/[0.06] gap-4">
            <div className="flex items-center gap-6">
              {modeTabs.map((tab) => {
                const isActive = selectedMode === tab.mode;
                return (
                  <button
                    key={tab.mode}
                    onClick={() => setSelectedMode(tab.mode)}
                    className={`relative pb-2 font-label-tabular text-xs tracking-wider uppercase flex items-center gap-2 transition-colors ${
                      isActive ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isActive ? 'text-primary-container' : 'text-outline'
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-primary-container shadow-[0_0_10px_#8cebff]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 font-label-instrument uppercase tracking-wider text-outline">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container/80 animate-pulse" />
                <span>Enclave Protected</span>
              </div>
              <span className="text-outline-variant">|</span>
              <span className="font-label-tabular text-on-surface-variant tabular-nums tracking-wider font-mono">
                {inputText.length} CHARS
              </span>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="p-7 relative min-h-[200px]">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-44 bg-transparent resize-none border-none outline-none font-body-lg text-body-lg text-primary selection:bg-primary-container selection:text-on-primary-container leading-relaxed placeholder:text-outline/40 tracking-[-0.01em]"
              placeholder="Paste extortion notices, suspicious URLs, or impersonation scripts here..."
              spellCheck="false"
            />

            {/* Micro Beacon Indicator */}
            {inputText.length > 50 && (
              <div className="absolute right-7 top-7 pointer-events-none hidden sm:flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-highest/60 backdrop-blur-md shadow-sm border border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_6px_#ffb4ab] animate-pulse" />
                  <span className="font-label-instrument text-[10px] tracking-widest text-error uppercase font-semibold">
                    Payload Loaded
                  </span>
                </div>
                <span className="font-label-instrument text-[10px] text-outline tracking-wider font-mono">
                  Input Ready for Triage
                </span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="px-7 py-4 bg-surface-container-lowest/50 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-on-surface-variant font-label-tabular">
              <button
                onClick={() => setInputText('')}
                className="hover:text-primary transition-colors flex items-center gap-1.5 text-outline"
                title="Clear input"
              >
                <span className="material-symbols-outlined text-[16px]">backspace</span>
                <span>Clear</span>
              </button>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <div className="flex items-center gap-1.5 text-outline">
                <span className="material-symbols-outlined text-[15px]">translate</span>
                <span>Auto-Detect Jurisdiction</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block" />
              <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-tertiary-container">shield</span>
                <span>Zero-Cloud Transmission</span>
              </div>
            </div>

            <button
              onClick={handleRun}
              disabled={isAnalyzing || !inputText.trim()}
              className="relative group flex items-center gap-3 px-6 py-3 rounded-lg bg-[#181a1e] hover:bg-[#202328] active:bg-[#15171a] text-primary transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary-container/60 to-transparent" />
              <span className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[18px] text-primary-container ${
                    isAnalyzing ? 'animate-spin' : 'group-hover:scale-110 transition-transform duration-200'
                  }`}
                >
                  {isAnalyzing ? 'progress_activity' : 'radar'}
                </span>
              </span>
              <span className="font-title-lg text-[14px] font-medium tracking-tight text-primary">
                {isAnalyzing ? 'Running Forensic Core...' : 'Run Forensic Analysis'}
              </span>
              <span className="font-label-instrument text-[10px] tracking-wider text-outline px-1.5 py-0.5 rounded bg-surface-container-high/80 font-mono">
                ⌘↵
              </span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {analysisError && (
          <div className="w-full max-w-[920px] mt-4 p-4 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined">warning</span>
            <span>{analysisError}</span>
          </div>
        )}

        {/* Threat Archetypes Header */}
        <div className="w-full max-w-[920px] mt-14 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="w-1 h-3 rounded-full bg-primary-container" />
            <span className="font-label-instrument text-label-instrument uppercase tracking-[0.2em] text-on-surface-variant">
              Select Preset Threat Archetype
            </span>
          </div>
          <span className="font-label-tabular text-label-tabular text-outline font-mono">
            Indian Cybercrime Registry · Q1 2025
          </span>
        </div>

        {/* Threat Archetypes List */}
        <div className="w-full max-w-[920px] mt-3 flex flex-col divide-y divide-white/[0.05] border-t border-b border-white/[0.05]">
          {samples.map((sample, idx) => {
            const indexNumber = String(idx + 1).padStart(2, '0');
            const isBenign = sample.category === 'BENIGN';

            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="group cursor-pointer py-4 px-3 flex items-center justify-between hover:bg-surface-container/30 rounded-lg transition-all"
              >
                <div className="flex items-baseline gap-5 pr-4 min-w-0">
                  <span className="font-label-instrument text-label-instrument text-primary-container font-mono tracking-wider shrink-0">
                    {indexNumber}
                  </span>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 min-w-0">
                    <span className="font-title-lg text-[15px] text-primary whitespace-nowrap tracking-tight font-medium">
                      {sample.title}
                    </span>
                    <span className="font-body-md text-body-md text-outline group-hover:text-on-surface-variant transition-colors truncate">
                      "{sample.shortDescription}"
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-2">
                  <span
                    className={`hidden md:inline-block font-label-instrument text-[10px] uppercase tracking-widest ${
                      isBenign ? 'text-tertiary-container' : 'text-error'
                    }`}
                  >
                    {sample.severityLabel}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

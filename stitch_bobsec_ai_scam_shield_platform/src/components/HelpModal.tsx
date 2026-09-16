import React from 'react';
import { useApp } from '../context/AppContext';

export const HelpModal: React.FC = () => {
  const { activeModal, setActiveModal } = useApp();

  if (activeModal !== 'help') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-xl bg-surface-container-low border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-surface-container/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary-container text-[20px]">menu_book</span>
            <h3 className="font-title-lg text-base font-semibold text-primary">BobSec System Manual &amp; Directives</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-on-surface-variant leading-relaxed">
          <div>
            <h4 className="font-semibold text-on-surface mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-container" />
              What is BobSec?
            </h4>
            <p>
              BobSec is a sovereign AI-powered scam shield engineered specifically for Indian telecommunications and
              financial environments. It analyzes suspicious SMS, WhatsApp notices, UPI collect requests, job pitches,
              and digital arrest extortion without transferring your private data to foreign clouds.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-on-surface mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              Multi-Agent Architecture
            </h4>
            <p>
              BobSec employs 8 specialized decoupled agents in strict sequence:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs font-mono text-outline">
              <li>Agent 1 — PromptFirewall: Sanitizes untrusted content &amp; thwarts instruction overrides.</li>
              <li>Agent 2 — ScamAgent: Deconstructs fear, urgency, and extracts entities (URLs, VPAs, phones).</li>
              <li>Agent 3 — IntelAgent: Evaluates domain syntax, spoofed series, and VPA keywords locally.</li>
              <li>Agent 4 — ConsumerAgent: Formulates calm, defensive directives for everyday citizens.</li>
              <li>Agent 5 — BankSideAgent: Checks banking OTP/PIN traps and remote screen-sharing threats.</li>
              <li>Agent 6 — ExplainerAgent: Synthesizes multilingual explanations (EN / HI).</li>
              <li>Agent 7 — PolicyCheckAgent: Guarantees calibrated risk language &amp; disclaimers.</li>
              <li>Agent 8 — FeedbackAgent: Records telemetry feedback into offline audit queues.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-on-surface mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error" />
              Official Indian Reporting Helplines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-surface-container-high/40 border border-white/[0.04]">
                <div className="text-primary font-semibold">National Cybercrime Helpline</div>
                <div className="text-error font-bold text-base mt-0.5">1930 (Toll-Free 24x7)</div>
                <div className="text-outline mt-1">For immediate financial fraud reporting.</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/40 border border-white/[0.04]">
                <div className="text-primary font-semibold">DoT Chakshu Portal</div>
                <div className="text-on-surface mt-0.5">sancharsaathi.gov.in/sfc</div>
                <div className="text-outline mt-1">For reporting suspected fraudulent SMS and calls.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-lowest border-t border-white/[0.06] flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-medium transition-colors"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { ReportModal } from './components/ReportModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen selection:bg-primary selection:text-on-primary font-sans relative">
      {/* Desktop & Tablet Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Presentation Surface */}
      <div className="pl-28 min-h-screen flex flex-col">
        <Header />

        <main className="w-full flex-1 pt-4 pb-14 pr-4 sm:pr-8 pl-2">
          {activeTab === 'analyze' && <AnalyzePage />}
          {activeTab === 'result' && <ResultPage />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'intelligence' && <IntelligencePage />}
        </main>
      </div>

      {/* Auxiliary Modals */}
      <ReportModal />
      <HelpModal />
      <SettingsModal />
    </div>
  );
};

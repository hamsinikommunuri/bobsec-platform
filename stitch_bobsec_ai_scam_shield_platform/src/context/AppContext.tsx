import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AnalysisResult,
  AnalysisSummaryItem,
  InputType,
  Language,
  ThreatArchetypeSample
} from '../../../shared/types/index.js';
import { api, AnalysisStats, PublicConfig } from '../services/api';

export type ActiveNavTab = 'analyze' | 'result' | 'history' | 'intelligence';
export type ActiveModal = 'report' | 'help' | 'settings' | null;

interface AppContextType {
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  isAnalyzing: boolean;
  analysisError: string | null;
  historyList: AnalysisSummaryItem[];
  stats: AnalysisStats | null;
  samples: ThreatArchetypeSample[];
  config: PublicConfig | null;
  saveToHistory: boolean;
  setSaveToHistory: (save: boolean) => void;
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
  runAnalysis: (content: string, type?: InputType) => Promise<AnalysisResult | null>;
  loadAnalysisById: (id: string) => Promise<void>;
  deleteAnalysisById: (id: string) => Promise<void>;
  clearVaultHistory: () => Promise<void>;
  refreshHistory: (filter?: { search?: string; level?: string }) => Promise<void>;
  refreshStats: () => Promise<void>;
  submitFeedback: (rating: 'CORRECT' | 'INCORRECT' | 'UNSURE', comment?: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('analyze');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<AnalysisSummaryItem[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [samples, setSamples] = useState<ThreatArchetypeSample[]>([]);
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const refreshHistory = useCallback(async (filter?: { search?: string; level?: string }) => {
    try {
      const items = await api.getAnalyses(filter);
      setHistoryList(items);
    } catch (err) {
      console.error('Failed to fetch analysis history', err);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    api.getConfig().then(setConfig).catch(console.error);
    api.getSamples().then(setSamples).catch(console.error);
    refreshHistory();
    refreshStats();
  }, [refreshHistory, refreshStats]);

  const runAnalysis = async (content: string, type: InputType = 'MESSAGE'): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await api.analyze({
        content,
        type,
        language,
        saveToHistory
      });
      setCurrentAnalysis(result);
      setActiveTab('result');
      if (saveToHistory) {
        refreshHistory();
        refreshStats();
      }
      return result;
    } catch (err: any) {
      const message = err.message || 'Analysis could not be completed';
      setAnalysisError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAnalysisById = async (id: string) => {
    try {
      const result = await api.getAnalysisById(id);
      setCurrentAnalysis(result);
      setActiveTab('result');
    } catch (err: any) {
      console.error(`Failed to load analysis ${id}`, err);
    }
  };

  const deleteAnalysisById = async (id: string) => {
    try {
      await api.deleteAnalysis(id);
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
        setActiveTab('history');
      }
      await refreshHistory();
      await refreshStats();
    } catch (err: any) {
      console.error(`Failed to delete analysis ${id}`, err);
    }
  };

  const clearVaultHistory = async () => {
    try {
      await api.clearVault();
      setCurrentAnalysis(null);
      setHistoryList([]);
      await refreshStats();
    } catch (err: any) {
      console.error('Failed to clear vault history', err);
    }
  };

  const submitFeedback = async (
    rating: 'CORRECT' | 'INCORRECT' | 'UNSURE',
    comment?: string
  ): Promise<boolean> => {
    if (!currentAnalysis) return false;
    try {
      const res = await api.submitFeedback(currentAnalysis.id, { rating, comment });
      return res.saved;
    } catch (err) {
      console.error('Failed to submit feedback', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isAnalyzing,
        analysisError,
        historyList,
        stats,
        samples,
        config,
        saveToHistory,
        setSaveToHistory,
        activeModal,
        setActiveModal,
        runAnalysis,
        loadAnalysisById,
        deleteAnalysisById,
        clearVaultHistory,
        refreshHistory,
        refreshStats,
        submitFeedback
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

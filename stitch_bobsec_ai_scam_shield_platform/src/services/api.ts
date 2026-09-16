import {
  AnalysisResult,
  AnalysisSummaryItem,
  InputType,
  Language,
  ThreatArchetypeSample,
  CybercrimeDraftReport
} from '../../../shared/types/index.js';

export interface AnalysisStats {
  total: number;
  highRisk: number;
  caution: number;
  clear: number;
  categoryBreakdown: Record<string, number>;
}

export interface PublicConfig {
  brand: string;
  name: string;
  subtitle: string;
  version: string;
  demoMode: boolean;
  aiProvider: string;
  supportedLanguages: string[];
  supportedInputs: string[];
  helpline1930: string;
  riskLevels: string[];
  enclaveStatus: string;
}

export interface ReportResponse {
  textSummary: string;
  formattedSummary: string;
  cybercrimeDraft: CybercrimeDraftReport;
  analysisId: string;
  reportHash: string;
}

const API_BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    const message = json.error?.message || `HTTP ${res.status}: Failed request`;
    throw new Error(message);
  }
  return json.data as T;
}

export const api = {
  async analyze(payload: {
    content: string;
    type?: InputType;
    language?: Language;
    saveToHistory?: boolean;
  }): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<AnalysisResult>(res);
  },

  async getAnalyses(filter?: { search?: string; level?: string }): Promise<AnalysisSummaryItem[]> {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.level) params.append('level', filter.level);
    const qs = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE}/analyses${qs}`);
    return handleResponse<AnalysisSummaryItem[]>(res);
  },

  async getAnalysisById(id: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`);
    return handleResponse<AnalysisResult>(res);
  },

  async deleteAnalysis(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const data = await handleResponse<{ deleted: boolean }>(res);
    return data.deleted;
  },

  async clearVault(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/analyses`, {
      method: 'DELETE'
    });
    const data = await handleResponse<{ cleared: boolean }>(res);
    return data.cleared;
  },

  async submitFeedback(
    analysisId: string,
    feedback: { rating: 'CORRECT' | 'INCORRECT' | 'UNSURE'; comment?: string }
  ): Promise<{ saved: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(analysisId)}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    return handleResponse<{ saved: boolean; message: string }>(res);
  },

  async getSamples(): Promise<ThreatArchetypeSample[]> {
    const res = await fetch(`${API_BASE}/samples`);
    return handleResponse<ThreatArchetypeSample[]>(res);
  },

  async generateReport(analysisId: string): Promise<ReportResponse> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId })
    });
    return handleResponse<ReportResponse>(res);
  },

  async getStats(): Promise<AnalysisStats> {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse<AnalysisStats>(res);
  },

  async getConfig(): Promise<PublicConfig> {
    const res = await fetch(`${API_BASE}/config/public`);
    return handleResponse<PublicConfig>(res);
  }
};

import { AnalysisResult, AnalysisSummaryItem, UserFeedback } from '../../../shared/types/index.js';

export interface AnalysisStats {
  total: number;
  highRisk: number;
  caution: number;
  clear: number;
  categoryBreakdown: Record<string, number>;
}

export interface IAnalysisRepository {
  save(analysis: AnalysisResult): Promise<void>;
  getById(id: string): Promise<AnalysisResult | null>;
  list(filter?: { search?: string; level?: string }): Promise<AnalysisSummaryItem[]>;
  delete(id: string): Promise<boolean>;
  clearAll(): Promise<void>;
  saveFeedback(feedback: UserFeedback): Promise<void>;
  getFeedback(analysisId: string): Promise<UserFeedback | null>;
  getStats(): Promise<AnalysisStats>;
}

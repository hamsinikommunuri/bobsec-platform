import { ScamCategory, RiskLevel, RedFlag } from '../../../shared/types/index.js';

export interface AIAnalysisPromptInput {
  text: string;
  categoryHint: ScamCategory;
  detectedFlags: string[];
}

export interface AIAnalysisOutput {
  refinedCategory: ScamCategory;
  aiConfidence: number;
  reasoningNotes: string;
  additionalRedFlags?: RedFlag[];
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  analyzeContent(input: AIAnalysisPromptInput): Promise<AIAnalysisOutput>;
}

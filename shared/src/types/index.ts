export type InputType = 'message' | 'url' | 'phone' | 'upi';

export type RiskLevel =
  | 'SAFE'
  | 'LOW_RISK'
  | 'SUSPICIOUS'
  | 'HIGH_RISK'
  | 'LIKELY_SCAM'
  | 'UNABLE_TO_VERIFY';

export type ScamCategory =
  | 'BANK_KYC'
  | 'JOB'
  | 'LOTTERY'
  | 'INVESTMENT'
  | 'DELIVERY'
  | 'DIGITAL_ARREST'
  | 'ACCOUNT_TAKEOVER'
  | 'UPI'
  | 'IMPERSONATION'
  | 'PHISHING'
  | 'TECH_SUPPORT'
  | 'BENIGN'
  | 'OTHER';

export type EntityType =
  | 'URL'
  | 'PHONE'
  | 'UPI'
  | 'EMAIL'
  | 'BANK'
  | 'ORGANIZATION'
  | 'AMOUNT'
  | 'DATE'
  | 'OTP_REF'
  | 'ACCOUNT_REF';

export type EntityStatus =
  | 'SUSPICIOUS'
  | 'NOT_VERIFIED'
  | 'NO_KNOWN_ISSUE'
  | 'NOT_CHECKED';

export interface ExtractedEntity {
  id: string;
  type: EntityType;
  value: string;
  maskedValue?: string;
  status: EntityStatus;
  notes?: string;
  confidence?: number;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface RedFlag {
  id: string;
  category: string;
  title: string;
  titleHindi?: string;
  description: string;
  descriptionHindi?: string;
  severity: Severity;
  snippet?: string;
  scoreContribution: number;
}

export interface Recommendation {
  id: string;
  action: string;
  actionHindi?: string;
  type: 'DO' | 'DO_NOT';
  priority: 'high' | 'medium' | 'low';
}

export interface AgentTraceStep {
  agentName: string;
  displayName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  purpose: string;
  durationMs: number;
  confidence: number;
  sanitizedInputSummary: string;
  findings: string[];
  details?: Record<string, unknown>;
}

export interface AnalysisInput {
  text: string;
  type: InputType;
  language?: 'en' | 'hi';
  skipHistory?: boolean;
}

export interface AnalysisVerdict {
  score: number; // 0 to 100
  level: RiskLevel;
  confidence: number; // 0 to 100
  category: ScamCategory;
  summary: string;
  summaryHindi?: string;
}

export interface IntelligenceSummary {
  liveChecksPerformed: boolean;
  sources: string[];
  indicatorsCount: number;
}

export interface AnalysisMetadata {
  language: string;
  demoMode: boolean;
  processingTimeMs: number;
  aiProvider: string;
  rulesEngineVersion: string;
  reportHash?: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  input: {
    type: InputType;
    text: string;
    maskedText?: string;
  };
  verdict: AnalysisVerdict;
  redFlags: RedFlag[];
  entities: ExtractedEntity[];
  recommendations: Recommendation[];
  agentTrace: AgentTraceStep[];
  intelligence: IntelligenceSummary;
  metadata: AnalysisMetadata;
}

export interface FeedbackSubmission {
  analysisId: string;
  feedback: 'correct' | 'incorrect' | 'unsure';
  notes?: string;
  suggestedCategory?: ScamCategory;
}

export interface FeedbackRecord extends FeedbackSubmission {
  id: string;
  createdAt: string;
  ruleSuggestion?: string;
}

export interface CybercrimeDraft {
  incidentSummary: string;
  category: string;
  senderIdentifier?: string;
  phoneNumbers: string[];
  urls: string[];
  upiIds: string[];
  amounts: string[];
  dateTime: string;
  evidenceSummary: string;
  officialHelpline: string;
  portalUrl: string;
  disclaimer: string;
}

export interface DemoSample {
  id: string;
  category: ScamCategory;
  title: string;
  titleHindi: string;
  description: string;
  type: InputType;
  sampleText: string;
  expectedRiskLevel: RiskLevel;
}

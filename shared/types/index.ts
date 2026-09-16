export type InputType = 'MESSAGE' | 'URL' | 'PHONE' | 'UPI';

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
  | 'OTHER'
  | 'BENIGN';

export type RiskLevel =
  | 'Safe'
  | 'Low Risk'
  | 'Caution'
  | 'Suspicious'
  | 'High Risk'
  | 'Likely Scam'
  | 'Unable to Verify';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export type EntityType = 'URL' | 'PHONE' | 'UPI' | 'EMAIL' | 'AMOUNT' | 'ORGANIZATION' | 'DATE' | 'OTP_REF';

export type EntityStatus = 'Suspicious' | 'Not verified' | 'No known issue' | 'Not checked';

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  maskedValue: string;
  status: EntityStatus;
  notes?: string;
}

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RedFlag {
  id: string;
  title: string;
  description: string;
  evidenceSnippet?: string;
  severity: SeverityLevel;
}

export interface Recommendation {
  id: string;
  type: 'DO' | 'DO_NOT';
  text: string;
  context?: string;
}

export interface AgentTraceNode {
  agentName: string;
  displayName: string;
  purpose: string;
  sanitizedInputSummary: string;
  findings: string[];
  durationMs: number;
  confidence: number;
  status: 'COMPLETED' | 'FAILED' | 'SKIPPED';
}

export interface AnalysisVerdict {
  score: number; // 0 - 100
  level: RiskLevel;
  confidence: number; // 0 - 100
  category: ScamCategory;
  categoryLabel: string;
  summary: string;
}

export interface IntelligenceReport {
  liveChecksPerformed: boolean;
  sources: Array<{
    target: string;
    source: string;
    status: 'clean' | 'suspicious' | 'not_checked' | 'local_heuristics';
    details: string;
  }>;
}

export interface AnalysisMetadata {
  language: Language;
  demoMode: boolean;
  aiProvider: string;
  processingTimeMs: number;
  reportHash?: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  input: {
    type: InputType;
    text: string;
    sanitizedText: string;
  };
  verdict: AnalysisVerdict;
  redFlags: RedFlag[];
  entities: ExtractedEntity[];
  recommendations: Recommendation[];
  agentTrace: AgentTraceNode[];
  intelligence: IntelligenceReport;
  metadata: AnalysisMetadata;
}

export interface AnalysisSummaryItem {
  id: string;
  createdAt: string;
  shortText: string;
  inputType: InputType;
  score: number;
  level: RiskLevel;
  category: ScamCategory;
  categoryLabel: string;
  reportHash: string;
}

export interface ThreatArchetypeSample {
  id: string;
  title: string;
  category: ScamCategory;
  inputType: InputType;
  severityLabel: string;
  shortDescription: string;
  sampleText: string;
}

export type FeedbackRating = 'CORRECT' | 'INCORRECT' | 'UNSURE';

export interface UserFeedback {
  analysisId: string;
  rating: FeedbackRating;
  comment?: string;
  createdAt?: string;
}

export interface CybercrimeDraftReport {
  incidentId: string;
  timestamp: string;
  scamCategory: string;
  severity: string;
  incidentSummary: string;
  suspiciousSender?: string;
  phoneNumbers: string[];
  urls: string[];
  upiIds: string[];
  amounts: string[];
  evidenceText: string;
  recommendedOfficialAction: string;
  officialHelpline?: string;
  portalUrl?: string;
}


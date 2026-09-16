import { z } from 'zod';

export const InputTypeSchema = z.enum(['message', 'url', 'phone', 'upi']);

export const RiskLevelSchema = z.enum([
  'SAFE',
  'LOW_RISK',
  'SUSPICIOUS',
  'HIGH_RISK',
  'LIKELY_SCAM',
  'UNABLE_TO_VERIFY',
]);

export const ScamCategorySchema = z.enum([
  'BANK_KYC',
  'JOB',
  'LOTTERY',
  'INVESTMENT',
  'DELIVERY',
  'DIGITAL_ARREST',
  'ACCOUNT_TAKEOVER',
  'UPI',
  'IMPERSONATION',
  'PHISHING',
  'TECH_SUPPORT',
  'BENIGN',
  'OTHER',
]);

export const EntityTypeSchema = z.enum([
  'URL',
  'PHONE',
  'UPI',
  'EMAIL',
  'BANK',
  'ORGANIZATION',
  'AMOUNT',
  'DATE',
  'OTP_REF',
  'ACCOUNT_REF',
]);

export const EntityStatusSchema = z.enum([
  'SUSPICIOUS',
  'NOT_VERIFIED',
  'NO_KNOWN_ISSUE',
  'NOT_CHECKED',
]);

export const ExtractedEntitySchema = z.object({
  id: z.string(),
  type: EntityTypeSchema,
  value: z.string(),
  maskedValue: z.string().optional(),
  status: EntityStatusSchema,
  notes: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
});

export const RedFlagSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  titleHindi: z.string().optional(),
  description: z.string(),
  descriptionHindi: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  snippet: z.string().optional(),
  scoreContribution: z.number(),
});

export const RecommendationSchema = z.object({
  id: z.string(),
  action: z.string(),
  actionHindi: z.string().optional(),
  type: z.enum(['DO', 'DO_NOT']),
  priority: z.enum(['high', 'medium', 'low']),
});

export const AgentTraceStepSchema = z.object({
  agentName: z.string(),
  displayName: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'skipped']),
  purpose: z.string(),
  durationMs: z.number(),
  confidence: z.number().min(0).max(100),
  sanitizedInputSummary: z.string(),
  findings: z.array(z.string()),
  details: z.record(z.unknown()).optional(),
});

export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1, 'Input text cannot be empty').max(10000, 'Input exceeds maximum length of 10,000 characters'),
  type: InputTypeSchema.default('message'),
  language: z.enum(['en', 'hi']).default('en'),
  skipHistory: z.boolean().default(false),
});

export const AnalysisVerdictSchema = z.object({
  score: z.number().min(0).max(100),
  level: RiskLevelSchema,
  confidence: z.number().min(0).max(100),
  category: ScamCategorySchema,
  summary: z.string(),
  summaryHindi: z.string().optional(),
});

export const IntelligenceSummarySchema = z.object({
  liveChecksPerformed: z.boolean(),
  sources: z.array(z.string()),
  indicatorsCount: z.number(),
});

export const AnalysisMetadataSchema = z.object({
  language: z.string(),
  demoMode: z.boolean(),
  processingTimeMs: z.number(),
  aiProvider: z.string(),
  rulesEngineVersion: z.string(),
  reportHash: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  input: z.object({
    type: InputTypeSchema,
    text: z.string(),
    maskedText: z.string().optional(),
  }),
  verdict: AnalysisVerdictSchema,
  redFlags: z.array(RedFlagSchema),
  entities: z.array(ExtractedEntitySchema),
  recommendations: z.array(RecommendationSchema),
  agentTrace: z.array(AgentTraceStepSchema),
  intelligence: IntelligenceSummarySchema,
  metadata: AnalysisMetadataSchema,
});

export const FeedbackSubmissionSchema = z.object({
  feedback: z.enum(['correct', 'incorrect', 'unsure']),
  notes: z.string().max(1000).optional(),
  suggestedCategory: ScamCategorySchema.optional(),
});

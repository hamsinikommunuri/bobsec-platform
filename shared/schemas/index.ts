import { z } from 'zod';

export const InputTypeSchema = z
  .enum(['MESSAGE', 'URL', 'PHONE', 'UPI', 'message', 'url', 'phone', 'upi'])
  .transform((val) => val.toUpperCase() as 'MESSAGE' | 'URL' | 'PHONE' | 'UPI');

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
  'OTHER',
  'BENIGN'
]);

export const RiskLevelSchema = z.enum([
  'Safe',
  'Low Risk',
  'Caution',
  'Suspicious',
  'High Risk',
  'Likely Scam',
  'Unable to Verify'
]);

export const LanguageSchema = z.enum(['en', 'hi', 'ta', 'te', 'bn', 'mr']);

export const AnalyzeRequestSchema = z
  .object({
    type: InputTypeSchema.default('MESSAGE'),
    content: z.string().optional(),
    text: z.string().optional(),
    language: LanguageSchema.default('en'),
    saveToHistory: z.boolean().default(true)
  })
  .transform((data) => ({
    ...data,
    content: (data.content ?? data.text ?? '').trim()
  }))
  .refine((data) => data.content.length > 0, {
    message: 'Input content is required',
    path: ['content']
  })
  .refine((data) => data.content.length <= 10000, {
    message: 'Input exceeds maximum allowed size of 10,000 characters',
    path: ['content']
  });

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const FeedbackRequestSchema = z
  .object({
    rating: z.enum(['CORRECT', 'INCORRECT', 'UNSURE', 'correct', 'incorrect', 'unsure']).optional(),
    feedback: z.enum(['CORRECT', 'INCORRECT', 'UNSURE', 'correct', 'incorrect', 'unsure']).optional(),
    comment: z.string().max(1000, 'Comment too long').optional(),
    notes: z.string().max(1000, 'Notes too long').optional()
  })
  .transform((data) => ({
    rating: ((data.rating || data.feedback || 'UNSURE').toUpperCase()) as 'CORRECT' | 'INCORRECT' | 'UNSURE',
    comment: data.comment || data.notes || undefined
  }));

export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;


export const ExtractedEntitySchema = z.object({
  type: z.enum(['URL', 'PHONE', 'UPI', 'EMAIL', 'AMOUNT', 'ORGANIZATION', 'DATE', 'OTP_REF']),
  value: z.string(),
  maskedValue: z.string(),
  status: z.enum(['Suspicious', 'Not verified', 'No known issue', 'Not checked']),
  notes: z.string().optional()
});

export const RedFlagSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  evidenceSnippet: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
});

export const RecommendationSchema = z.object({
  id: z.string(),
  type: z.enum(['DO', 'DO_NOT']),
  text: z.string(),
  context: z.string().optional()
});

export const AgentTraceNodeSchema = z.object({
  agentName: z.string(),
  displayName: z.string(),
  purpose: z.string(),
  sanitizedInputSummary: z.string(),
  findings: z.array(z.string()),
  durationMs: z.number(),
  confidence: z.number(),
  status: z.enum(['COMPLETED', 'FAILED', 'SKIPPED'])
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  input: z.object({
    type: InputTypeSchema,
    text: z.string(),
    sanitizedText: z.string()
  }),
  verdict: z.object({
    score: z.number().min(0).max(100),
    level: RiskLevelSchema,
    confidence: z.number().min(0).max(100),
    category: ScamCategorySchema,
    categoryLabel: z.string(),
    summary: z.string()
  }),
  redFlags: z.array(RedFlagSchema),
  entities: z.array(ExtractedEntitySchema),
  recommendations: z.array(RecommendationSchema),
  agentTrace: z.array(AgentTraceNodeSchema),
  intelligence: z.object({
    liveChecksPerformed: z.boolean(),
    sources: z.array(
      z.object({
        target: z.string(),
        source: z.string(),
        status: z.enum(['clean', 'suspicious', 'not_checked', 'local_heuristics']),
        details: z.string()
      })
    )
  }),
  metadata: z.object({
    language: LanguageSchema,
    demoMode: z.boolean(),
    aiProvider: z.string(),
    processingTimeMs: z.number(),
    reportHash: z.string().optional()
  })
});

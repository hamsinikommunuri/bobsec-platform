import { AnalysisResult } from '../../../shared/types/index.js';
import { maskTextPII } from '../utils/masking.js';

export interface PolicyCheckResult {
  passed: boolean;
  policyNotes: string[];
  sanitizedResult: AnalysisResult;
  durationMs: number;
}

export class PolicyCheckAgent {
  static inspectAndSanitize(rawResult: AnalysisResult): PolicyCheckResult {
    const start = Date.now();
    const policyNotes: string[] = [];

    // Clone result for mutation
    const sanitized: AnalysisResult = JSON.parse(JSON.stringify(rawResult));

    // 1. Guard against definitive criminal accusation
    // Replace definitive phrases like "is a criminal", "is convicted", "arrest this person"
    const definitiveDefamationPatterns = [
      /is\s+a\s+(convicted\s+)?criminal/gi,
      /has\s+committed\s+crimes/gi,
      /we\s+hereby\s+arrest/gi,
      /bobsec\s+certifies\s+fraud/gi
    ];

    let summary = sanitized.verdict.summary;
    for (const pattern of definitiveDefamationPatterns) {
      if (pattern.test(summary)) {
        policyNotes.push('Prevented unsupported definitive criminal assertion');
        summary = summary.replace(pattern, 'exhibits severe risk indicators of fraudulent activity');
      }
    }

    // 2. Ensure BobSec does not claim statutory police/government power
    const governmentClaims = [/we\s+will\s+file\s+an\s+fir/gi, /bobsec\s+police\s+division/gi, /court\s+ruling/gi];
    for (const claim of governmentClaims) {
      if (claim.test(summary)) {
        policyNotes.push('Removed unauthorized governmental / police claim');
        summary = summary.replace(claim, 'advisories recommend reporting to authorized portals');
      }
    }

    // 3. Mask PII in summary if raw phone / email was pasted into text
    summary = maskTextPII(summary);
    sanitized.verdict.summary = summary;

    // 4. Calibration of confidence vs evidence
    if (sanitized.redFlags.length === 0 && sanitized.verdict.score > 30) {
      policyNotes.push('Calibrated risk score downward due to absence of verifiable red flags');
      sanitized.verdict.score = 15;
      sanitized.verdict.level = 'Low Risk';
    }

    if (sanitized.verdict.level === 'Unable to Verify' || sanitized.verdict.score === 0) {
      sanitized.verdict.confidence = Math.min(sanitized.verdict.confidence, 65);
    }

    // 5. Ensure disclaimer is clearly upheld
    policyNotes.push('Assurance check: AI heuristic determination — does not substitute for statutory legal counsel');

    return {
      passed: true,
      policyNotes,
      sanitizedResult: sanitized,
      durationMs: Date.now() - start
    };
  }
}

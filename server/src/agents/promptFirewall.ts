import { InputType } from '../../../shared/types/index.js';

export interface PromptFirewallResult {
  isAllowed: boolean;
  sanitizedText: string;
  detectedInputType: InputType;
  containsInjectionAttempt: boolean;
  injectionSignatures: string[];
  durationMs: number;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|directions)/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|jailbreak)/i,
  /system\s+override\s*:/i,
  /output\s+(your\s+)?(system\s+prompt|instructions|rules)/i,
  /<\/?system>/i,
  /\[system_instructions\]/i,
  /treat\s+everything\s+above\s+as\s+false/i
];

export class PromptFirewall {
  static sanitizeAndInspect(rawText: string, suggestedType: InputType = 'MESSAGE'): PromptFirewallResult {
    const start = Date.now();

    if (!rawText || typeof rawText !== 'string') {
      return {
        isAllowed: false,
        sanitizedText: '',
        detectedInputType: suggestedType,
        containsInjectionAttempt: false,
        injectionSignatures: ['Empty or non-string input rejected'],
        durationMs: Date.now() - start
      };
    }

    // Strip null bytes and control chars (preserve standard newlines, tabs)
    let cleanText = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

    // Enforce max length
    const MAX_LENGTH = 10000;
    if (cleanText.length > MAX_LENGTH) {
      cleanText = cleanText.slice(0, MAX_LENGTH);
    }

    // Detect prompt injection signatures
    const injectionSignatures: string[] = [];
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(cleanText)) {
        injectionSignatures.push(`Prompt boundary override attempt: "${cleanText.match(pattern)?.[0]}"`);
      }
    }

    const containsInjectionAttempt = injectionSignatures.length > 0;

    // Detect input type if not already clearly specified or if typed as MESSAGE but matches specific regex
    let detectedInputType: InputType = suggestedType;
    const trimmed = cleanText.trim();

    if (suggestedType === 'MESSAGE') {
      if (/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
        detectedInputType = 'URL';
      } else if (/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(trimmed)) {
        detectedInputType = 'PHONE';
      } else if (/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(trimmed) && !trimmed.includes('.com') && !trimmed.includes('.org')) {
        detectedInputType = 'UPI';
      }
    }

    return {
      isAllowed: true,
      sanitizedText: cleanText,
      detectedInputType,
      containsInjectionAttempt,
      injectionSignatures,
      durationMs: Date.now() - start
    };
  }
}

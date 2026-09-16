export interface UPIIntelligenceResult {
  upiId: string;
  handle: string;
  bankPsp: string;
  isValidSyntax: boolean;
  isCommercialMasquerade: boolean;
  isReverseRefundPattern: boolean;
  riskScore: number;
  flags: string[];
  source: 'local_heuristics';
  status: 'clean' | 'suspicious' | 'not_checked';
}

const SUSPICIOUS_UPI_KEYWORDS = [
  'refund',
  'reversal',
  'clearance',
  'rbi',
  'judicial',
  'police',
  'cybercrime',
  'cashback',
  'winner',
  'lottery',
  'kyc-update',
  'dispatch'
];

export function analyzeUPI(rawUpi: string): UPIIntelligenceResult {
  const flags: string[] = [];
  let score = 0;

  // Clean URI format like upi://pay?pa=...
  let clean = rawUpi.trim();
  if (clean.includes('pa=')) {
    const match = clean.match(/pa=([a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+)/);
    if (match) clean = match[1];
  }

  const parts = clean.split('@');
  const isValidSyntax = parts.length === 2 && parts[0].length >= 2 && parts[1].length >= 2;
  const handle = parts[0] ? parts[0].toLowerCase() : '';
  const bankPsp = parts[1] ? parts[1].toLowerCase() : '';

  let isCommercialMasquerade = false;
  let isReverseRefundPattern = false;

  if (!isValidSyntax) {
    flags.push('Malformed UPI ID structure (expected handle@psp format)');
    score += 25;
  } else {
    // Check if phone number is used as handle while claiming official authority
    if (/^\d{10}$/.test(handle)) {
      flags.push('Retail personal mobile number used as merchant/institutional payment endpoint');
      score += 20;
    }

    // Check keywords
    for (const kw of SUSPICIOUS_UPI_KEYWORDS) {
      if (handle.includes(kw)) {
        isCommercialMasquerade = true;
        if (kw === 'refund' || kw === 'reversal') {
          isReverseRefundPattern = true;
        }
        flags.push(`VPA contains deceptive keyword '${kw.toUpperCase()}' intended to mislead recipient`);
        score += 35;
        break;
      }
    }
  }

  const status: 'clean' | 'suspicious' | 'not_checked' = score > 20 ? 'suspicious' : 'clean';

  return {
    upiId: clean,
    handle,
    bankPsp,
    isValidSyntax,
    isCommercialMasquerade,
    isReverseRefundPattern,
    riskScore: Math.min(100, score),
    flags,
    source: 'local_heuristics',
    status
  };
}

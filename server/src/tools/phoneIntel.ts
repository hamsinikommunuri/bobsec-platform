export interface PhoneIntelligenceResult {
  phone: string;
  normalized: string;
  countryCode: string;
  isIndianNumber: boolean;
  isValidMobile: boolean;
  isForeignSuspicious: boolean;
  riskScore: number;
  flags: string[];
  source: 'local_heuristics';
  status: 'clean' | 'suspicious' | 'not_checked';
}

export function analyzePhone(rawPhone: string): PhoneIntelligenceResult {
  const flags: string[] = [];
  let score = 0;

  const clean = rawPhone.trim().replace(/[^\d+]/g, '');
  let countryCode = '+91';
  let isIndianNumber = true;
  let isForeignSuspicious = false;
  let isValidMobile = false;

  let digits = clean.replace(/\D/g, '');

  if (clean.startsWith('+')) {
    if (clean.startsWith('+91')) {
      countryCode = '+91';
      digits = clean.slice(3).replace(/\D/g, '');
    } else {
      isIndianNumber = false;
      const match = clean.match(/^\+(\d{1,3})/);
      countryCode = match ? `+${match[1]}` : '+??';

      // Known high-risk origins in Indian scam context
      if (['+92', '+880', '+234', '+254', '+60', '+84', '+63', '+855'].includes(countryCode)) {
        isForeignSuspicious = true;
        flags.push(`Foreign origin (${countryCode}) commonly associated with overseas cross-border impersonation syndicates`);
        score += 40;
      } else {
        flags.push(`Non-Indian country code (${countryCode})`);
        score += 20;
      }
    }
  } else if (digits.length === 12 && digits.startsWith('91')) {
    countryCode = '+91';
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    countryCode = '+91';
    digits = digits.slice(1);
  }

  if (isIndianNumber) {
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      isValidMobile = true;
    } else if (digits.length === 10) {
      flags.push('10-digit number does not start with standard Indian telecom mobile allocation (6-9)');
      score += 20;
    } else if (digits.length < 10) {
      flags.push('Shortened or incomplete phone number');
      score += 15;
    } else {
      flags.push('Non-standard digit length for Indian telephone subscriber');
      score += 15;
    }
  }

  const normalized = `${countryCode} ${digits.slice(0, 5)} ${digits.slice(5)}`;
  const status: 'clean' | 'suspicious' | 'not_checked' = score > 20 ? 'suspicious' : 'clean';

  return {
    phone: rawPhone,
    normalized,
    countryCode,
    isIndianNumber,
    isValidMobile,
    isForeignSuspicious,
    riskScore: Math.min(100, score),
    flags,
    source: 'local_heuristics',
    status
  };
}

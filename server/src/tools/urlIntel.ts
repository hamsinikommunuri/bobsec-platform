export interface URLIntelligenceResult {
  url: string;
  domain: string;
  protocol: string;
  isShortened: boolean;
  isRawIp: boolean;
  hasPunycode: boolean;
  isSuspiciousTLD: boolean;
  isBrandSpoofing: boolean;
  spoofedBrand?: string;
  riskScore: number;
  flags: string[];
  source: 'local_heuristics';
  status: 'clean' | 'suspicious' | 'not_checked';
}

const SHORTENER_DOMAINS = new Set([
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  't.co',
  'cutt.ly',
  'rb.gy',
  't.me',
  'wa.me',
  'buff.ly',
  'ow.ly'
]);

const SUSPICIOUS_TLDS = new Set([
  '.cc',
  '.top',
  '.xyz',
  '.biz',
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.work',
  '.rest',
  '.loan',
  '.click',
  '.link'
]);

const REPUTABLE_INDIAN_DOMAINS = [
  'sbi.co.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'pnbindia.in',
  'bankofbaroda.in',
  'rbi.org.in',
  'cybercrime.gov.in',
  'indiapost.gov.in',
  'incometax.gov.in',
  'epfindia.gov.in',
  'uidai.gov.in'
];

export function analyzeURL(rawUrl: string): URLIntelligenceResult {
  const flags: string[] = [];
  let score = 0;
  let domain = '';
  let protocol = '';
  let isRawIp = false;
  let hasPunycode = false;
  let isShortened = false;
  let isSuspiciousTLD = false;
  let isBrandSpoofing = false;
  let spoofedBrand: string | undefined;

  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    domain = parsed.hostname.toLowerCase();
    protocol = parsed.protocol.replace(':', '');

    if (protocol === 'http') {
      flags.push('Insecure HTTP protocol used instead of HTTPS');
      score += 15;
    }

    // Check Raw IP
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
      isRawIp = true;
      flags.push('Raw numerical IP address used as hostname');
      score += 35;
    }

    // Punycode
    if (domain.includes('xn--')) {
      hasPunycode = true;
      flags.push('Punycode homograph detected in domain');
      score += 30;
    }

    // Shortener
    if (SHORTENER_DOMAINS.has(domain)) {
      isShortened = true;
      flags.push('URL shortener obscures true destination');
      score += 20;
    }

    // Suspicious TLD
    for (const tld of SUSPICIOUS_TLDS) {
      if (domain.endsWith(tld)) {
        isSuspiciousTLD = true;
        flags.push(`Domain uses high-abuse risk TLD (${tld})`);
        score += 25;
        break;
      }
    }

    // Brand spoofing check
    const knownBrands = ['sbi', 'hdfc', 'icici', 'axis', 'indiapost', 'rbi', 'income-tax', 'yono'];
    for (const brand of knownBrands) {
      if (domain.includes(brand)) {
        const isOfficial = REPUTABLE_INDIAN_DOMAINS.some((official) => domain === official || domain.endsWith('.' + official));
        if (!isOfficial) {
          isBrandSpoofing = true;
          spoofedBrand = brand.toUpperCase();
          flags.push(`Domain contains brand keyword '${brand.toUpperCase()}' but is not an official domain`);
          score += 35;
          break;
        }
      }
    }

    // Suspicious hyphens / keywords
    if (/(-kyc|-update|-auth|-login|-verify|-track)/.test(domain)) {
      flags.push('Domain contains deceptive security/authentication keywords');
      score += 25;
    }
  } catch (err) {
    flags.push('Malformed URL syntax');
    score += 10;
  }

  const normalizedScore = Math.min(100, score);
  const status: 'clean' | 'suspicious' | 'not_checked' = normalizedScore > 25 ? 'suspicious' : 'clean';

  return {
    url: rawUrl,
    domain,
    protocol,
    isShortened,
    isRawIp,
    hasPunycode,
    isSuspiciousTLD,
    isBrandSpoofing,
    spoofedBrand,
    riskScore: normalizedScore,
    flags,
    source: 'local_heuristics',
    status
  };
}

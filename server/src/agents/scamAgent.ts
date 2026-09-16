import { ExtractedEntity, RedFlag, ScamCategory, InputType } from '../../../shared/types/index.js';
import { maskPhone, maskEmail, maskUPI } from '../utils/masking.js';

export interface ScamAgentResult {
  category: ScamCategory;
  confidence: number;
  redFlags: RedFlag[];
  entities: ExtractedEntity[];
  analysisDurationMs: number;
  heuristicsTriggered: string[];
}

export class ScamAgent {
  static analyze(text: string, inputType: InputType): ScamAgentResult {
    const start = Date.now();
    const lower = text.toLowerCase();
    const redFlags: RedFlag[] = [];
    const heuristicsTriggered: string[] = [];

    // 1. Check Urgency / Temporal Coercion
    const urgencyMatches = text.match(
      /\b(urgent|immediately|within \d+ (hours?|minutes?|hrs?|mins?)|today|90 minutes|2 hours|tonight|deadline|expires soon|immediate effect)\b|(तुरंत|तत्काल|आज रात|जल्दी|24 घंटे|2 घंटे)/gi
    );
    if (urgencyMatches) {
      heuristicsTriggered.push('TEMPORAL_COERCION');
      redFlags.push({
        id: 'rf-urgency',
        title: 'High-Pressure Urgency Language',
        description:
          'Communication uses tight timeframes or artificial deadlines to induce emotional panic and suppress critical verification.',
        evidenceSnippet: urgencyMatches.slice(0, 2).join('; '),
        severity: 'MEDIUM'
      });
    }

    // 2. Check Digital Arrest / Law Enforcement Extortion
    const digitalArrestPatterns = [
      /\b(digital arrest|custody|skype|cbi|mumbai cyber crime|police|narcotics|customs seizure|money laundering|fir|warrant|interrogation|statement recording|illegal broadcasting|section \d+[a-z]?|non-bailable)\b|(डिजिटल अरेस्ट|सीबीआई|पुलिस|वारंट|जब्ती|एफआईआर)/gi
    ];
    const daMatches = digitalArrestPatterns.flatMap((p) => text.match(p) || []);
    if (daMatches.length >= 2 || /digital arrest/i.test(text) || /डिजिटल अरेस्ट/i.test(text)) {
      heuristicsTriggered.push('DIGITAL_ARREST_EXTORTION');
      redFlags.push({
        id: 'rf-digital-arrest',
        title: 'Non-Statutory Digital Arrest / Extortion Vector',
        description:
          'Indian judicial authorities and law enforcement (CBI, Police, Supreme Court) do NOT conduct arrests, trials, or custodial interrogation over Skype, WhatsApp, or video calls.',
        evidenceSnippet: daMatches.slice(0, 3).join(', '),
        severity: 'CRITICAL'
      });
    }

    // 3. Check Bank KYC / Deactivation Lures
    const kycMatches = text.match(
      /\b(kyc|aadhaar|pan|netbanking|yono|deactivat(ed|ion)|block(ed)?|suspend(ed)?|rbi mandate|update your kyc|account blocked)\b|(केवाईसी|खाता बंद|अकाउंट ब्लॉक|अपडेट करें|आधार|पैन|बैंक खाता)/gi
    );
    if (kycMatches && (lower.includes('bank') || lower.includes('sbi') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('axis') || lower.includes('yono') || lower.includes('deactivat') || text.includes('खाता') || text.includes('बैंक') || text.includes('केवाईसी'))) {
      heuristicsTriggered.push('BANK_KYC_DEACTIVATION');
      redFlags.push({
        id: 'rf-kyc',
        title: 'Fraudulent KYC / Account Suspension Lure',
        description:
          'Unsolicited claims that your bank account, NetBanking, or SIM will be blocked unless personal credentials or documents are updated through an external link.',
        evidenceSnippet: kycMatches.slice(0, 3).join(', '),
        severity: 'HIGH'
      });
    }

    // 4. Check Credential Requests (OTP, PIN, Password)
    const credentialMatches = text.match(/\b(otp|one time password|pin|password|cvv|secret code|enter your (upi )?pin)\b/gi);
    if (credentialMatches && !lower.includes('never share your otp') && !lower.includes('do not share your otp')) {
      heuristicsTriggered.push('CREDENTIAL_HARVESTING');
      redFlags.push({
        id: 'rf-credentials',
        title: 'Sensitive Credential Request',
        description:
          'Message directly solicits or instructs sharing an OTP, PIN, password, or security token. Legitimate institutions never require your OTP or PIN.',
        evidenceSnippet: credentialMatches.slice(0, 2).join(', '),
        severity: 'CRITICAL'
      });
    }

    // 5. Check Remote Access Software
    const remoteMatches = text.match(/\b(anydesk|teamviewer|rustdesk|quicksupport|screen share|remote control)\b/gi);
    if (remoteMatches) {
      heuristicsTriggered.push('REMOTE_ACCESS_MALWARE');
      redFlags.push({
        id: 'rf-remote',
        title: 'Remote-Access Tool Exploitation Demand',
        description:
          'Instructions to install remote device management tools (AnyDesk, QuickSupport, TeamViewer). Fraudsters use these tools to take full control of mobile screens and banking apps.',
        evidenceSnippet: remoteMatches.join(', '),
        severity: 'CRITICAL'
      });
    }

    // 6. Check Job / Task / Escrow Ponzi
    const jobMatches = text.match(
      /\b(part[\s-]?time job|youtube|subscrib(e|ing)|like videos|daily (earnings|income|salary)|usdt|security deposit|refundable fee|collateral|earn ₹?\d+[\d,]*\s*daily)\b/gi
    );
    if (jobMatches && (lower.includes('deposit') || lower.includes('usdt') || lower.includes('task') || lower.includes('earn'))) {
      heuristicsTriggered.push('TASK_ESCROW_FRAUD');
      redFlags.push({
        id: 'rf-job-escrow',
        title: 'Advance-Fee Remote Job / Task Escrow Scheme',
        description:
          'Promises easy daily earnings for liking videos or rating products, conditioned upon paying an upfront "security deposit" or purchasing cryptocurrency tokens.',
        evidenceSnippet: jobMatches.slice(0, 3).join(', '),
        severity: 'HIGH'
      });
    }

    // 7. Check UPI Reverse Refund / Collect Trap
    const upiTrapMatches = text.match(/\b(mistakenly transferred|reverse payment|refund-agent|enter your pin to refund|scan (this )?qr|collect request)\b/gi);
    if (upiTrapMatches || (lower.includes('upi') && lower.includes('refund') && lower.includes('pin'))) {
      heuristicsTriggered.push('UPI_REVERSE_PAYMENT');
      redFlags.push({
        id: 'rf-upi-collect',
        title: 'UPI Reverse Payment / Collect Request Trap',
        description:
          'Perpetrator claims to have accidentally sent money and asks victim to scan a QR code or enter a UPI PIN. Note: In UPI, YOU NEVER NEED TO ENTER A PIN TO RECEIVE MONEY.',
        evidenceSnippet: upiTrapMatches ? upiTrapMatches.slice(0, 2).join(', ') : 'UPI PIN requested for credit',
        severity: 'CRITICAL'
      });
    }

    // 8. Check Lottery / Lucky Draw
    const lotteryMatches = text.match(/\b(won ₹?\d+[\d,]*|lottery|lucky draw|kbc|cheque no|gst clearance fee|processing fee to claim)\b/gi);
    if (lotteryMatches && (lower.includes('won') || lower.includes('lottery') || lower.includes('lucky draw'))) {
      heuristicsTriggered.push('LOTTERY_ADVANCE_FEE');
      redFlags.push({
        id: 'rf-lottery',
        title: 'Bogus Lottery / Lucky Draw Advance Tax Scheme',
        description:
          'Claims you won a massive monetary prize or car in a competition you never entered, demanding an upfront "GST", "TDS", or "clearance" transfer.',
        evidenceSnippet: lotteryMatches.slice(0, 2).join(', '),
        severity: 'HIGH'
      });
    }

    // 9. Check Fake Courier / Customs Hold
    const courierMatches = text.match(/\b(package|shipment|tracking #?|distribution center|indiapost|bluedart|incomplete address|redelivery fee|parcel return)\b/gi);
    if (courierMatches && (lower.includes('address') || lower.includes('redelivery') || lower.includes('fee') || lower.includes('tracking'))) {
      heuristicsTriggered.push('COURIER_PHISHING');
      redFlags.push({
        id: 'rf-courier',
        title: 'Fake Courier Parcel / Customs Phishing Lure',
        description:
          'Spoofs postal or delivery services claiming your package cannot be delivered, demanding a minor "rescheduling fee" through a phishing site.',
        evidenceSnippet: courierMatches.slice(0, 3).join(', '),
        severity: 'HIGH'
      });
    }

    // 10. Check Guaranteed Investment Syndicate
    const investmentMatches = text.match(/\b(guaranteed \d+%|500% monthly|insider trading|wealth club|vip group|crypto futures|zero risk guaranteed|daily dividends)\b/gi);
    if (investmentMatches) {
      heuristicsTriggered.push('INVESTMENT_PONZI');
      redFlags.push({
        id: 'rf-investment',
        title: 'Unrealistic Guaranteed Investment Syndicate',
        description:
          'Fraudulent investment schemes claiming unrealistic guaranteed profits (e.g. 500% returns or daily dividends) with "zero risk".',
        evidenceSnippet: investmentMatches.slice(0, 2).join(', '),
        severity: 'HIGH'
      });
    }

    // 11. Secrecy and Isolation Mandates
    const secrecyMatches = text.match(/\b(do not disconnect|do not inform|strict secrecy|confidential investigation|family members)\b/gi);
    if (secrecyMatches) {
      heuristicsTriggered.push('PSYCHOLOGICAL_ISOLATION');
      redFlags.push({
        id: 'rf-secrecy',
        title: 'Psychological Coercion & Secrecy Mandate',
        description:
          'Explicit instruction prohibiting the victim from consulting relatives, lawyers, or local police to prevent discovery of the fraud.',
        evidenceSnippet: secrecyMatches.join(', '),
        severity: 'HIGH'
      });
    }

    // 12. Check Utility / Electricity Disconnection
    const utilityMatches = text.match(
      /\b(electricity power supply|disconnected tonight|power station office|previous month bill|electricity officer)\b|(बिजली|बिजली कनेक्शन|काट दिया जाएगा|विद्युत|बिजली बिल)/gi
    );
    if (utilityMatches) {
      heuristicsTriggered.push('UTILITY_DISCONNECTION_TAKEOVER');
      redFlags.push({
        id: 'rf-utility',
        title: 'Utility Power Cut & Disconnection Extortion',
        description:
          'Fabricated emergency power cut warnings aimed at panicking homeowners into calling unauthorized mobile numbers and installing screen-sharing software.',
        evidenceSnippet: utilityMatches.slice(0, 3).join(', '),
        severity: 'HIGH'
      });
    }

    // Extract Entities
    const entities = this.extractEntities(text);

    // Phishing URL Indicator
    const suspiciousUrls = entities.filter((e) => e.type === 'URL' && e.status === 'Suspicious');
    if (suspiciousUrls.length > 0) {
      heuristicsTriggered.push('PHISHING_URL_INDICATOR');
      redFlags.push({
        id: 'rf-url-phishing',
        title: 'Deceptive Phishing URL / High-Risk Domain Pattern',
        description:
          'Extracted web destination uses deceptive authentication keywords or high-risk domain anomalies characteristic of credential harvesting.',
        evidenceSnippet: suspiciousUrls.map((u) => u.value).join(', '),
        severity: 'HIGH'
      });
    }

    // Classify Category
    const category = this.determineCategory(heuristicsTriggered, text, entities);


    // Calculate Confidence
    let confidence = 70;
    if (heuristicsTriggered.length >= 3) confidence = 96;
    else if (heuristicsTriggered.length === 2) confidence = 88;
    else if (heuristicsTriggered.length === 1) confidence = 80;
    else if (category === 'BENIGN') confidence = 92;

    return {
      category,
      confidence,
      redFlags,
      entities,
      analysisDurationMs: Date.now() - start,
      heuristicsTriggered
    };
  }

  private static extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // URLs
    const urlMatches = text.match(/https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.(?:com|in|cc|xyz|top|biz|org|net|co|online|site)[^\s]*/gi) || [];
    for (const url of urlMatches) {
      const isSuspicious = /(\.cc|\.xyz|\.top|\.biz|-kyc|-auth|-update|pa=)/i.test(url);
      entities.push({
        type: 'URL',
        value: url,
        maskedValue: url,
        status: isSuspicious ? 'Suspicious' : 'Not verified',
        notes: isSuspicious ? 'High-risk domain keywords or unverified TLD' : 'External web resource'
      });
    }

    // Phone numbers (Indian mobiles +91 or 10-digit series)
    const phoneMatches = text.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g) || [];
    for (const phone of phoneMatches) {
      const clean = phone.replace(/[\s-]/g, '');
      entities.push({
        type: 'PHONE',
        value: phone,
        maskedValue: maskPhone(phone),
        status: 'Suspicious',
        notes: 'Unverified sender telephone contact'
      });
    }

    // UPI IDs / VPAs
    const upiMatches = text.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g) || [];
    for (const upi of upiMatches) {
      if (!upi.includes('.com') && !upi.includes('.org') && !upi.includes('.in') && !upi.includes('.gov')) {
        const isDeceptive = /(refund|clearance|rbi|judicial|police|dispatch|winner)/i.test(upi);
        entities.push({
          type: 'UPI',
          value: upi,
          maskedValue: maskUPI(upi),
          status: isDeceptive ? 'Suspicious' : 'Not verified',
          notes: isDeceptive ? 'Deceptive VPA handle masquerading as official endpoint' : 'Retail UPI payment handle'
        });
      }
    }

    // Emails
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    for (const email of emailMatches) {
      entities.push({
        type: 'EMAIL',
        value: email,
        maskedValue: maskEmail(email),
        status: 'Not verified',
        notes: 'Electronic mail target'
      });
    }

    // Monetary amounts (INR / USD / USDT)
    const amountMatches = text.match(/(?:₹|INR|Rs\.?|\$|USDT)\s*[\d,]+(?:\.\d{2})?/gi) || [];
    for (const amount of amountMatches) {
      entities.push({
        type: 'AMOUNT',
        value: amount,
        maskedValue: amount,
        status: 'Suspicious',
        notes: 'Monetary transfer or deposit demand'
      });
    }

    // Organizations / Banks
    const orgPatterns = ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'CBI', 'Mumbai Cyber Crime', 'Supreme Court', 'Reserve Bank', 'RBI', 'India Post', 'KBC', 'Amazon', 'YouTube', 'SEBI', 'Electricity Officer', 'Telecom Department'];
    for (const org of orgPatterns) {
      if (new RegExp(`\\b${org}\\b`, 'i').test(text)) {
        entities.push({
          type: 'ORGANIZATION',
          value: org,
          maskedValue: org,
          status: 'Suspicious',
          notes: 'Claimed institutional authority / entity'
        });
      }
    }

    return entities;
  }

  private static determineCategory(triggers: string[], text: string, entities: ExtractedEntity[]): ScamCategory {
    if (triggers.includes('DIGITAL_ARREST_EXTORTION')) return 'DIGITAL_ARREST';
    if (triggers.includes('BANK_KYC_DEACTIVATION')) return 'BANK_KYC';
    if (triggers.includes('TASK_ESCROW_FRAUD')) return 'JOB';
    if (triggers.includes('UPI_REVERSE_PAYMENT')) return 'UPI';
    if (triggers.includes('LOTTERY_ADVANCE_FEE')) return 'LOTTERY';
    if (triggers.includes('COURIER_PHISHING')) return 'DELIVERY';
    if (triggers.includes('INVESTMENT_PONZI')) return 'INVESTMENT';
    if (triggers.includes('UTILITY_DISCONNECTION_TAKEOVER') || triggers.includes('REMOTE_ACCESS_MALWARE')) return 'ACCOUNT_TAKEOVER';
    if (triggers.includes('CREDENTIAL_HARVESTING')) return 'PHISHING';

    if (triggers.length > 0) return 'IMPERSONATION';

    // If no triggers, inspect whether this is benign or other
    const lower = text.toLowerCase();
    if (lower.includes('meeting') || lower.includes('dinner') || lower.includes('grocery') || lower.includes('milk') || lower.includes('hello') || lower.includes('thanks') || lower.includes('never asks for your otp')) {
      return 'BENIGN';
    }

    return 'OTHER';
  }
}

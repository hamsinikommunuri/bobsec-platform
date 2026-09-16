import { RedFlag, Recommendation, ScamCategory } from '../../../shared/types/index.js';

export interface BankSideAgentResult {
  hasBankingThreat: boolean;
  bankingRedFlags: RedFlag[];
  bankingRecommendations: Recommendation[];
  durationMs: number;
  findings: string[];
}

export class BankSideAgent {
  static analyzeBankingContext(text: string, category: ScamCategory): BankSideAgentResult {
    const start = Date.now();
    const lower = text.toLowerCase();
    const bankingRedFlags: RedFlag[] = [];
    const bankingRecommendations: Recommendation[] = [];
    const findings: string[] = [];

    let hasBankingThreat = false;

    // Check OTP / PIN
    if (/\b(otp|one time password|pin|password|cvv)\b/i.test(text) && !lower.includes('never share your otp')) {
      hasBankingThreat = true;
      findings.push('Violation of RBI Core Security Principle: Direct solicitation of secret OTP/PIN');
      bankingRecommendations.push({
        id: 'rec-no-otp',
        type: 'DO_NOT',
        text: 'Do not share any OTP, PIN, password, or CVV with anyone under any circumstance.',
        context: 'Bank staff, police, and RBI officials NEVER require or ask for OTPs or PINs.'
      });
    }

    // Check UPI PIN on receiving money
    if (/\b(refund|reverse payment|receive|credit)\b/i.test(text) && /\b(pin|qr|scan)\b/i.test(text)) {
      hasBankingThreat = true;
      findings.push('Deceptive UPI Mechanism: UPI PIN requested to receive incoming funds');
      bankingRecommendations.push({
        id: 'rec-upi-pin-rule',
        type: 'DO_NOT',
        text: 'Never enter your UPI PIN to receive money or refunds.',
        context: 'In UPI architecture, entering your PIN only authorizes money to DEBIT from your account.'
      });
    }

    // Check Remote-Screen Sharing
    if (/\b(anydesk|teamviewer|rustdesk|quicksupport|screen share)\b/i.test(text)) {
      hasBankingThreat = true;
      findings.push('Dangerous Screen-Mirroring App Installation Requested');
      bankingRecommendations.push({
        id: 'rec-no-remote',
        type: 'DO_NOT',
        text: 'Do NOT install AnyDesk, TeamViewer, QuickSupport, or any application suggested by the caller.',
        context: 'These applications enable fraudsters to view your screen and intercept banking credentials.'
      });
    }

    // Check KYC / Account suspension
    if (category === 'BANK_KYC' || /\b(kyc|netbanking|yono|blocked|deactivated)\b/i.test(text)) {
      hasBankingThreat = true;
      findings.push('Banking KYC Deactivation Lure Detected');
      bankingRecommendations.push({
        id: 'rec-official-app',
        type: 'DO',
        text: 'Open your bank application manually or visit your branch directly for any genuine KYC update.',
        context: 'Never update KYC credentials via third-party web links received over SMS or WhatsApp.'
      });
    }

    // If compromised money transfer already occurred
    if (hasBankingThreat || category === 'DIGITAL_ARREST' || category === 'INVESTMENT') {
      bankingRecommendations.push({
        id: 'rec-freeze-account',
        type: 'DO',
        text: 'If money has already been debited, contact your bank immediate fraud helpline to freeze the transaction.',
        context: 'Call 1930 immediately to log a Golden Hour lien on the recipient mule account.'
      });
    }

    return {
      hasBankingThreat,
      bankingRedFlags,
      bankingRecommendations,
      durationMs: Date.now() - start,
      findings
    };
  }
}

import { Recommendation, ScamCategory, RiskLevel } from '../../../shared/types/index.js';

export interface ConsumerAdviceResult {
  plainExplanation: string;
  consequencesSummary: string;
  recommendations: Recommendation[];
  durationMs: number;
}

export class ConsumerAgent {
  static generateAdvice(
    category: ScamCategory,
    riskLevel: RiskLevel,
    redFlagTitles: string[]
  ): ConsumerAdviceResult {
    const start = Date.now();
    const recommendations: Recommendation[] = [];

    let plainExplanation = '';
    let consequencesSummary = '';

    if (riskLevel === 'High Risk' || riskLevel === 'Likely Scam') {
      plainExplanation =
        'This message exhibits established patterns of deceptive fraud commonly used to pressure recipients into hasty financial decisions or credential surrender.';
      consequencesSummary =
        'Interacting with these instructions can result in unauthorized bank account debits, identity misuse, or compromise of mobile device security.';

      recommendations.push({
        id: 'ca-do-not-engage',
        type: 'DO_NOT',
        text: 'Do not click any embedded links, download files, or respond to the sender.',
        context: 'Ceasing communication prevents the sender from exerting further psychological pressure.'
      });

      if (category === 'DIGITAL_ARREST') {
        recommendations.push({
          id: 'ca-sever-video',
          type: 'DO_NOT',
          text: 'Do not initiate or continue video calls (Skype/WhatsApp) with anyone claiming to be law enforcement.',
          context: 'Indian courts and police do not conduct arrests or legal trials via messaging video calls.'
        });
        recommendations.push({
          id: 'ca-official-police',
          type: 'DO',
          text: 'If concerned, visit your local police station in person to verify any genuine summons.',
          context: 'Genuine law enforcement notices are served formally in writing through official physical processes.'
        });
      } else if (category === 'JOB') {
        recommendations.push({
          id: 'ca-no-deposit',
          type: 'DO_NOT',
          text: 'Do not transfer any upfront registration fees or cryptocurrency deposits for online job tasks.',
          context: 'Legitimate employers never ask candidates to pay money in order to work.'
        });
      } else if (category === 'DELIVERY') {
        recommendations.push({
          id: 'ca-delivery-official',
          type: 'DO',
          text: 'Track your shipment directly on the official courier website or app using your original tracking ID.',
          context: 'Never follow SMS links to update delivery addresses or pay reschedule fees.'
        });
      }

      recommendations.push({
        id: 'ca-report-1930',
        type: 'DO',
        text: 'Report the suspicious sender number and UPI ID on the National Cybercrime Portal (cybercrime.gov.in or call 1930).',
        context: 'Prompt reporting helps authorities block syndicate mule accounts and protect other citizens.'
      });
    } else if (riskLevel === 'Caution' || riskLevel === 'Suspicious') {
      plainExplanation =
        'This communication contains unverified links or urgency phrasing that warrants heightened caution before taking any action.';
      consequencesSummary =
        'Proceeding without independent verification could expose personal contact information or lead to phishing pages.';

      recommendations.push({
        id: 'ca-verify-independently',
        type: 'DO',
        text: 'Verify the claim independently by contacting the organization through their official website or published customer care.',
        context: 'Never use contact details provided inside the suspicious message itself.'
      });
      recommendations.push({
        id: 'ca-no-credentials',
        type: 'DO_NOT',
        text: 'Never input confidential passwords or OTPs on pages opened from message links.',
        context: 'Always verify browser address bar certificates before entering credentials.'
      });
    } else {
      plainExplanation =
        'No deceptive fraud patterns, urgency coercion, or unauthorized credential requests were identified in this text.';
      consequencesSummary =
        'The communication appears standard; however, always remain vigilant regarding unsolicited requests.';

      recommendations.push({
        id: 'ca-safe-hygiene',
        type: 'DO',
        text: 'Maintain standard cyber hygiene and never disclose financial credentials to third parties.',
        context: 'Nominal baseline safety.'
      });
    }

    return {
      plainExplanation,
      consequencesSummary,
      recommendations,
      durationMs: Date.now() - start
    };
  }
}

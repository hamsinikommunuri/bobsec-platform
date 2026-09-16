import { Language, ScamCategory, RiskLevel, RedFlag, ExtractedEntity, Recommendation } from '../../../shared/types/index.js';
import { CATEGORY_LABELS_EN, CATEGORY_LABELS_HI } from '../../../shared/constants/index.js';

export interface ExplainerAgentResult {
  summary: string;
  categoryLabel: string;
  translatedRedFlags: RedFlag[];
  translatedRecommendations: Recommendation[];
  durationMs: number;
}

export class ExplainerAgent {
  static explain(
    category: ScamCategory,
    riskLevel: RiskLevel,
    redFlags: RedFlag[],
    recommendations: Recommendation[],
    language: Language = 'en'
  ): ExplainerAgentResult {
    const start = Date.now();
    const isHindi = language === 'hi';

    const categoryLabel = isHindi ? CATEGORY_LABELS_HI[category] || category : CATEGORY_LABELS_EN[category] || category;

    let summary = '';

    if (isHindi) {
      if (riskLevel === 'High Risk' || riskLevel === 'Likely Scam') {
        summary = `बॉबसेक सुरक्षा इंजन ने इस संदेश को अत्यधिक जोखिम भरा (${categoryLabel}) चिन्हित किया है। इसमें दबाव बनाकर गोपनीय विवरण, ओटीपी या वित्तीय लेन-देन करवाने के स्पष्ट संकेत हैं। कृपया किसी भी निर्देश का पालन न करें।`;
      } else if (riskLevel === 'Caution' || riskLevel === 'Suspicious') {
        summary = `यह संदेश संदेहास्पद प्रतीत होता है। इसमें अपुष्ट लिंक या तात्कालिकता के संकेत हैं। किसी भी लिंक पर क्लिक करने या विवरण साझा करने से पहले आधिकारिक माध्यम से पुष्टि करें।`;
      } else {
        summary = `इस संदेश में कोई भी ज्ञात धोखाधड़ी या फ़िशिंग पैटर्न नहीं पाया गया है। यह एक सामान्य संदेश प्रतीत होता है। फिर भी अपनी व्यक्तिगत जानकारी सुरक्षित रखें।`;
      }
    } else {
      if (riskLevel === 'High Risk' || riskLevel === 'Likely Scam') {
        summary = `BobSec forensic heuristics classified this content as ${riskLevel.toUpperCase()} under ${categoryLabel}. Key indicators include coercive psychological urgency, unauthorized authority claims, or financial exfiltration requests. Disengage immediately.`;
      } else if (riskLevel === 'Caution' || riskLevel === 'Suspicious') {
        summary = `Elevated caution advised. This communication contains unverified external links or anomalous identifiers that deviate from standard institutional practices. Validate independently before proceeding.`;
      } else {
        summary = `No known scam vectors, deceptive urgency patterns, or credential harvesting mechanisms were detected. Baseline nominal security established.`;
      }
    }

    // Translate / adjust red flags if Hindi
    const translatedRedFlags = redFlags.map((rf) => {
      if (isHindi) {
        return {
          ...rf,
          title: ExplainerAgent.translateRedFlagTitle(rf.id, rf.title),
          description: ExplainerAgent.translateRedFlagDesc(rf.id, rf.description)
        };
      }
      return rf;
    });

    // Translate recommendations if Hindi
    const translatedRecommendations = recommendations.map((rec) => {
      if (isHindi) {
        return {
          ...rec,
          text: ExplainerAgent.translateRecText(rec.id, rec.text),
          context: rec.context ? ExplainerAgent.translateRecContext(rec.id, rec.context) : undefined
        };
      }
      return rec;
    });

    return {
      summary,
      categoryLabel,
      translatedRedFlags,
      translatedRecommendations,
      durationMs: Date.now() - start
    };
  }

  private static translateRedFlagTitle(id: string, fallback: string): string {
    const map: Record<string, string> = {
      'rf-urgency': 'दबाव बनाने वाली तात्कालिक भाषा (Urgency)',
      'rf-digital-arrest': 'फर्जी डिजिटल अरेस्ट व पुलिस का डर',
      'rf-kyc': 'फर्जी बैंक केवाईसी व खाता बंद करने की धमकी',
      'rf-credentials': 'ओटीपी / पिन / पासवर्ड मांगने का प्रयास',
      'rf-remote': 'रिमोट एक्सेस ऐप (AnyDesk आदि) डाउनलोड कराने की मांग',
      'rf-job-escrow': 'घर बैठे कमाई का झांसा और सुरक्षा जमा (Escrow) मांग',
      'rf-upi-collect': 'यूपीआई रिवर्स पेमेंट / गलत ट्रांसफर का जाल',
      'rf-lottery': 'लकी ड्रा / लॉटरी में टैक्स एडवांस मांगने की ठगी',
      'rf-courier': 'फर्जी पार्सल व कूरियर डिलीवरी फ़िशिंग',
      'rf-investment': 'अवास्तविक गारंटीकृत मुनाफे का लालच'
    };
    return map[id] || fallback;
  }

  private static translateRedFlagDesc(id: string, fallback: string): string {
    const map: Record<string, string> = {
      'rf-urgency': 'संदेश में तुरंत कार्रवाई करने का दबाव डाला गया है ताकि सोचने या जांच करने का समय न मिले।',
      'rf-digital-arrest': 'भारतीय कानून या पुलिस कभी भी स्काइप या व्हाट्सएप वीडियो कॉल पर गिरफ्तारी या कानूनी बयान दर्ज नहीं करती।',
      'rf-kyc': 'बैंक या सरकारी एजेंसियां अनधिकृत बाहरी लिंक के जरिए केवाईसी अपडेट करने को नहीं कहती हैं।',
      'rf-credentials': 'कोई भी बैंक कर्मचारी या पुलिस अधिकारी आपका ओटीपी या यूपीआई पिन नहीं मांगता।',
      'rf-remote': 'रिमोट स्क्रीन ऐप डाउनलोड करवाने से धोखेबाज आपके फोन व बैंकिंग ऐप्स का पूरा नियंत्रण हासिल कर लेते हैं।',
      'rf-job-escrow': 'असली कंपनियां काम देने के बदले पहले पैसे या सुरक्षा जमा नहीं मांगती हैं।',
      'rf-upi-collect': 'पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन डालने की जरूरत नहीं होती।',
      'rf-lottery': 'जिस प्रतियोगिता में आपने भाग नहीं लिया, उसकी लॉटरी फीस या टैक्स कभी न भरें।'
    };
    return map[id] || fallback;
  }

  private static translateRecText(id: string, fallback: string): string {
    const map: Record<string, string> = {
      'ca-do-not-engage': 'संदेश में दिए किसी भी लिंक पर क्लिक न करें और न ही कोई जवाब दें।',
      'ca-sever-video': 'किसी भी व्यक्ति से स्काइप या व्हाट्सएप पर वीडियो कॉल तुरंत बंद कर दें।',
      'ca-official-police': 'यदि कोई संशय हो, तो सीधे अपने नजदीकी पुलिस स्टेशन जाकर व्यक्तिगत रूप से जांच करें।',
      'ca-no-deposit': 'ऑनलाइन टास्क या नौकरी के लिए कोई भी अग्रिम शुल्क या क्रिप्टो ट्रांसफर न करें।',
      'ca-delivery-official': 'अपने पार्सल की स्थिति केवल आधिकारिक कूरियर वेबसाइट या ऐप पर ही देखें।',
      'ca-report-1930': 'संदेश भेजने वाले नंबर और यूपीआई आईडी की शिकायत साइबर हेल्पलाइन 1930 या cybercrime.gov.in पर दर्ज करें।',
      'rec-no-otp': 'अपना ओटीपी, पिन, पासवर्ड या सीवीवी किसी के भी साथ कभी साझा न करें।',
      'rec-upi-pin-rule': 'पैसे प्राप्त करने या रिफंड लेने के लिए कभी भी यूपीआई पिन न डालें।',
      'rec-no-remote': 'कॉलर के कहने पर AnyDesk या QuickSupport जैसे ऐप्स कभी इंस्टॉल न करें।',
      'rec-official-app': 'बैंक संबंधित किसी भी कार्य के लिए केवल आधिकारिक बैंक ऐप या शाखा का उपयोग करें।'
    };
    return map[id] || fallback;
  }

  private static translateRecContext(id: string, fallback: string): string {
    const map: Record<string, string> = {
      'rec-upi-pin-rule': 'यूपीआई में पिन डालने से आपके खाते से पैसे कटते हैं, पैसे आते नहीं हैं।'
    };
    return map[id] || fallback;
  }
}

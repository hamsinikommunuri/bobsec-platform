export * from './samples.js';
import { ScamCategory, RiskLevel } from '../types/index.js';


export const CATEGORY_LABELS_EN: Record<ScamCategory, string> = {
  BANK_KYC: 'Bank KYC & NetBanking Phishing',
  JOB: 'Part-Time Task & Escrow Scam',
  LOTTERY: 'Lottery & Lucky Draw Extortion',
  INVESTMENT: 'High-Yield Investment Syndicate',
  DELIVERY: 'Courier & Package Delivery Impersonation',
  DIGITAL_ARREST: 'Digital Arrest & Law Enforcement Extortion',
  ACCOUNT_TAKEOVER: 'Account Takeover & Utility Disconnection',
  UPI: 'UPI Reverse Payment & QR Scam',
  IMPERSONATION: 'Authority & Brand Impersonation',
  PHISHING: 'Credential Harvesting & Phishing',
  TECH_SUPPORT: 'Remote Access & Tech Support Trap',
  OTHER: 'Suspicious Electronic Communication',
  BENIGN: 'Standard Legitimate Communication'
};

export const CATEGORY_LABELS_HI: Record<ScamCategory, string> = {
  BANK_KYC: 'बैंक केवाईसी और नेटबैंकिंग धोखाधड़ी',
  JOB: 'पार्ट-टाइम नौकरी और एस्क्रो घोटाला',
  LOTTERY: 'लॉटरी और लकी ड्रा ठगी',
  INVESTMENT: 'फर्जी निवेश व अत्यधिक मुनाफे का झांसा',
  DELIVERY: 'कूरियर और पार्सल डिलीवरी फ्रॉड',
  DIGITAL_ARREST: 'डिजिटल अरेस्ट और पुलिस का डर दिखाकर वसूली',
  ACCOUNT_TAKEOVER: 'खाता हैकिंग व बिजली बिल डिस्कनेक्शन झांसा',
  UPI: 'यूपीआई रिवर्स पेमेंट और क्यूआर फ्रॉड',
  IMPERSONATION: 'अधिकारी या संस्था का फर्जी रूप धारण',
  PHISHING: 'गोपनीय जानकारी चुराने का प्रयास (फ़िशिंग)',
  TECH_SUPPORT: 'रिमोट एक्सेस और फर्जी कस्टमर केयर जाल',
  OTHER: 'संदेहास्पद इलेक्ट्रॉनिक संदेश',
  BENIGN: 'सामान्य व सुरक्षित संदेश'
};

export const RISK_LEVEL_CONFIG = {
  LOW: { min: 0, max: 19, label: 'Low Risk' as RiskLevel, color: '#35C88A' },
  CAUTION: { min: 20, max: 44, label: 'Caution' as RiskLevel, color: '#E8AA42' },
  SUSPICIOUS: { min: 45, max: 69, label: 'Suspicious' as RiskLevel, color: '#E8AA42' },
  HIGH: { min: 70, max: 100, label: 'High Risk' as RiskLevel, color: '#F06063' }
};

export const OFFICIAL_REPORTING_RESOURCES = {
  nationalCybercrimePortal: 'https://cybercrime.gov.in',
  nationalHelpline: '1930',
  chakshuPortal: 'https://sancharsaathi.gov.in/sfc/',
  rbiSachet: 'https://sachet.rbi.org.in'
};

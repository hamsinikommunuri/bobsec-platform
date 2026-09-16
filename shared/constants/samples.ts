import { ThreatArchetypeSample } from '../types/index.js';


export const DEMO_SAMPLES: ThreatArchetypeSample[] = [
  {
    id: 'digital-arrest',
    title: 'Digital Arrest Extortion',
    category: 'DIGITAL_ARREST',
    inputType: 'MESSAGE',
    severityLabel: 'CRITICAL SEVERITY',
    shortDescription: 'CBI / Police summons claiming illegal narcotics parcel; Skype interrogation demanded.',
    sampleText:
      'URGENT NOTICE: Telecom Department & Mumbai Cyber Crime have flagged your SIM card (+91 98201 00492) for illegal broadcasting and financial fraud. Case ID: MH/CB/8492. Your number and Aadhaar-linked bank accounts will be deactivated in 90 minutes. Connect immediately with Inspector Vikram Rathore on Skype for mandatory statement recording. Do not disconnect or inform third parties. Transfer verification bond of ₹4,85,000 to Reserve Bank Judicial clearance VPA: 9872100492@okaxis for immediate discharge.'
  },
  {
    id: 'bank-kyc',
    title: 'Bank KYC Deactivation Lure',
    category: 'BANK_KYC',
    inputType: 'MESSAGE',
    severityLabel: 'HIGH VELOCITY',
    shortDescription: 'SBI NetBanking / Aadhaar PAN deactivation within 2 hours warning.',
    sampleText:
      'Dear SBI Customer, your NetBanking access and Debit Card will be permanently deactivated within 2 hours due to uncompleted RBI KYC mandate. Immediately update your Aadhaar and PAN credentials at: https://sbi-kyc-auth-portal-in.cc to avoid financial suspension. Customer Care: +91 89102 34511.'
  },
  {
    id: 'job-escrow',
    title: 'Remote Job / Escrow Task Scam',
    category: 'JOB',
    inputType: 'MESSAGE',
    severityLabel: 'PONZI MULTIPLIER',
    shortDescription: 'Earn ₹8,000 - ₹25,000/day liking YouTube videos; deposit USDT collateral.',
    sampleText:
      'Congratulations! You have been shortlisted for Amazon & YouTube Global Partner remote tasking. Earn ₹8,000 - ₹25,000 daily simply subscribing to official partner channels and rating hotels. Initial bonus ₹500 credited to wallet. Transfer initial refundable security deposit of 500 USDT (₹42,000) to activate merchant task dispatch at upi://pay?pa=dispatchmgr@icici.'
  },
  {
    id: 'upi-refund',
    title: 'UPI Reverse Payment Trap',
    category: 'UPI',
    inputType: 'MESSAGE',
    severityLabel: 'REVERSE DEBIT',
    shortDescription: 'Accidental payment claim requesting QR scan or UPI collect approval.',
    sampleText:
      'Sir, by technical error I mistakenly transferred ₹25,000 to your Google Pay number instead of my medical supplier. Please verify receipt and return the amount immediately. Open this emergency reverse refund link and enter your UPI PIN to approve return: upi://pay?pa=refund-agent@axisbank&am=25000&pn=ReverseRefund'
  },
  {
    id: 'lottery-kbc',
    title: 'KBC Lottery Winner Tax Advance',
    category: 'LOTTERY',
    inputType: 'MESSAGE',
    severityLabel: 'ADVANCE FEE FRAUD',
    shortDescription: '₹25,00,000 lottery win notification requiring GST/TDS processing fee.',
    sampleText:
      'ALL INDIA SIM CARD LUCKY DRAW COMPETITION: Congratulations! Your Mobile number has won ₹25,00,000 in KBC Jio Lucky Draw. Cheque No: KBC-9014. To claim your prize money, contact KBC Manager Rana Pratap Singh on WhatsApp +91 74892 10921 and pay government GST clearance fee of ₹12,500 via GPay/PhonePe to winner-clearance@ybl.'
  },
  {
    id: 'fake-courier',
    title: 'Customs / Courier Delivery Hold',
    category: 'DELIVERY',
    inputType: 'MESSAGE',
    severityLabel: 'PACKAGE PHISHING',
    shortDescription: 'India Post / BlueDart address incomplete with ₹48 redelivery link.',
    sampleText:
      'IndiaPost: Your shipment package (Tracking #IN94028104) has arrived at the local distribution center but cannot be delivered due to incomplete apartment number. Failure to update within 12 hours will result in parcel return. Please pay ₹48 redelivery verification fee and re-confirm delivery address: http://indiapost-update-track-v2.top'
  },
  {
    id: 'investment-app',
    title: 'High-Yield Guaranteed Investment Scam',
    category: 'INVESTMENT',
    inputType: 'MESSAGE',
    severityLabel: 'FINANCIAL SYNDICATE',
    shortDescription: 'VIP WhatsApp insider trading group promising guaranteed 500% returns.',
    sampleText:
      'EXCLUSIVE INVITATION: Join Morgan Stanley Institutional VIP Wealth Club. Our proprietary quantitative algorithmic bot guarantees 500% monthly returns on NSE equity and cryptocurrency futures. Zero risk guaranteed by SEBI licensed fund managers. Install our exclusive APK from http://ms-vip-trade.xyz and deposit minimum ₹50,000 to start earning ₹10,000 daily dividends.'
  },
  {
    id: 'electricity-otp',
    title: 'Electricity / Bill Power Cut Scam',
    category: 'ACCOUNT_TAKEOVER',
    inputType: 'MESSAGE',
    severityLabel: 'URGENT DISCONNECTION',
    shortDescription: 'Power will be disconnected at 9:30 PM tonight; call fake electricity officer.',
    sampleText:
      'Dear Consumer, Electricity power supply will be disconnected tonight at 9:30 PM from the power station office because your previous month bill was not updated. Please immediately contact our Electricity Officer Mr. Sharma on +91 93214 55902 and download QuickSupport / AnyDesk to update your bill payment, or share verification OTP.'
  }
];

export const BENIGN_SAMPLES: ThreatArchetypeSample[] = [
  {
    id: 'benign-family',
    title: 'Family Grocery Reminder',
    category: 'BENIGN',
    inputType: 'MESSAGE',
    severityLabel: 'SAFE',
    shortDescription: 'Everyday normal conversation with no financial or credential demands.',
    sampleText:
      'Hi beta, remember to bring milk, eggs and some brown bread while coming back from office today. Dinner will be ready by 8:30 PM. See you soon!'
  },
  {
    id: 'benign-bank-alert',
    title: 'Legitimate Bank Transaction Alert',
    category: 'BENIGN',
    inputType: 'MESSAGE',
    severityLabel: 'SAFE',
    shortDescription: 'Standard notification with explicit warning NEVER to share OTP/passwords.',
    sampleText:
      'Your HDFC Bank account ending in 4102 has been debited for INR 450.00 at STARBUCKS on 16-SEP-26. Avail Bal: INR 34,210.50. If not done by you, SMS BLOCK to 5676712. Remember, HDFC Bank NEVER asks for your OTP, PIN or CVV.'
  }
];

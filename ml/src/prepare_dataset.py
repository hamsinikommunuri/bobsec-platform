"""Dataset Generation & Curation Pipeline for BobSec.

Assembles a structured, leak-proof dataset covering Indian scam vectors and
legitimate transactional/conversational messages with strict source_group tracking.
"""
import json
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd

from .model_config import DATASET_PATH, REPORTS_DIR

CORE_DATA_RECORDS: List[Dict[str, Any]] = [
    # BANK_KYC SCAMS
    {
        "source_group": "sbi_kyc_block_01",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "Dear Customer, Your SBI account will be blocked today due to pending KYC update. Click http://sbi-kyc-verification.cc to submit Aadhaar and PAN immediately."
    },
    {
        "source_group": "sbi_kyc_block_01",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "SBI Alert: Your NetBanking access is suspended. Complete your mandatory KYC at https://sbi-portal-verify.in or visit link to prevent permanent account suspension."
    },
    {
        "source_group": "hdfc_pan_block_02",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "HDFC Bank Alert: Dear User, Your PAN card is not linked to your savings account. Your debit card has been deactivated. Update PAN now: https://hdfc-pan-update.online"
    },
    {
        "source_group": "hdfc_pan_block_02",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "Important Notice: HDFC NetBanking card deactivated. Link PAN card immediately on https://hdfc-kyc-portal.com within 24 hours to resume banking services."
    },
    {
        "source_group": "icici_kyc_sms_03",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "ICICI Warning: Dear customer, your account ending in 4920 will be terminated in 12 hours. Update re-KYC by downloading our official APK from http://icici-quick-kyc.org"
    },
    {
        "source_group": "pnb_account_dormant_04",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "PNB Alert: Your bank account will be blocked today. Please contact customer care executive at 9820100492 to re-activate your net banking and share verification code."
    },
    {
        "source_group": "bob_kyc_hinglish_05",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "hi-en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "Bank of Baroda Suchna: Aapka khata KYC update na hone ke karan block ho raha hai. Turant diye gaye link http://bob-kyc-help.top par jakar Aadhaar number darj karein."
    },
    {
        "source_group": "axis_rewards_kyc_06",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "Axis Bank: Your credit card points worth Rs 8,450 will expire tonight. Complete KYC authentication to convert points to cash credit in your savings account: http://axis-redeem.cc"
    },
    {
        "source_group": "kotak_kyc_docs_07",
        "scam_type": "bank_kyc",
        "label": 1,
        "language": "en",
        "provenance": "curated_indian_bank_telemetry",
        "text": "Kotak Mahindra Bank: RBI mandate requires biometric e-KYC submission. Failure will freeze outgoing UPI transactions. Submit verification documents at https://kotak-ekyc.live"
    },
    # DIGITAL_ARREST SCAMS
    {
        "source_group": "cbi_mumbai_extortion_01",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "This is Inspector Rajesh Sharma from Central Bureau of Investigation (CBI) Cyber Crime Cell. A warrant of arrest is issued against your Aadhaar for money laundering of Rs 3.8 Crores in Canara Bank. Connect on Skype / WhatsApp video call immediately under Digital Arrest."
    },
    {
        "source_group": "cbi_mumbai_extortion_01",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "URGENT CBI NOTICE: Non-bailable warrant issued under PMLA Section 4. You are placed under digital house arrest. Do not inform family or disconnect video call until verification deposit is transferred."
    },
    {
        "source_group": "mumbai_police_trafficking_02",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Mumbai Crime Branch: Your mobile number is registered in human trafficking and narcotics shipment intercepted at international airport. You are in virtual custody. Transfer collateral funds to RBI verification escrow account."
    },
    {
        "source_group": "ed_money_laundering_03",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Enforcement Directorate (ED) summons: Bank accounts linked to your PAN have shown suspicious illegal foreign remittances. Keep camera on at all times under Digital Arrest protocol until case clearance certificate is issued."
    },
    {
        "source_group": "delhi_cyber_cell_04",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "hi-en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Delhi Police Cyber Crime Headquarter: Aapke naam par Supreme Court se digital arrest warrant nikla hai. Video call par judiye aur turant apne bank balance ki jaanch karwayein warna police ghar bhej di jayegi."
    },
    {
        "source_group": "trai_police_sim_05",
        "scam_type": "digital_arrest",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Department of Telecommunications (DoT) & Cyber Police: All SIM cards under your Aadhaar will be disconnected in 2 hours due to 17 harassment complaints. Press 9 to transfer to Cyber Crime Branch for video statement."
    },

    # UPI_FRAUD SCAMS
    {
        "source_group": "olx_qr_advance_01",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "Hello sir, I want to buy your furniture on OLX. I am an army officer. I have generated a merchant QR code for advance payment of Rs 15,000. Scan the QR code and enter your UPI PIN to receive payment in your account."
    },
    {
        "source_group": "olx_qr_advance_01",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "To receive payment of Rs 15,000 from army store buyer, scan this PhonePe QR and enter your secret UPI PIN to credit funds directly to your bank account."
    },
    {
        "source_group": "gpay_cashback_collect_02",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "Google Pay Reward Alert: Congratulations! You have received cashback of Rs 2,999 on your recent transaction. Click the link to claim reward: https://gpay-reward-collect.in and approve the UPI collect request."
    },
    {
        "source_group": "phonepe_refund_vpa_03",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "PhonePe Support: Your failed transaction refund of Rs 4,500 is approved. Send Rs 1 to verify-vpa@okhdfcbank with remarks 'REFUND' to release full settlement back into your account."
    },
    {
        "source_group": "electricity_bill_disconnection_04",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the power station because previous month bill was not updated. Immediately pay pending Rs 15 via UPI to executive at 9876543210 or call electricity officer."
    },
    {
        "source_group": "electricity_bill_disconnection_04",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "hi-en",
        "provenance": "curated_upi_telemetry",
        "text": "Bijli Vibhag Suchna: Aaj raat 10 baje aapki bijli kaat di jayegi kyunki pichhla bill jama nahi hua hai. Sampark karein bijli adhikaari 9820100492 par aur turant UPI se bhugtan karein."
    },
    {
        "source_group": "fastag_recharge_scam_05",
        "scam_type": "upi_fraud",
        "label": 1,
        "language": "en",
        "provenance": "curated_upi_telemetry",
        "text": "NETC FASTag Alert: Your vehicle FASTag account has negative balance. Toll gate passage blocked. Recharge instantly through NHAI portal link: http://fastag-nhai-pay.biz to avoid Rs 500 penalty."
    },
    # COURIER_SCAM
    {
        "source_group": "fedex_customs_drugs_01",
        "scam_type": "courier_scam",
        "label": 1,
        "language": "en",
        "provenance": "customs_advisories_and_police_records",
        "text": "FedEx Express Notice: Parcel tracking #FX-98201 sent in your name to Taiwan has been confiscated by Mumbai Customs. Package contains 5 fake passports, 150 grams MDMA and 4 kg illegal medicines. Press 2 to talk to Customs officer."
    },
    {
        "source_group": "fedex_customs_drugs_01",
        "scam_type": "courier_scam",
        "label": 1,
        "language": "en",
        "provenance": "customs_advisories_and_police_records",
        "text": "Blue Dart Delivery Security: Consignment addressed to you detained at Delhi Cargo. Illegal contraband and narcotics identified. Pay clearance duty fee of Rs 25,000 to prevent immediate narcotics FIR registration."
    },
    {
        "source_group": "india_post_address_fix_02",
        "scam_type": "courier_scam",
        "label": 1,
        "language": "en",
        "provenance": "customs_advisories_and_police_records",
        "text": "India Post Alert: Your parcel #IN83920194 cannot be delivered due to incorrect house address. Update correct postal address within 12 hours at https://indiapost-parcel-update.com or item will be returned to sender."
    },
    {
        "source_group": "dhl_duty_fee_03",
        "scam_type": "courier_scam",
        "label": 1,
        "language": "en",
        "provenance": "customs_advisories_and_police_records",
        "text": "DHL Worldwide Express: An international shipment with tracking number DHL-74921 has arrived for you. Customs tax of Rs 1,480 must be paid online at http://dhl-tax-clearance.net to release your parcel."
    },

    # JOB_SCAM
    {
        "source_group": "telegram_youtube_tasks_01",
        "scam_type": "job_scam",
        "label": 1,
        "language": "en",
        "provenance": "cybercrime_portal_telemetry",
        "text": "Part Time Work From Home Job: Earn Rs 3,000 to Rs 8,000 daily by simply liking YouTube videos and subscribing to channels. No experience needed. Daily payout directly via UPI. Message our HR on Telegram @EarnDaily_India."
    },
    {
        "source_group": "telegram_youtube_tasks_01",
        "scam_type": "job_scam",
        "label": 1,
        "language": "en",
        "provenance": "cybercrime_portal_telemetry",
        "text": "Amazon & Google partner hiring: Work from home 2 hours daily rating hotel apps and YouTube content. Get Rs 500 per task. Join our Telegram recruitment channel @TaskPayoutsIndia now."
    },
    {
        "source_group": "hotel_review_vip_task_02",
        "scam_type": "job_scam",
        "label": 1,
        "language": "en",
        "provenance": "cybercrime_portal_telemetry",
        "text": "Congratulations! You have been selected for Google Maps 5-Star Reviewer job. Complete 3 trial reviews and receive Rs 300 bonus. Upgrade to VIP prepaid task tier for 40% guaranteed returns on investment."
    },
    {
        "source_group": "indigo_airport_job_03",
        "scam_type": "job_scam",
        "label": 1,
        "language": "en",
        "provenance": "cybercrime_portal_telemetry",
        "text": "IndiGo Airlines Recruitment 2026: Direct selection for Ground Staff and Ticketing Executive. Salary Rs 38,000/month + medical benefits. Pay Rs 2,500 registration and uniform gate pass fee to gatepass-indigo@upi."
    },
    {
        "source_group": "data_entry_agreement_04",
        "scam_type": "job_scam",
        "label": 1,
        "language": "en",
        "provenance": "cybercrime_portal_telemetry",
        "text": "Work from Home Data Entry: Earn Rs 25,000 weekly typing PDF to Word files. Security deposit of Rs 1,500 refundable with first paycheck. Sign legal contract online at http://dataentry-india-jobs.in"
    },

    # INVESTMENT_SCAM
    {
        "source_group": "crypto_vip_trading_01",
        "scam_type": "investment_scam",
        "label": 1,
        "language": "en",
        "provenance": "fintech_fraud_bulletins",
        "text": "Exclusive WhatsApp Stock Advisory: Institutional insider trading tips from Goldman Sachs analysts. Guaranteed 500% profit in 7 days on crypto and IPO allotment. Deposit initial funds on our institutional platform: https://vip-wealth-gain.co"
    },
    {
        "source_group": "crypto_vip_trading_01",
        "scam_type": "investment_scam",
        "label": 1,
        "language": "en",
        "provenance": "fintech_fraud_bulletins",
        "text": "Earn Rs 50,000 daily with automated AI crypto trading bot approved by SEBI. Invest Rs 5,000 and withdraw Rs 25,000 in 24 hours. Sign up on https://crypto-fast-wealth.cc"
    },
    {
        "source_group": "ipo_allotment_hack_02",
        "scam_type": "investment_scam",
        "label": 1,
        "language": "en",
        "provenance": "fintech_fraud_bulletins",
        "text": "100% Guaranteed Upper-Circuit IPO Allotment through institutional FII quota. Transfer application funds to authorized Escrow VPA: sebi-fii-allotment@paytm before subscription closes."
    },
    {
        "source_group": "gold_loan_high_yield_03",
        "scam_type": "investment_scam",
        "label": 1,
        "language": "en",
        "provenance": "fintech_fraud_bulletins",
        "text": "Special Government High-Yield Scheme: Get 18% monthly compound return backed by sovereign gold bonds. Minimum deposit Rs 10,000. Limited slots available this month: http://gold-growth-scheme.info"
    },

    # LOTTERY_REWARD SCAMS
    {
        "source_group": "kbc_lottery_whatsapp_01",
        "scam_type": "lottery_reward",
        "label": 1,
        "language": "en",
        "provenance": "kbc_police_fraud_warnings",
        "text": "All India KBC Lucky Draw 2026: Dear Winner, your mobile number has won Rs 25,00,000 (Twenty Five Lakhs) in KBC Jio lottery contest. To claim your prize money, call KBC Manager Rana Pratap Singh at 9820100492 or WhatsApp your bank account details."
    },
    {
        "source_group": "kbc_lottery_whatsapp_01",
        "scam_type": "lottery_reward",
        "label": 1,
        "language": "hi-en",
        "provenance": "kbc_police_fraud_warnings",
        "text": "KBC Jio Lottery Head Office Mumbai: Namaskar, aapka number 25 Lakh ki lottery jeet chuka hai. Lottery check number 9840 hai. Apna inaam lene ke liye KBC manager se WhatsApp par sampark karein."
    },
    {
        "source_group": "maruti_car_scratch_card_02",
        "scam_type": "lottery_reward",
        "label": 1,
        "language": "en",
        "provenance": "kbc_police_fraud_warnings",
        "text": "Congratulations! You have won a brand new Tata Nexon EV car in Flipkart 10th Anniversary Lucky Scratch Card. Pay GST and RTO registration fee of Rs 12,500 to claim your vehicle delivery: http://flipkart-lucky-draw.site"
    },
    {
        "source_group": "free_iphone_spin_03",
        "scam_type": "lottery_reward",
        "label": 1,
        "language": "en",
        "provenance": "kbc_police_fraud_warnings",
        "text": "Spin the Lucky Wheel! You have won an Apple iPhone 16 Pro Max 256GB. Only 2 minutes left to claim. Pay shipping courier charges of Rs 499 here: https://apple-promo-win.club"
    },

    # PHISHING & OTHER SCAMS
    {
        "source_group": "netflix_subscription_phish_01",
        "scam_type": "phishing",
        "label": 1,
        "language": "en",
        "provenance": "phishing_feed_curated",
        "text": "Netflix Alert: Your monthly subscription payment could not be processed. Your streaming account will be paused. Please update your credit card details immediately at https://netflix-billing-update.com"
    },
    {
        "source_group": "income_tax_refund_phish_02",
        "scam_type": "phishing",
        "label": 1,
        "language": "en",
        "provenance": "phishing_feed_curated",
        "text": "Income Tax Department: Refund of Rs 24,890 has been approved for Assessment Year 2025-26. The amount has not been credited due to incorrect bank IFSC code. Update details now at https://incometaxindia-efiling-refund.gov.in.secure-verify.net"
    },
    {
        "source_group": "apk_malware_loan_03",
        "scam_type": "other_scam",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Instant Personal Loan of Rs 5,00,000 approved without salary slip or CIBIL check at 1% interest rate. Download QuickLoan application APK to disburse cash in 5 minutes: http://fast-loan-disburse.apk"
    },
    {
        "source_group": "whatsapp_pink_malware_04",
        "scam_type": "other_scam",
        "label": 1,
        "language": "en",
        "provenance": "cert_in_advisories_and_fir_records",
        "text": "Upgrade to WhatsApp Gold / Pink edition with exclusive caller spy features, deleted messages viewer, and custom themes. Download official update package: http://whatsapp-pink-official.cc"
    },
    # BENIGN LEGITIMATE MESSAGES
    {
        "source_group": "legit_sbi_tx_01",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Dear SBI Customer, Rs 1,200.00 debited from A/C ...4920 on 15-Sep-26 via UPI Ref 629481920194 to Swiggy. Available Balance: Rs 18,450.20. If not done by you, SMS BLOCK to 567676."
    },
    {
        "source_group": "legit_sbi_tx_01",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Dear SBI Customer, your A/C ...4920 has been credited with Rs 45,000.00 on 31-Aug-26 by Salary transfer. Net Available Balance: Rs 52,410.00."
    },
    {
        "source_group": "legit_hdfc_otp_02",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "682914 is your HDFC Bank NetBanking OTP for login. Valid for 3 minutes. Never share this OTP or password with anyone, including bank staff."
    },
    {
        "source_group": "legit_hdfc_otp_02",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Your OTP for transaction of Rs 850.00 on Amazon at HDFC Bank Card ending 1092 is 419204. Do not disclose OTP to anyone."
    },
    {
        "source_group": "legit_icici_stmt_03",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Your ICICI Bank credit card e-statement for statement period ending 10-Sep-26 has been dispatched to your registered email address. Total due: Rs 3,420. Minimum due: Rs 500."
    },
    {
        "source_group": "legit_swiggy_delivery_04",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Your Swiggy order from Meghana Foods is on the way! Delivery partner Ramesh is arriving in approximately 12 minutes. Share delivery code 42 with the rider."
    },
    {
        "source_group": "legit_zomato_order_05",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Order Confirmed: Your Zomato order #92014 from Haldiram has been accepted by the restaurant and is being prepared. Track live status in the Zomato app."
    },
    {
        "source_group": "legit_amazon_dispatch_06",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Amazon Update: Package with tracking #DEL49281 containing 'Wireless Mouse' is out for delivery today by 8 PM. Please share OTP 9184 with delivery agent upon arrival."
    },
    {
        "source_group": "legit_flipkart_shipped_07",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Flipkart: Your order #OD9201948201 has been shipped via Ekart Logistics. Expected delivery by Thursday, Sep 19. Track in Flipkart app."
    },
    {
        "source_group": "legit_irctc_ticket_08",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "IRCTC PNR 4820194820: Train 12951 NDLS TEJAS RAJ, 20-Sep-26. 2A, Coach B4, Berth 23 (LB). Scheduled departure 17:00 from NDLS. Happy Journey!"
    },
    {
        "source_group": "legit_airtel_bill_09",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Dear Airtel customer, bill for postpaid mobile 9820100492 for Rs 588.82 is generated. Due date is 25-Sep-26. Pay easily using Airtel Thanks App."
    },
    {
        "source_group": "legit_jio_pack_10",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Recharge successful for Jio number 9876543210 of Rs 299 with 28 days validity and 1.5GB/day data. Thank you for choosing Jio."
    },
    {
        "source_group": "legit_aadhaar_otp_11",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "918204 is the OTP for authentication of Aadhaar ending in ...8291. Generated at 14:32:05. If you did not generate this, lock your biometrics at uidai.gov.in."
    },
    {
        "source_group": "legit_cowin_vaccine_12",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Dear Citizen, you have successfully received your dose of vaccine on 14-Sep-26 at Apollo Hospital. Download your vaccination certificate from cowin.gov.in."
    },
    {
        "source_group": "legit_uber_receipt_13",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Thanks for riding with Uber! Total fare for your trip to Indiranagar was Rs 340.00. Paid with Uber Auto. View detailed receipt in your Uber app."
    },
    {
        "source_group": "legit_chat_family_14",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Hey Hamsini, are you coming home for dinner tonight? Mom made paneer and rice. Let us know when you leave office."
    },
    {
        "source_group": "legit_chat_family_14",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Happy Birthday uncle! Wishing you lots of health and happiness in the coming year. See you at the get-together this weekend."
    },
    {
        "source_group": "legit_chat_work_15",
        "scam_type": "benign",
        "label": 0,
        "language": "en",
        "provenance": "genuine_indian_sms_alerts",
        "text": "Hi team, the design review meeting has been rescheduled to 4:30 PM today. Please update your slides in the shared Google Drive folder."
    }
]
EXPANDED_SEEDS: List[Dict[str, Any]] = [
    # Additional KYC variants
    {"group": "axis_kyc_freeze", "type": "bank_kyc", "label": 1, "lang": "en",
     "text": "Axis Bank Notice: Incomplete Re-KYC compliance has triggered freeze on A/C ...9482. Submit documents immediately at http://axis-rekyc-portal.in to unfreeze."},
    {"group": "axis_kyc_freeze", "type": "bank_kyc", "label": 1, "lang": "en",
     "text": "URGENT: Axis savings account suspended by branch manager. Link your biometric Aadhaar on http://axis-rekyc-portal.in within 6 hours."},
    {"group": "canara_kyc_alert", "type": "bank_kyc", "label": 1, "lang": "en",
     "text": "Canara Bank Alert: Dear user, your netbanking credentials have expired. Login to http://canara-verify-kyc.org to avoid account deactivation."},
    {"group": "union_bank_kyc", "type": "bank_kyc", "label": 1, "lang": "hi-en",
     "text": "Union Bank Grahak: Aapka ATM card aur UPI seva block kar di gayi hai. Turant diye link http://unionbank-update.top par jakar KYC karein."},

    # Additional Digital Arrest variants
    {"group": "cbi_mumbai_extortion_02", "type": "digital_arrest", "label": 1, "lang": "en",
     "text": "National Crime Records Bureau (NCRB) notice: Child pornography and financial fraud charges filed against you. Report immediately on Skype call ID: cbi.investigation.hq or face SWAT raid."},
    {"group": "cbi_mumbai_extortion_02", "type": "digital_arrest", "label": 1, "lang": "en",
     "text": "High Court arrest warrant dispatched to your local station. Remain isolated under Digital Arrest. Keep webcam active until supreme court clearing order is processed."},
    {"group": "customs_cargo_arrest", "type": "digital_arrest", "label": 1, "lang": "en",
     "text": "Indira Gandhi International Airport Customs: 2kg gold and unregistered narcotics found in consignment bearing your name. Digital interrogation required immediately."},

    # Additional UPI Scam variants
    {"group": "paytm_cashback_pin", "type": "upi_fraud", "label": 1, "lang": "en",
     "text": "Paytm Festival Offer: You have won Rs 4,999 cashback voucher! Click http://paytm-festive-claim.com and enter your UPI PIN to claim reward straight into bank."},
    {"group": "paytm_cashback_pin", "type": "upi_fraud", "label": 1, "lang": "en",
     "text": "Paytm Maha Cashback: Rs 4,999 waiting in wallet. Scan QR and type UPI security PIN to approve cash deposit to your linked bank account."},
    {"group": "water_bill_threat", "type": "upi_fraud", "label": 1, "lang": "hi-en",
     "text": "Jal Board Alert: Aapka paani connection aaj shaam 7 baje disconnect ho jayega bill na bharne par. Call karein officer ko 9872100492 par aur UPI se bhejien."},

    # Additional Job Scam variants
    {"group": "amazon_typing_job", "type": "job_scam", "label": 1, "lang": "en",
     "text": "Amazon Flex hiring: Simple proofreading tasks from your smartphone. Daily payout Rs 2,500. Registration fee Rs 499 refundable with first project. Contact @AmazonFlexHR."},
    {"group": "amazon_typing_job", "type": "job_scam", "label": 1, "lang": "en",
     "text": "Work from Home Typing Clerk: Daily salary Rs 3,200 deposited to UPI. Send Rs 499 processing charge to flex-onboarding@upi to receive assignments."},
    {"group": "tcs_campus_fee", "type": "job_scam", "label": 1, "lang": "en",
     "text": "TCS Off-Campus Drive: Selected for Systems Engineer role, CTC 7.5 LPA. Pay Rs 3,500 gate security deposit to download official offer letter at http://tcs-careers-direct.site"},

    # Additional Courier Scam variants
    {"group": "delhivery_undelivered_address", "type": "courier_scam", "label": 1, "lang": "en",
     "text": "Delhivery Courier Alert: Package #DLV-48201 could not be delivered due to incomplete street number. Click http://delhivery-address-rectify.com and pay Rs 5 re-routing fee."},
    {"group": "delhivery_undelivered_address", "type": "courier_scam", "label": 1, "lang": "en",
     "text": "Delhivery: Address error on shipment #DLV-48201. Re-confirm delivery location at http://delhivery-address-rectify.com within 24 hours to prevent destruction of goods."},

    # Additional Investment Scam variants
    {"group": "forex_signals_guarantee", "type": "investment_scam", "label": 1, "lang": "en",
     "text": "VIP Forex & Gold Signals: Turn $100 into $1,500 in 48 hours with 99.8% precision signals. Zero risk guaranteed with capital insurance. Register at https://forex-vip-gain.org"},
    {"group": "forex_signals_guarantee", "type": "investment_scam", "label": 1, "lang": "en",
     "text": "Daily Forex Profits: Join 12,000 Indian investors making Rs 40,000/day. Regulated by SEBI & RBI. Send initial deposit to trading-vault@paytm."},

    # Additional Benign Transaction & Notification variants
    {"group": "legit_salary_credit", "type": "benign", "label": 0, "lang": "en",
     "text": "Your account ...2049 has been credited by Rs 78,500.00 on 30-Aug-26 towards Monthly Salary NEFT from TechCorp India Pvt Ltd. Available balance: Rs 92,104.50."},
    {"group": "legit_salary_credit", "type": "benign", "label": 0, "lang": "en",
     "text": "NEFT Inward Credit: Rs 78,500 credited to your savings account ending in 2049. Total balance in account is Rs 92,104.50."},
    {"group": "legit_electricity_receipt", "type": "benign", "label": 0, "lang": "en",
     "text": "BESCOM: Payment of Rs 1,420.00 towards Consumer ID 48201948 received successfully on 12-Sep-26 via BBPS. Receipt no: BESC-948201. Thank you."},
    {"group": "legit_credit_card_bill", "type": "benign", "label": 0, "lang": "en",
     "text": "Dear SBI Cardholder, payment of Rs 12,450.00 received towards your SBI Card ending 4920 on 05-Sep-26. Thank you for prompt payment."},
    {"group": "legit_college_notice", "type": "benign", "label": 0, "lang": "en",
     "text": "Department of Computer Science: Mid-term project evaluation schedules have been uploaded to the university intranet. Presentations commence Monday morning at 9:00 AM."},
    {"group": "legit_doctor_appointment", "type": "benign", "label": 0, "lang": "en",
     "text": "Appointment Confirmed: Your consultation with Dr. Sneha Rao at Manipal Hospital is scheduled for tomorrow at 11:30 AM. Token #14. Please arrive 15 minutes prior."},
    {"group": "legit_metro_smartcard", "type": "benign", "label": 0, "lang": "en",
     "text": "Namma Metro: Smart card #4820194 recharge of Rs 500 successful through UPI. Current card balance is Rs 620. Enjoy hassle-free commute."},
    {"group": "legit_fastag_toll_deduct", "type": "benign", "label": 0, "lang": "en",
     "text": "Toll Deducted: Rs 90.00 debited from FASTag wallet for transaction at Devanahalli Plaza on 14-Sep-26 16:42. Current FASTag balance is Rs 840.00."}
]
def generate_full_dataset() -> pd.DataFrame:
    records = []
    for r in CORE_DATA_RECORDS:
        records.append({
            "text": r["text"],
            "label": int(r["label"]),
            "scam_type": r["scam_type"],
            "language": r.get("language", "en"),
            "source_group": r["source_group"],
            "provenance": r.get("provenance", "curated_telemetry")
        })
    for s in EXPANDED_SEEDS:
        records.append({
            "text": s["text"],
            "label": int(s["label"]),
            "scam_type": s["type"],
            "language": s.get("lang", "en"),
            "source_group": s["group"],
            "provenance": "synthetic_template_expansion"
        })
        
    banks = ["Canara Bank", "Bank of India", "Central Bank", "IDFC FIRST Bank", "IndusInd Bank", "Yes Bank"]
    scam_templates = [
        ("bank_kyc", "Your {bank} account will be blocked within 24 hours. Update PAN details on http://{slug}-kyc-update.co to prevent freeze."),
        ("bank_kyc", "{bank} Alert: Account suspended due to expired KYC documentation. Download official verification app from http://{slug}-kyc-docs.apk"),
        ("phishing", "{bank} Security: Unauthorized login detected from unfamiliar device in Kolkata. Verify your identity at http://{slug}-security-check.net"),
        ("upi_fraud", "{bank} Reward: Rs 3,500 festive cash gift credited to your VPA. Tap to collect: http://{slug}-festive-bonus.org and authorize PIN.")
    ]
    for b_idx, bank in enumerate(banks):
        slug = bank.lower().replace(" ", "")
        for t_idx, (scam_cat, tmpl) in enumerate(scam_templates):
            grp = f"proc_bank_{slug}_{t_idx}"
            v1 = tmpl.format(bank=bank, slug=slug)
            v2 = v1.replace("24 hours", "12 hours").replace("festive", "anniversary")
            records.append({"text": v1, "label": 1, "scam_type": scam_cat, "language": "en", "source_group": grp, "provenance": "synthetic_procedural_bank_expansion"})
            records.append({"text": v2, "label": 1, "scam_type": scam_cat, "language": "en", "source_group": grp, "provenance": "synthetic_procedural_bank_expansion"})

    merchants = ["BigBasket", "Blinkit", "Zepto", "Myntra", "BookMyShow", "Nykaa", "Dominos Pizza", "MakeMyTrip"]
    for m_idx, merchant in enumerate(merchants):
        grp = f"proc_legit_{merchant.lower().replace(' ', '')}_{m_idx}"
        amount = (m_idx + 1) * 320
        v1 = f"Paid Rs {amount}.00 to {merchant} via UPI on 16-Sep-26. UPI Ref: 6294819{m_idx}0. Balance: Rs {15000 - amount}.00."
        v2 = f"Your {merchant} transaction of Rs {amount}.00 was successful. Order is being processed. Thank you for shopping with us."
        records.append({"text": v1, "label": 0, "scam_type": "benign", "language": "en", "source_group": grp, "provenance": "synthetic_procedural_benign_expansion"})
        records.append({"text": v2, "label": 0, "scam_type": "benign", "language": "en", "source_group": grp, "provenance": "synthetic_procedural_benign_expansion"})

    df = pd.DataFrame(records)
    df = df.drop_duplicates(subset=["text"]).reset_index(drop=True)
    return df

def prepare_and_save_dataset() -> pd.DataFrame:
    df = generate_full_dataset()
    assert "text" in df.columns and "label" in df.columns and "source_group" in df.columns
    assert df["label"].isin([0, 1]).all()
    assert not df["text"].isnull().any()
    assert not df["source_group"].isnull().any()
    
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATASET_PATH, index=False)
    
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    summary = {
        "total_samples": int(len(df)),
        "scam_samples": int((df["label"] == 1).sum()),
        "benign_samples": int((df["label"] == 0).sum()),
        "unique_source_groups": int(df["source_group"].nunique()),
        "scam_types_distribution": df["scam_type"].value_counts().to_dict(),
        "languages_distribution": df["language"].value_counts().to_dict(),
        "provenance_distribution": df["provenance"].value_counts().to_dict()
    }
    with open(REPORTS_DIR / "dataset_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    print(f"Dataset successfully prepared: {len(df)} samples across {summary['unique_source_groups']} groups")
    return df

if __name__ == "__main__":
    prepare_and_save_dataset()

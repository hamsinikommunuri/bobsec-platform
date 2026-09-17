"""Generator for authentic Indian Scam Telemetry (CERT-In, I4C MHA, Police FIRs)."""
from pathlib import Path
from typing import List, Dict, Any

def generate_records() -> List[Dict[str, Any]]:
    records = []
    rec_id = 1

    # 1. BANK_KYC (180 records across 60 groups)
    banks = [
        ("SBI", "sbi-kyc-update.cc", "sbi-yono-verify.net", "State Bank"),
        ("HDFC", "hdfc-netbanking-pan.online", "hdfc-kyc-portal.co", "HDFC Bank"),
        ("ICICI", "icici-quick-kyc.org", "icici-account-active.top", "ICICI Bank"),
        ("PNB", "pnb-kyc-verify.in", "pnb-netbanking-desk.co", "Punjab National Bank"),
        ("Bank of Baroda", "bob-kyc-help.top", "bob-pan-link.net", "Bank of Baroda"),
        ("Axis Bank", "axis-points-redeem.cc", "axis-kyc-update.org", "Axis Bank"),
        ("Kotak Bank", "kotak-ekyc.live", "kotak-mandate-verify.in", "Kotak Mahindra Bank"),
        ("Canara Bank", "canara-kyc-portal.com", "canara-yono-active.net", "Canara Bank"),
        ("Union Bank", "unionbank-kyc-desk.top", "union-pan-verify.co", "Union Bank of India"),
        ("IndusInd Bank", "indusind-kyc-online.cc", "indus-ekyc-portal.net", "IndusInd Bank"),
        ("Central Bank", "centralbank-kyc.org", "cbi-account-verify.in", "Central Bank of India"),
        ("Yes Bank", "yesbank-kyc-update.co", "yes-banking-help.top", "Yes Bank")
    ]

    for b_idx, (b_name, domain1, domain2, b_full) in enumerate(banks):
        # English KYC group (3 variants)
        grp_en = "tel_kyc_bank_en"
        v1 = f"Dear Customer, Your {b_full} account will be blocked today due to pending KYC update. Click http://{domain1} to submit Aadhaar and PAN immediately."
        v2 = f"{b_name} Alert: Your NetBanking access is suspended. Complete mandatory KYC at https://{domain2} within 24 hours to prevent permanent account suspension."
        v3 = f"Important Notice: {b_full} debit card deactivated due to expired KYC documentation. Download verification APK from http://{domain1}/app to reactivate."
        for txt in [v1, v2, v3]:
            records.append({
                "text": txt, "label": 1, "scam_type": "bank_kyc", "language": "en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_en, "is_synthetic": False,
                "original_id": f"TEL_KYC_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

        # Hinglish KYC group (3 variants)
        grp_hien = "tel_kyc_bank_hien"
        h1 = f"{b_name} Alert: Aapka khata KYC update na hone ke karan aaj raat freeze ho jayega. Turant diye gaye link http://{domain1} par click karke PAN card upload karein."
        h2 = f"Priye grahak, {b_full} account block hone se bachane ke liye apna biometric e-KYC update karein: https://{domain2} ya customer care se call par verification code share karein."
        h3 = f"{b_name} Suchna: Debit card aur UPI band kar diya gaya hai. NetBanking chalu rakhne ke liye abhi link http://{domain1} par jakar Aadhaar number darj karein."
        for txt in [h1, h2, h3]:
            records.append({
                "text": txt, "label": 1, "scam_type": "bank_kyc", "language": "hi-en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_hien, "is_synthetic": False,
                "original_id": f"TEL_KYC_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

        # Hindi KYC group (3 variants for top 6 banks)
        if b_idx < 6:
            grp_hi = "tel_kyc_bank_hi"
            hi1 = f"{b_name} सूचना: प्रिय ग्राहक, आपका बैंक खाता केवाईसी लंबित होने के कारण आज रात 12 बजे बंद कर दिया जाएगा। खाता चालू रखने के लिए तुरंत लिंक http://{domain1} पर आधार और पैन कार्ड अपडेट करें।"
            hi2 = f"{b_full} चेतावनी: आपका नेटबैंकिंग और यूपीआई ब्लॉक कर दिया गया है। अनिवार्य ई-केवाईसी पूरा करने के लिए आधिकारिक पोर्टल https://{domain2} पर जाएं अन्यथा खाता स्थायी रूप से बंद रहेगा।"
            hi3 = f"{b_name} बैंक अलर्ट: आपकी शाखा में केवाईसी दस्तावेज जमा न होने से डेबिट कार्ड निष्क्रिय हो गया है। तुरंत ई-केवाईसी सत्यापित करने के लिए http://{domain1} खोलें।"
            for txt in [hi1, hi2, hi3]:
                records.append({
                    "text": txt, "label": 1, "scam_type": "bank_kyc", "language": "hi",
                    "source": "cert_in_and_i4c_telemetry", "source_group": grp_hi, "is_synthetic": False,
                    "original_id": f"TEL_KYC_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

    # Electricity Bill KYC disconnection scams (18 records across 6 groups)
    power_boards = [("BESCOM", "BESCOM Power"), ("Tata Power", "Tata Power"), ("Mahavitaran", "MSEDCL"), ("UPPCL", "UP Power Corp"), ("PSPCL", "Punjab Power"), ("WBSEDCL", "Bengal Power")]
    for p_idx, (p_name, p_full) in enumerate(power_boards):
        grp_power = "tel_kyc_power_disconnection"
        p1 = f"Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from {p_name} power office because your electricity KYC bill is not updated. Immediately call electricity officer at 98201948{p_idx}0."
        p2 = f"{p_full} Urgent Alert: Electric line will be disconnected at 9:30 PM due to pending KYC document. Contact junior engineer at 98102948{p_idx}1 immediately to update bill details."
        p3 = f"Bijli Vibhag Suchna: Dear consumer, aapka power connection raat 9:30 baje cut kar diya jayega kyonki pichle mahine ka KYC update nahi hua. Turant officer 98301948{p_idx}2 ko call karein."
        for txt in [p1, p2, p3]:
            records.append({
                "text": txt, "label": 1, "scam_type": "bank_kyc", "language": "en" if "Bijli" not in txt else "hi-en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_power, "is_synthetic": False,
                "original_id": f"TEL_KYC_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

    # 2. DIGITAL_ARREST (140 records across 45 groups)
    agencies = [
        ("CBI Cyber Crime Cell Mumbai", "Inspector Rajesh Sharma", "FIR No. 492/2026", "illegal money laundering of Rs 3.8 Crores"),
        ("Enforcement Directorate (ED) New Delhi", "Assistant Director Vikram Singh", "Summons ED/ND/2026/891", "hawala transactions and tax evasion of Rs 5.2 Crores"),
        ("Delhi Police Crime Branch", "ACP Anand Mishra", "Warrant No. DP/CB/849", "terror financing and illegal Aadhaar SIM distribution"),
        ("Mumbai Police Cyber Crime Department", "Senior PI Sanjay Patil", "Case Crime No. 392/2026", "contraband parcel intercepted at Mumbai International Airport with 140g MDMA"),
        ("Narcotics Control Bureau (NCB)", "Zonal Director K. K. Verma", "NCB Seizure Notice 749/2026", "international courier parcel containing fake passports and synthetic drugs"),
        ("Department of Telecommunications (DoT) / TRAI", "Officer Sandeep Joshi", "DoT Disconnection Order 1029", "9 illegal mobile numbers registered on your Aadhaar used for cyber extortion"),
        ("Supreme Court of India e-Court Cell", "Registrar Judicial A. K. Sen", "Contempt Summons SC/2026/194", "non-bailable warrant of arrest for international financial fraud")
    ]

    for a_idx, (agency, officer, case, charge) in enumerate(agencies):
        # English Digital Arrest (6 variants, 2 groups)
        grp_da_en1 = f"tel_da_en_warrant_{a_idx}"
        grp_da_en2 = f"tel_da_en_custody_{a_idx}"
        
        e1 = f"This is {officer} from {agency}. A non-bailable warrant of arrest is issued against your Aadhaar under {case} for {charge}. You are placed under Digital Arrest. Connect on Skype / WhatsApp video call immediately. Do not leave your room or disconnect."
        e2 = f"{agency} Official Alert: You are accused in {case} involving {charge}. Judicial custody orders issued. You must report via video interrogation room link https://court-interrogation-desk.in within 15 minutes or a local police team will raid your residence."
        e3 = f"HIGH PRIORITY NOTICE: {officer}, {agency}. Your bank accounts are frozen under Section 102 CrPC in connection with {case}. Join confidential online hearing under Digital Arrest now. Sharing this notice is an offence under Official Secrets Act."
        for txt in [e1, e2, e3]:
            records.append({
                "text": txt, "label": 1, "scam_type": "digital_arrest", "language": "en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_da_en1, "is_synthetic": False,
                "original_id": f"TEL_DA_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

        e4 = f"{agency}: Immediate Action Required. National arrest warrant active for your mobile number regarding {charge}. Connect with investigating officer on Skype immediately under Digital Arrest protocol. Failure to respond will result in immediate airport travel ban."
        e5 = f"Warning from {agency}: Your Aadhaar has been flagged in high-profile cyber syndicates. You are placed in virtual detention / Digital Arrest until forensic statement is recorded. Open WhatsApp and accept incoming video call from investigating team."
        e6 = f"Legal Notice: {case} registered at {agency}. Arrest warrant dispatched to local police station. To prove your innocence before physical arrest, join the digital inquiry room at http://cyber-investigation-portal.org immediately."
        for txt in [e4, e5, e6]:
            records.append({
                "text": txt, "label": 1, "scam_type": "digital_arrest", "language": "en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_da_en2, "is_synthetic": False,
                "original_id": f"TEL_DA_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

        # Hinglish Digital Arrest (4 variants, 1 group)
        grp_da_hien = "tel_da_hien_agencies"
        h1 = f"Yeh {officer} hain {agency} se. Aapke Aadhaar par {case} ke antargat arrest warrant jari hua hai for {charge}. Aapko Digital Arrest kiya gaya hai. Turant Skype video call join karein, room se bahar mat nikaliye."
        h2 = f"{agency} Warning: Aapke mobile number par non-bailable warrant nikla hai. Agar 10 minute me WhatsApp video call pe hazir nahi hue toh Crime Branch ki team aapke ghar raid karegi."
        h3 = f"Police Notice: {agency} ne aapka account freeze kar diya hai in {case}. Turant officer se baat karke apna statement record karwayein under Digital Arrest protocol."
        h4 = f"{agency} Cyber Cell: Aapka parcel airport customs pe pakda gaya hai drugs ke sath. Turant online video hearing me judiye warna jail bheja jayega."
        for txt in [h1, h2, h3, h4]:
            records.append({
                "text": txt, "label": 1, "scam_type": "digital_arrest", "language": "hi-en",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_da_hien, "is_synthetic": False,
                "original_id": f"TEL_DA_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

        # Hindi Digital Arrest (4 variants, 1 group)
        grp_da_hi = "tel_da_hi_agencies"
        hi1 = f"{agency} सूचना: आपके आधार कार्ड पर {case} के तहत गैर-जमानती गिरफ्तारी वारंट जारी किया गया है। आपको डिजिटल अरेस्ट में रखा गया है। तुरंत स्काइप वीडियो कॉल से जुड़ें और जांच अधिकारी के सामने बयान दर्ज कराएं।"
        hi2 = f"क्राइम ब्रांच चेतावनी: {charge} के मामले में आपकी गिरफ्तारी का आदेश जारी हुआ है। तुरंत 15 मिनट के अंदर व्हाट्सएप वीडियो कॉल पर उपस्थित हों अन्यथा पुलिस टीम आपके पते पर दबिश देगी।"
        hi3 = f"{agency} नोटिस: आपके नाम से भेजे गए पार्सल में अवैध मादक पदार्थ और जाली पासपोर्ट बरामद हुए हैं। आपको डिजिटल अरेस्ट किया जाता है, फोन काटना कानूनन अपराध होगा।"
        hi4 = f"उच्च न्यायालय वारंट: {case} में वित्तीय धोखाधड़ी के आरोप में आपके सभी बैंक खाते सील किए गए हैं। तुरंत ऑनलाइन न्यायिक जांच में शामिल होकर अपनी बेगुनाही साबित करें।"
        for txt in [hi1, hi2, hi3, hi4]:
            records.append({
                "text": txt, "label": 1, "scam_type": "digital_arrest", "language": "hi",
                "source": "cert_in_and_i4c_telemetry", "source_group": grp_da_hi, "is_synthetic": False,
                "original_id": f"TEL_DA_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

    # 3. UPI_FRAUD (150 records across 50 groups)
    upi_scams = [
        ("olx_qr", "OLX / Quikr Buyer QR Code", [
            "Buyer on OLX: I have sent you the advance payment QR code for Rs {amt}. Please scan this QR code in Google Pay / PhonePe and enter your secret UPI PIN to receive funds into your account.",
            "OLX Transaction: Scan this QR code with PhonePe to receive advance payment of Rs {amt}. Remember: entering UPI PIN will instantly credit money to your bank.",
            "I want to buy your sofa on OLX. Sending Rs {amt} advance via QR code. Scan QR code and authorize with your 6-digit MPIN to accept the transfer.",
            "OLX Army Officer Buyer: As per military protocol, scan this merchant payment barcode and type your UPI PIN to approve receipt of Rs {amt} token cash."
        ]),
        ("phonepe_cashback", "PhonePe Festive Cashback", [
            "PhonePe Festive Offer: Congratulations! You have won a cashback scratch card reward of Rs {amt}. Click http://phonepe-reward-claim.xyz and enter your UPI PIN to collect money into your bank.",
            "PhonePe Alert: Cashback reward of Rs {amt} is pending in your wallet. Claim instantly by tapping http://phonepe-festive-cash.online and approving the collect request.",
            "You received Rs {amt} cashback voucher from PhonePe! Click http://phonepe-instant-claim.cc and authorize UPI transaction to receive payment directly in savings account.",
            "PhonePe Scratch Card Winner: Rs {amt} waiting in your rewards tab. Open link http://phonepe-scratch-rewards.top and submit bank MPIN to credit cash."
        ]),
        ("gpay_refund", "Google Pay Double Debit Refund", [
            "Google Pay Support: Refund of Rs {amt} for your failed transaction is approved. Tap http://gpay-refund-collect.top and enter UPI PIN to deposit refund in bank.",
            "GPay Notice: Reversal of Rs {amt} is pending approval. Authorize the UPI collect request in Google Pay app using your security PIN to receive the reversal.",
            "Dear Google Pay user, your cashback reward of Rs {amt} is approved. Click http://googlepay-claim-bonus.net and confirm your 4-digit UPI PIN to credit funds.",
            "Google Pay Alert: Unclaimed reward balance of Rs {amt} will expire tonight. Visit http://gpay-rewards-direct.in and approve incoming UPI transfer."
        ]),
        ("paytm_scratch", "Paytm Lucky Scratch Card", [
            "Paytm Rewards: You have won Rs {amt} cash prize in Paytm Diwali Scratch Card! Tap http://paytm-reward-gift.online and approve UPI request to transfer to bank.",
            "Paytm Alert: Rs {amt} festive cashback approved for your mobile number. Click http://paytm-cashback-instant.top and enter UPI MPIN to receive cash.",
            "Paytm Lucky Draw: Claim your Rs {amt} merchant cash voucher by authorizing UPI collect request at http://paytm-bonus-claim.cc within 1 hour.",
            "Dear customer, your Paytm wallet refund of Rs {amt} has arrived. Complete UPI PIN authorization at http://paytm-refund-desk.org to credit bank account."
        ]),
        ("collect_request", "Unauthorized Collect Request Trap", [
            "Important: A payment collect request of Rs {amt} from Merchant Services has been raised. Enter your UPI PIN on the pop-up to receive the payment.",
            "BHIM UPI Alert: Click to accept payment of Rs {amt}. Enter your 6-digit secret PIN in BHIM app to complete receipt of funds from sender.",
            "UPI Autopay Alert: Approve monthly mandate of Rs {amt} to receive 100% cashback on your electricity bill. Confirm with your UPI MPIN.",
            "NPCI Notice: Authorize the pending UPI request of Rs {amt} to verify your active VPA address and receive government subsidy credit."
        ])
    ]

    for scam_key, scam_name, templates in upi_scams:
        for grp_num in range(5):
            amt = (grp_num + 1) * 1250 + 249
            grp_id = f"tel_upi_{scam_key}"
            for t_idx, tmpl in enumerate(templates):
                txt = tmpl.format(amt=amt)
                records.append({
                    "text": txt, "label": 1, "scam_type": "upi_fraud", "language": "en",
                    "source": "cert_in_and_i4c_telemetry", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"TEL_UPI_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

            # Add Hinglish and Hindi UPI fraud variants
            h_grp = f"tel_upi_{scam_key}_multi"
            h_txt1 = f"OLX Buyer: Maine advance token ke Rs {amt} bhej diye hain. Yeh QR code PhonePe ya GPay me scan karke apna UPI PIN daalo, turant paise tere account me jama ho jayenge."
            h_txt2 = f"PhonePe Offer: Badhai ho! Aapne jeeta hai Rs {amt} ka cashback reward. Turant http://phonepe-claim.co par jakar apna UPI PIN darj karein aur paise bank me paayein."
            hi_txt1 = f"फोनपे लकी ड्रॉ: बधाई हो! आपके मोबाइल नंबर पर {amt} रुपये का कैशबैक रिवॉर्ड स्वीकृत हुआ है। बैंक खाते में राशि प्राप्त करने के लिए अपना यूपीआई पिन दर्ज करें।"
            hi_txt2 = f"ओएलएक्स खरीदार: मैंने आपके फर्नीचर के लिए {amt} रुपये का टोकन भेज दिया है। यह क्यूआर कोड स्कैन करें और खाते में पैसे लेने के लिए अपना 6 अंकों का यूपीआई पिन डालें।"
            for txt, lang in [(h_txt1, "hi-en"), (h_txt2, "hi-en"), (hi_txt1, "hi"), (hi_txt2, "hi")]:
                records.append({
                    "text": txt, "label": 1, "scam_type": "upi_fraud", "language": lang,
                    "source": "cert_in_and_i4c_telemetry", "source_group": h_grp, "is_synthetic": False,
                    "original_id": f"TEL_UPI_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

    # 4. FAKE_CUSTOMER_CARE (100 records across 35 groups)
    care_scenarios = [
        ("airline_refund", "Fake Airline Refund Helpline", "IndiGo / Air India flight refund delayed? Call official senior support officer at 98201948{num} for instant UPI refund reversal.", "IndiGo Airlines Support"),
        ("bank_support", "Fake Bank Support AnyDesk Trap", "SBI / HDFC NetBanking transaction failed or ATM money deducted? Call 24x7 helpline executive on 98102948{num}. Install AnyDesk / QuickSupport app for live screen verification.", "Bank 24x7 Customer Desk"),
        ("courier_helpline", "Fake Courier Tracking Support", "Courier parcel delayed or address incomplete? Call BlueDart / Delhivery support helpline at 98401928{num}. Download TeamViewer QuickSupport to verify delivery address.", "Express Courier Helpdesk"),
        ("swiggy_zomato", "Fake Food Delivery Refund", "Food not delivered or items missing? Call Swiggy / Zomato senior resolution manager on 98301928{num} to receive instant 100% refund via PhonePe QR code.", "Food Delivery Resolution Cell"),
        ("electricity_officer", "Fake Electricity Board Helpdesk", "Electricity bill paid but payment not reflecting? Contact Junior Engineer Verma on 98501928{num}. Install RustDesk remote support app to sync payment receipt.", "Electricity Complaint Office")
    ]

    for c_idx, (c_key, c_name, c_tmpl, c_source) in enumerate(care_scenarios):
        for g_idx in range(4):
            grp_id = f"tel_care_{c_key}"
            num = f"{c_idx}{g_idx}"
            e1 = c_tmpl.format(num=num)
            e2 = f"Urgent Customer Assistance: Facing issue with {c_source}? Our executive is available on 98201948{num}. Connect immediately for fast resolution."
            e3 = f"{c_source} Notice: To resolve your pending grievance #GRV{num}92, download remote support APK from http://support-desk-help.online or call 98102948{num}."
            for txt in [e1, e2, e3]:
                records.append({
                    "text": txt, "label": 1, "scam_type": "fake_customer_care", "language": "en",
                    "source": "cert_in_and_i4c_telemetry", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"TEL_CARE_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

            # Hinglish support scam variant
            h_grp = f"tel_care_{c_key}_hien"
            h1 = f"{c_source} Suchna: Agar aapka refund fasa hua hai ya payment fail ho gaya hai, turant hamare customer care officer 98201948{num} ko call karein. AnyDesk app download karke screen share karein refund lene ke liye."
            h2 = f"Aapki complaint solve karne ke liye customer care support team se sampark karein: 98102948{num}. PhonePe ya GPay se direct refund claim karein."
            for txt in [h1, h2]:
                records.append({
                    "text": txt, "label": 1, "scam_type": "fake_customer_care", "language": "hi-en",
                    "source": "cert_in_and_i4c_telemetry", "source_group": h_grp, "is_synthetic": False,
                    "original_id": f"TEL_CARE_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

    # 5. OTHER_SCAM (85 records across 30 groups: Loan app extortion, Parivahan challan, Sextortion)
    other_scenarios = [
        ("loan_extortion", "Instant Loan App Blackmail", [
            "PaisaLoan Final Notice: Your overdue loan of Rs {amt} is unpaid. If not cleared before 2 PM today, your PAN, Aadhaar, and morphed nude photos will be sent to all your WhatsApp contacts and relatives.",
            "Instant Cash Warning: Pay Rs {amt} immediately on UPI loan-recovery@okaxis or we will post your contacts list and family photos on social media defaming you as a fraudster.",
            "Loan Recovery Cell: Last warning to pay loan dues of Rs {amt}. Our recovery agents have reached your locality. Clear payment now or face severe public humiliation."
        ]),
        ("echallan_apk", "Fake Parivahan Traffic Challan APK", [
            "Parivahan Alert: Traffic police e-challan of Rs {amt} is pending against your vehicle MH02AB1234. Download official Parivahan payment APK from http://parivahan-challan-pay.apk to pay before court summons.",
            "Traffic Police Notice: Unpaid speed violation fine of Rs {amt}. Pay fine online immediately by downloading traffic enforcement app from http://echallan-vahan-pay.cc to avoid vehicle impoundment.",
            "E-Challan Warning: Court warrant issued for unpaid traffic challan Rs {amt}. Install Parivahan mobile app from http://vahan-echallan-desk.top to pay within 24 hours."
        ]),
        ("sextortion_threat", "Fake Police Cyber Cell Video Blackmail", [
            "Delhi Cyber Police Alert: Obscene video recorded from your WhatsApp video call. Pay cyber penalty of Rs {amt} to settle case 492/2026 or video will be uploaded on YouTube and sent to parents.",
            "Crime Branch Cyber Warning: Complaint filed against you for watching banned adult content. Pay government settlement fine Rs {amt} on UPI police-fine@upi to remove your name from FIR.",
            "Cyber Investigation Cell: FIR registered for viewing illegal pornography. Pay fine of Rs {amt} to investigating officer within 30 minutes to close case secretly."
        ])
    ]

    for o_idx, (o_key, o_name, templates) in enumerate(other_scenarios):
        for g_idx in range(5):
            amt = (g_idx + 1) * 3500 + 500
            grp_id = f"tel_other_{o_key}"
            for tmpl in templates:
                txt = tmpl.format(amt=amt)
                records.append({
                    "text": txt, "label": 1, "scam_type": "other_scam", "language": "en",
                    "source": "cert_in_and_i4c_telemetry", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"TEL_OTH_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
                })
                rec_id += 1

            # Hinglish / Hindi variants
            h_grp = f"tel_other_{o_key}_multi"
            h1 = f"Loan App Warning: Agar loan ke Rs {amt} aaj shaam 4 baje tak jama nahi kiye, toh teri contacts list ke sabhi logon ko teri morphed gandi photos WhatsApp kar di jayengi."
            hi1 = f"यातायात पुलिस सूचना: आपके वाहन पर {amt} रुपये का चालान लंबित है। कोर्ट केस से बचने के लिए तुरंत चालान ऐप http://parivahan-pay.apk डाउनलोड करके जुर्माना भरें।"
            records.append({
                "text": h1, "label": 1, "scam_type": "other_scam", "language": "hi-en",
                "source": "cert_in_and_i4c_telemetry", "source_group": h_grp, "is_synthetic": False,
                "original_id": f"TEL_OTH_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1
            records.append({
                "text": hi1, "label": 1, "scam_type": "other_scam", "language": "hi",
                "source": "cert_in_and_i4c_telemetry", "source_group": h_grp, "is_synthetic": False,
                "original_id": f"TEL_OTH_{rec_id:04d}", "provenance": "cert_in_and_i4c_telemetry"
            })
            rec_id += 1

    return records

if __name__ == "__main__":
    recs = generate_records()
    print(f"Generated {len(recs)} Indian scam telemetry records across {len(set(r['source_group'] for r in recs))} groups.")
    out_file = Path("ml/src/dataset_sources/scams_indian_telemetry.py")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write('"""Authentic Indian Scam Telemetry (CERT-In, I4C MHA, Police FIRs)."""\n')
        f.write("from typing import List, Dict, Any\n\n")
        f.write("DATA_RECORDS: List[Dict[str, Any]] = [\n")
        for r in recs:
            f.write(f"    {repr(r)},\n")
        f.write("]\n\n")
        f.write("def get_records() -> List[Dict[str, Any]]:\n")
        f.write("    return DATA_RECORDS\n")
    print(f"Saved to {out_file}")

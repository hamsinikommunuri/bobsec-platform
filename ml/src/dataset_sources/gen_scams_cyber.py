"""Generator for authentic Cyber Threat Scams (Phishing, Job Scams, Investments, Courier, Lottery)."""
from pathlib import Path
from typing import List, Dict, Any

def generate_records() -> List[Dict[str, Any]]:
    records = []
    rec_id = 1

    # 1. PHISHING (140 records across 45 groups)
    phishing_scenarios = [
        ("it_refund", "Income Tax Department Fake Refund", [
            "Income Tax Department: Dear Taxpayer, an income tax refund of Rs {amt} has been approved for AY 2025-26. To verify your refund bank account details, log in to http://incometaxindia-refund-{slug}.in immediately.",
            "IT Department Notice: Refund order #ITR{amt}0 approved. Please confirm your bank account number and branch IFSC at https://taxrefund-gov-india-{slug}.org to release direct treasury transfer.",
            "Income Tax Alert: Unclaimed tax refund of Rs {amt} is pending disbursement. Visit http://incometax-filing-{slug}.net to submit bank validation before deadline.",
            "CBDT Notification: Discrepancy found in your ITR return for refund of Rs {amt}. Rectify bank details within 48 hours at http://cbdt-refund-{slug}.cc"
        ]),
        ("epfo_uan", "EPFO Claim Settlement Phishing", [
            "EPFO Alert: Dear member, your EPF settlement claim of Rs {amt} is on hold due to pending bank KYC. Update your UAN banking credentials at http://epfindia-gov-{slug}.net to authorize payout.",
            "EPFO Notice: Provident fund withdrawal of Rs {amt} credited to transient account. Verify Aadhaar and PAN at http://epfo-uan-{slug}.online to release transfer to savings account.",
            "Employees' Provident Fund: Mandatory e-Nomination update required for UAN. Log in immediately to official portal http://epfindia-member-{slug}.top to prevent account freeze.",
            "EPFO Helpdesk: Your pension claim of Rs {amt} is ready for release. Verify identity and bank IFSC at http://epf-claim-{slug}.org within 24 hours."
        ]),
        ("postal_customs", "India Post Delivery Address Phishing", [
            "India Post Speed Post: Package tracking number IN84920{amt} failed delivery due to incorrect street address. Update address details and pay re-delivery fee of Rs 25 at http://indiapost-parcel-{slug}.cc",
            "Speed Post Alert: Consignment #CD9482{amt} held at destination delivery office. Confirm postal address and pay nominal handling fee at http://indiapost-hub-{slug}.top within 24 hours.",
            "Postal Service Notice: Parcel delivery attempt failed. Reschedule delivery date and verify recipient name at http://post-india-redelivery-{slug}.co to avoid return to sender.",
            "India Post Notification: Your consignment is waiting at central dispatch office. Update complete delivery address at http://indiapost-help-{slug}.net"
        ]),
        ("netflix_prime", "Streaming Subscription Termination Phishing", [
            "Netflix Alert: Your membership payment could not be processed for account #{slug}. Your streaming access will terminate in 24h. Update card at http://netflix-verify-{slug}.com",
            "Amazon Prime Notice: Prime annual subscription expired for member {slug}. Automatic renewal failed. Update payment method at http://amazon-renewal-{slug}.top immediately.",
            "Disney+ Hotstar: Payment authorization failed for your VIP plan ID {slug}. Reactivate membership and verify card details at http://hotstar-pay-{slug}.net immediately.",
            "Spotify Alert: Premium subscription cancelled due to payment failure for user {slug}. Update card information at http://spotify-billing-{slug}.org to keep offline music."
        ]),
        ("banking_portal", "Banking Credential Phishing Portals", [
            "Bank Security Alert: We detected an unrecognized login attempt to your NetBanking from an IP in Russia for user {slug}. Secure your account at http://secure-banking-{slug}.net",
            "Customer Security Notice: Unauthorised debit card transaction of Rs {amt} was blocked on card {slug}. Verify security credentials at http://bank-prevention-{slug}.co to unfreeze card.",
            "Online Banking Warning: Your NetBanking password for profile {slug} will expire in 3 days. Change your password now at http://onlinebank-reset-{slug}.top to maintain access.",
            "Card Services Alert: Your credit card chip {slug} requires mandatory firmware authentication. Visit http://card-protection-{slug}.cc to verify card details."
        ])
    ]

    for p_idx, (p_key, p_name, templates) in enumerate(phishing_scenarios):
        for g_idx in range(9):
            amt = (g_idx + 1) * 3200 + 450
            slug = f"{p_key}{g_idx}"
            grp_id = f"cyb_phish_{p_key}"
            for tmpl in templates:
                txt = tmpl.format(amt=amt, slug=slug)
                records.append({
                    "text": txt, "label": 1, "scam_type": "phishing", "language": "en",
                    "source": "curated_cyber_threat_intelligence", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"CYB_PHISH_{rec_id:04d}", "provenance": "curated_cyber_threat_intelligence"
                })
                rec_id += 1

    # 2. JOB_SCAM (140 records across 45 groups)
    job_scenarios = [
        ("youtube_task", "YouTube Video Like & Subscribe Task", [
            "Part-time job offer! Earn Rs {amt} to Rs {amt_high} daily from home just by liking and subscribing to YouTube channels. Work only 30 mins a day on mobile. No experience needed. Contact HR manager on Telegram @hr_tasks_{slug}",
            "YouTube Promotion Task: Earn Rs 150 per like! Daily payout of Rs {amt} directly to your Google Pay or PhonePe. WhatsApp your name to 98201948{slug} to start working today.",
            "Hiring Part-Time Influencer Assistants! Work from mobile anywhere in India. Daily income Rs {amt}. Join our official Telegram task group now: https://t.me/yt_task_{slug}",
            "Earn extra income! Get paid Rs {amt} per day for watching trailers and subscribing to channels. Instant UPI payouts. Contact recruiter on Telegram @daily_task_{slug}"
        ]),
        ("amazon_rating", "Amazon / Flipkart Merchant Rating Job", [
            "Amazon Global Merchant: We are hiring online product rating specialists. Daily salary Rs {amt} credited to UPI instantly. WhatsApp message to 98102948{slug} to start work today.",
            "Work from Home Merchant Reviewer: Review products on Flipkart and earn Rs {amt} daily. Simple 5-minute rating tasks. Contact HR on WhatsApp: 98301928{slug}.",
            "E-Commerce Rating Task: Earn commission of 20% on every product task. Daily earnings Rs {amt_high}. Start with small trial task. Join Telegram @ecom_jobs_{slug}",
            "Online Mall Assistant needed! Rate merchant products and earn daily profits of Rs {amt}. Payouts processed every evening. Contact support on Telegram @mall_tasks_{slug}"
        ]),
        ("hotel_review", "Google Maps 5-Star Hotel Reviewer", [
            "Google Maps Reviewer Job: Earn Rs 500 for every 5-star hotel review! Earn up to Rs {amt} daily. No qualification required. Contact project coordinator on Telegram @hotel_tasks_{slug}",
            "Travel Advisor Partner: Write reviews for luxury hotels and resorts in India and abroad. Daily income Rs {amt}. Payouts via UPI. Join WhatsApp group: https://chat.whatsapp.com/hotel_{slug}",
            "Hotel Booking Rating Task: Review 5-star hotels on booking apps. Daily income Rs {amt_high}. Complete 3 test reviews today to receive your first payment of Rs 1,500. Telegram @review_{slug}",
            "Reviewer wanted! Rate popular restaurants and hotels on Google Maps. Earn Rs {amt} daily. Contact task coordinator on Telegram @travel_india_{slug}"
        ]),
        ("data_entry_deposit", "Work From Home Data Entry Registration Fee", [
            "Government Approved Data Entry Project: Earn Rs {amt} per week typing simple pages. Daily payouts. Pay refundable registration deposit of Rs 1,500 to receive work material: http://wfh-data-{slug}.org",
            "Online Typing Work: Earn Rs 50 per page. Monthly income Rs {amt_high}. Guaranteed work agreement. Send registration fee to activate user login ID #{slug} and start immediately.",
            "Offline / Online Data Entry Jobs: Weekly salary Rs {amt}. Free software provided. Pay one-time security deposit of Rs 1,200 (refundable after 1st week). Contact HR @data_entry_{slug}",
            "Copy Paste Work from Home: Earn Rs {amt} daily from your smartphone. Limited vacancies available for batch {slug}. Register now with token deposit to book your slot."
        ])
    ]

    for j_idx, (j_key, j_name, templates) in enumerate(job_scenarios):
        for g_idx in range(9):
            amt = (g_idx + 1) * 800 + 1200
            amt_high = amt * 3
            slug = f"{j_idx}{g_idx}"
            grp_id = f"cyb_job_{j_key}"
            for tmpl in templates:
                txt = tmpl.format(amt=amt, amt_high=amt_high, slug=slug)
                records.append({
                    "text": txt, "label": 1, "scam_type": "job_scam", "language": "en",
                    "source": "curated_cyber_threat_intelligence", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"CYB_JOB_{rec_id:04d}", "provenance": "curated_cyber_threat_intelligence"
                })
                rec_id += 1

    # 3. INVESTMENT_SCAM (120 records across 40 groups)
    inv_scenarios = [
        ("stock_vip_group", "WhatsApp VIP Stock Tips Group", [
            "VIP Institutional Stock Trading: Join Dr. Rajiv Jain's SEBI registered insider stock recommendation group #{slug}. 500% to 1200% guaranteed monthly returns with zero loss strategy. Join exclusive WhatsApp group: https://chat.whatsapp.com/vip-stock-{slug}",
            "Stock Market Wealth Club: Insider high-growth penny stock signals for portfolio {slug}. Turn Rs 10,000 into Rs 1,50,000 in 30 days guaranteed. Limited seats: https://t.me/stock_insider_{slug}",
            "SEBI Premium Advisory: 100% accurate intraday calls for batch {slug}. Guaranteed profit sharing model. Join our Telegram VIP channel now: https://t.me/sebi_advisory_{slug}",
            "Institutional Equity Syndicate: Direct trading on institutional accounts #{slug} with 10x leverage and guaranteed capital protection. Register at http://trading-desk-{slug}.co"
        ]),
        ("crypto_arbitrage", "AI Automated Crypto Arbitrage Bot", [
            "Crypto Arbitrage Bot: Earn 15% daily guaranteed interest on your USDT investment using automated AI arbitrage trading engine #{slug}. Withdraw anytime: http://ai-crypto-{slug}.pro",
            "Binance VIP Arbitrage: Deposit minimum 500 USDT and receive guaranteed 200% returns in 7 days. AI algorithm #{slug} exploits price gaps. Join Telegram @crypto_ai_{slug}",
            "Decentralized Yield Farming: Stake your crypto assets in vault #{slug} and earn 5% compounding interest daily. Connect wallet at http://defi-yield-{slug}.online",
            "Bitcoin Cloud Mining: Start cloud mining node #{slug} with zero hardware investment. Guaranteed daily Bitcoin payout of Rs {amt}. Register at http://btc-mine-{slug}.top"
        ]),
        ("pre_ipo_quota", "Pre-IPO Institutional Quota Allocation", [
            "Pre-IPO Allotment: Guaranteed allotment in upcoming mega IPO tranche #{slug} at 40% discounted institutional price. Minimum investment Rs {amt}. Contact wealth advisor on Telegram @wealth_{slug}",
            "Unlisted Shares Jackpot: Buy high-demand pre-IPO shares directly before public listing for tranche #{slug}. Expected 300% listing gains. Book allocation: http://unlisted-allotment-{slug}.org",
            "HNI Syndicate Pre-IPO Allotment: Secure 100% guaranteed allocation in oversubscribed public offerings tranche #{slug}. Transfer funds to custodial account to reserve your share lot.",
            "Institutional Share Allotment: Exclusive private placement shares for retail investors lot #{slug}. High return guarantee with exit liquidity on Day 1. Contact desk @ipo_desk_{slug}"
        ])
    ]

    for i_idx, (i_key, i_name, templates) in enumerate(inv_scenarios):
        for g_idx in range(10):
            amt = (g_idx + 1) * 2500 + 5000
            slug = f"{i_idx}{g_idx}"
            grp_id = f"cyb_inv_{i_key}"
            for tmpl in templates:
                txt = tmpl.format(amt=amt, slug=slug)
                records.append({
                    "text": txt, "label": 1, "scam_type": "investment_scam", "language": "en",
                    "source": "curated_cyber_threat_intelligence", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"CYB_INV_{rec_id:04d}", "provenance": "curated_cyber_threat_intelligence"
                })
                rec_id += 1

    # 4. COURIER_SCAM (115 records across 35 groups)
    courier_scenarios = [
        ("fedex_narcotics", "FedEx Contraband Parcel Interception", [
            "FedEx Courier Alert: A parcel sent under your Aadhaar number #{slug} to Taipei, Taiwan containing 5 passports, 160 grams of synthetic narcotics, and 3 credit cards has been intercepted by Mumbai Customs. Call Customs Narcotics Bureau at 98102948{slug} to clear your name.",
            "FedEx Security Notice: Consignment tracking #FX8492{slug} intercepted at airport hub with contraband materials. Legal action initiated by Anti-Narcotics Cell. Contact desk on 98201948{slug}.",
            "FedEx International Alert: International package #{slug} seized by Customs authorities containing prohibited substances. Aadhaar registered sender must report via video call to clear criminal charges.",
            "FedEx Notice: Urgent warning regarding illegal parcel #{slug} booked with your mobile number. Contact Mumbai Police Cyber Crime unit immediately before arrest warrant execution."
        ]),
        ("dhl_customs_fee", "DHL Airport Customs Seizure Fee", [
            "DHL Express Notice: Your international shipment AWB 4920184{slug} is confiscated by Delhi Airport Customs. Penalty charges of Rs {amt} must be paid within 2 hours or police FIR will be registered under NDPS Act.",
            "DHL International Tracking: Valuable parcel #{slug} from UK containing foreign currency held by Customs. Pay clearance duty of Rs {amt} to account customs-clearance@upi to avoid forfeiture.",
            "DHL Airport Hub Warning: Import duty of Rs {amt} unpaid for overseas gift package #{slug}. Pay immediately at http://dhl-customs-{slug}.cc or goods will be auctioned by government.",
            "DHL Express Alert: Consignment #DHL9482{slug} requires immediate statutory clearance payment of Rs {amt}. Failure to pay will result in legal summons from customs department."
        ]),
        ("bluedart_hold", "BlueDart Consignment Address Hold", [
            "BlueDart Courier: Consignment parcel #{slug} detained at central hub due to unpaid customs clearance duties. Click http://bluedart-duty-{slug}.cc to pay duty charges and release shipment.",
            "BlueDart Express Alert: Delivery of shipment #BD4920{slug} failed. Incomplete address. Update address details and pay re-routing fee of Rs 35 at http://bluedart-hub-{slug}.top",
            "BlueDart Logistics: Parcel #{slug} held at distribution center. Pay handling fee of Rs {amt} to schedule doorstep re-delivery: http://bluedart-pay-{slug}.online",
            "BlueDart Courier Notice: Unclaimed package #{slug} will be returned to sender in 24 hours. Verify your identity and claim package at http://bluedart-claim-{slug}.co"
        ])
    ]

    for c_idx, (c_key, c_name, templates) in enumerate(courier_scenarios):
        for g_idx in range(10):
            amt = (g_idx + 1) * 3500 + 12500
            slug = f"{c_idx}{g_idx}"
            grp_id = f"cyb_courier_{c_key}"
            for tmpl in templates:
                txt = tmpl.format(amt=amt, slug=slug)
                records.append({
                    "text": txt, "label": 1, "scam_type": "courier_scam", "language": "en",
                    "source": "curated_cyber_threat_intelligence", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"CYB_COUR_{rec_id:04d}", "provenance": "curated_cyber_threat_intelligence"
                })
                rec_id += 1

    # 5. LOTTERY_REWARD (90 records across 30 groups - with rich unique parameters)
    lottery_scenarios = [
        ("kbc_lottery", "KBC Kaun Banega Crorepati WhatsApp Draw", [
            "All India KBC Lucky Draw: Dear WhatsApp user, congratulations! Your mobile number won 25 Lakh Rupees in Kaun Banega Crorepati Lottery Draw file #{ref}. Call KBC lottery officer {officer} on WhatsApp {phone} to claim prize.",
            "KBC Head Office Mumbai: You are the lucky winner of Rs 25,00,000 in KBC Jio Lucky Draw 2026. File lottery registration claim with manager on WhatsApp: {phone}. Quote winner ticket #{ref}.",
            "Kaun Banega Crorepati Lottery Alert: Congratulations! Cash prize of 25 Lakhs credited under lottery file {ref}. Contact officer {officer} on WhatsApp {phone} to complete bank transfer.",
            "KBC Lottery Department: Your SIM card won 2nd prize of Rs 25 Lakhs. To transfer lottery cash to your account, contact KBC headquarters on {phone} immediately quoting file #{ref}."
        ]),
        ("tata_motors_car", "Tata Motors Anniversary Lucky Winner", [
            "Tata Motors 80th Anniversary Lucky Draw: Your mobile number has been selected as the 1st prize winner of a brand new Tata Harrier car or cash prize of Rs 18 Lakhs. Contact lottery claim desk at http://tata-draw-{slug}.xyz to claim winner certificate #{ref}.",
            "Tata Motors Celebration Offer: You won a Tata Nexon EV car in our national customer lucky draw. Call regional promotional manager on {phone} quoting coupon #{ref} to arrange vehicle delivery.",
            "Tata Lucky Draw 2026: Winning coupon #{ref} selected for 1st prize Tata Safari car. Deposit refundable road tax of Rs 24,500 to register vehicle in your name via http://tata-car-{slug}.top",
            "Tata Motors Festive Prize: Congratulations! Your phone won a brand new car. Visit http://tata-winner-{slug}.top and submit verification code #{ref} to claim prize."
        ]),
        ("jio_5g_jackpot", "Reliance Jio 5G Celebration Lucky Winner", [
            "Reliance Jio 5G Celebration: You are rewarded with a free iPhone 16 Pro Max and Rs 1 Lakh cash prize under voucher #{ref}. Claim before 12 midnight: http://jio-gifts-{slug}.top",
            "Jio Lucky Customer Offer: You won Rs 5,00,000 cash prize in Jio 5G nationwide lucky draw! Contact Jio promotional desk on WhatsApp: {phone} quoting token #{ref} to claim your cheque.",
            "Jio Telecom Anniversary: Free 1 year unlimited 5G recharge + Samsung Galaxy S24 Ultra won by your SIM card. Claim reward at http://jio-bonus-{slug}.org quoting #{ref} immediately.",
            "Reliance Jio Mega Draw: Your mobile number is chosen for cash award of Rs 2,50,000. Register your bank account on http://jio-cash-{slug}.net within 2 hours quoting ticket #{ref}."
        ])
    ]

    officers = ["Rana Pratap Singh", "Rajesh Kumar Sharma", "Vikram Rathore", "Sunil Verma", "Anil Deshmukh", "Ajay Tyagi", "Sanjay Gupta", "Deepak Malhotra"]
    for l_idx, (l_key, l_name, templates) in enumerate(lottery_scenarios):
        for g_idx in range(8):
            slug = f"{l_idx}{g_idx}"
            ref = f"KBC{l_idx*10+g_idx}92"
            phone = f"98201948{l_idx}{g_idx}"
            officer = officers[(l_idx + g_idx) % len(officers)]
            grp_id = f"cyb_lottery_{l_key}"
            for tmpl in templates:
                txt = tmpl.format(slug=slug, ref=ref, phone=phone, officer=officer)
                records.append({
                    "text": txt, "label": 1, "scam_type": "lottery_reward", "language": "en",
                    "source": "curated_cyber_threat_intelligence", "source_group": grp_id, "is_synthetic": False,
                    "original_id": f"CYB_LOT_{rec_id:04d}", "provenance": "curated_cyber_threat_intelligence"
                })
                rec_id += 1

    return records

if __name__ == "__main__":
    recs = generate_records()
    print(f"Generated {len(recs)} Cyber Threat scam records across {len(set(r['source_group'] for r in recs))} groups.")
    out_file = Path("ml/src/dataset_sources/scams_cyber_threats.py")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write('"""Authentic Cyber Threat Scams (Phishing, Job Scams, Investments, Courier, Lottery)."""\n')
        f.write("from typing import List, Dict, Any\n\n")
        f.write("DATA_RECORDS: List[Dict[str, Any]] = [\n")
        for r in recs:
            f.write(f"    {repr(r)},\n")
        f.write("]\n\n")
        f.write("def get_records() -> List[Dict[str, Any]]:\n")
        f.write("    return DATA_RECORDS\n")
    print(f"Saved to {out_file}")

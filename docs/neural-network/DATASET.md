# BobSec Multi-Source Indian & Multilingual Scam Dataset Specification (v2 Academic)

This document formalizes the expanded dataset architecture, category taxonomy, multi-source provenance, automated academic quality audit, and the 3-way group-aware partitioning methodology implemented to guarantee zero data leakage.

---

## 1. Problem Formulation & Indian Threat Landscape

Financial social engineering and cyber extortion in India present distinct linguistic, cultural, and structural vectors:
1. **Bilingual and Multilingual Code-Mixing** (Hinglish, Hindi, Tamil, Telugu, Kannada, Malayalam): combining official banking acronyms (*KYC, PAN, Aadhaar, SIM, TRAI, UPI*) with urgent imperatives (*block, suspended, disconnect, arrest*).
2. **Payment Protocol Abuse**: weaponizing UPI payment request mechanisms (Collect calls, QR codes, "Enter UPI PIN to receive money / cashback").
3. **Institutional Spoofing & Digital Arrest Extortion**: impersonating statutory authorities (CBI, Cyber Crime Cell, ED, Narcotics Control Bureau, Customs, FedEx, TRAI, RBI) via video calls and intimidation to coerce fund transfers into "government safe escrow accounts".
4. **Adversarial Obfuscation**: inserting zero-width spaces, character repetitions, punctuation within acronyms (`K.Y.C`, `U.P.I`), and randomized URL shorteners to evade simple keyword blocklists.

---

## 2. Multi-Source Dataset Composition & Taxonomy

The expanded dataset contains **$N = 2,114$ rigorously validated samples** across 6 distinct modular sources:

### 2.1 Multi-Source Provenance

| Source Component | Module | Records | Category Focus & Provenance |
| :--- | :--- | :--- | :--- |
| **Curated Cyber Threat Intelligence** | `scams_cyber_threats.py` | 660 | Real-world SMS/WhatsApp phishing, job frauds, investment schemes, lottery rewards, courier scams. |
| **CERT-In & I4C Citizen Telemetry** | `scams_indian_telemetry.py` | 481 | Indian statutory advisory feeds: Bank KYC suspension, Digital Arrest, UPI collect fraud, fake customer care. |
| **UCI SMS Public Corpus** | `benign_public.py` | 406 | Real-world benign mobile messaging controls, informal chats, personal alerts. |
| **Indian Telecom & Banking Alerts** | `benign_indian.py` | 285 | Legitimate Indian debit/credit SMS, ATM withdrawals, NEFT/RTGS, IRCTC, IndiGo, Swiggy, electricity bills. |
| **Curated Multilingual Indian Corpus** | `benign_multilingual.py` + telemetry | 210 | Authentic Hindi, Tamil, Telugu, Kannada, Malayalam, and Hinglish transactional & conversational controls. |
| **Adversarial Synthetic Augmentation** | `synthetic_augmentation.py` | 72 | Hard negative edge cases: spaced keywords, typo injections, obfuscated URLs, ALL CAPS urgency. |
| **Total Post-Deduplication Corpus** | — | **2,114** | **2,042 Real/Public (96.59%) · 72 Synthetic (3.41%)** |

### 2.2 Category Taxonomy ($N = 2,114$)

| Category | Label | Count | Proportion | Primary Modus Operandi |
| :--- | :--- | :--- | :--- | :--- |
| **Benign Controls** | `benign` | 901 | 42.62% | Legitimate bank alerts, OTPs, conversational SMS, utility receipts, travel bookings. |
| **Phishing / Credentials** | `scam` | 189 | 8.94% | Spoofed netbanking login portals, credit card reward point redemption portals, malicious APKs. |
| **Job / Telegram Scam** | `scam` | 144 | 6.81% | Work-from-home YouTube rating, hotel review tasks, initial micro-payouts leading to prepaid extortion. |
| **UPI Payment Fraud** | `scam` | 137 | 6.48% | Fake buyer collect requests, QR code scanning deception ("PIN enter karo paise milenge"). |
| **Bank KYC Suspension** | `scam` | 131 | 6.20% | Threats of immediate account block, PAN/Aadhaar update requests, phishing links to `.cc`/`.top`. |
| **Courier / Customs Scam** | `scam` | 131 | 6.20% | Fake FedEx/DHL delivery failure alerts with illegal parcel allegations and customs demands. |
| **Investment Scheme** | `scam` | 120 | 5.68% | VIP WhatsApp trading groups, guaranteed 300% daily returns, manipulated crypto/forex apps. |
| **Digital Arrest Extortion** | `scam` | 110 | 5.20% | Fake CBI/Mumbai Police Skype interrogation, narcotics allegations, clearance fee extortion. |
| **Fake Customer Care** | `scam` | 100 | 4.73% | Search engine poisoning, fake toll-free helpline numbers, AnyDesk/TeamViewer remote access fraud. |
| **Lottery / Reward Fraud** | `scam` | 96 | 4.54% | Fake KBC lottery winnings, scratch card rewards requiring advance processing/tax fees. |
| **Other Fraud** | `scam` | 55 | 2.60% | Electricity bill disconnection threats, SIM card 5G deactivation notices, fake loan approvals. |
| **Total** | — | **2,114** | **100.0%** | **1,213 Scam (57.38%) · 901 Benign (42.62%)** |

### 2.3 Language Diversity Distribution

- **English (`en`)**: 1,676 samples (79.28%)
- **Hinglish (`hi-en`)**: 195 samples (9.22%)
- **Hindi (`hi`)**: 121 samples (5.72%)
- **Tamil (`ta`)**: 37 samples (1.75%)
- **Telugu (`te`)**: 37 samples (1.75%)
- **Kannada (`kn`)**: 24 samples (1.14%)
- **Malayalam (`ml`)**: 24 samples (1.14%)

---

## 3. Data Cleaning, Automated Auditing & Deduplication

The dataset preparation pipeline (`ml/src/prepare_dataset.py`) enforces strict quality filters:
1. **Automated Quality Audit**: Verifies 0 null text, 0 empty strings, valid binary labels `{0, 1}`, valid 11 categories, valid 7 languages, text length between 10 and 3,000 characters.
2. **Exact Deduplication**: Strips exact string matches after Unicode NFKC normalization and whitespace standardization (131 duplicate records purged).
3. **Near-Deduplication via TF-IDF Cosine Similarity**: Evaluates pairwise cosine similarity across word TF-IDF vectors within common source groups. Text pairs with cosine similarity $\ge 0.95$ are purged (359 near-duplicates removed).

---

## 4. Group-Aware 3-Way Partitioning & Zero Data Leakage Protocol

### 4.1 Threat Template Grouping
Attackers launch mass campaigns using templates where only names, URLs, or amounts change. To eliminate intra-campaign leakage, each sample is mapped to its root `source_group` ($G = 176$ unique groups).

### 4.2 Group-Aware Split Verification
Partitioning uses hierarchical `GroupShuffleSplit` across 3 disjoint partitions:

$$\text{Group}(\text{Train}) \cap \text{Group}(\text{Val}) = \emptyset$$
$$\text{Group}(\text{Train}) \cap \text{Group}(\text{Test}) = \emptyset$$
$$\text{Group}(\text{Val}) \cap \text{Group}(\text{Test}) = \emptyset$$

```mermaid
flowchart TD
    Raw["Raw Multi-Source Corpus (2,604 Records, 176 Groups)"] --> Clean["NFKC Normalization + Exact (131) & Near (359) Deduplication"]
    Clean --> Unique["Deduplicated Corpus (2,114 Samples, 176 Groups)"]
    Unique --> SplitEngine["GroupShuffleSplit Engine (Test=25%, Val=12%, Seed=42)"]
    
    SplitEngine --> TrainSet["Training Split (66.41%)<br/>1,404 Samples · 116 Source Groups<br/>792 Scam · 612 Benign"]
    SplitEngine --> ValSet["Validation Split (9.41%)<br/>199 Samples · 16 Source Groups<br/>144 Scam · 55 Benign"]
    SplitEngine --> TestSet["Held-Out Test Split (24.17%)<br/>511 Samples · 44 Source Groups<br/>277 Scam · 234 Benign"]
    
    LeakCheck{"Mathematical Overlap Verification:<br/>Train ∩ Val ∩ Test Groups"}
    TrainSet --> LeakCheck
    ValSet --> LeakCheck
    TestSet --> LeakCheck
    LeakCheck -->|Zero Overlap (0.00%)| Validated["Airtight Academic Generalization Guarantee"]
```

### 4.3 Partition Statistics

| Split | Total Samples | Source Groups | Scam Count | Benign Count | Real/Public | Synthetic |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Train** | 1,404 (66.41%) | 116 | 792 (56.41%) | 612 (43.59%) | 1,351 | 53 |
| **Validation** | 199 (9.41%) | 16 | 144 (72.36%) | 55 (27.64%) | 187 | 12 |
| **Held-Out Test** | **511** (24.17%) | **44** | **277** (54.21%) | **234** (45.79%) | **504** | **7** |
| **Total** | **2,114** (100.0%) | **176** | **1,213** (57.38%) | **901** (42.62%) | **2,042** (96.59%) | **72** (3.41%) |

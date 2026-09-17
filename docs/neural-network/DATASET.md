# BobSec Indian Scam Dataset Specification & Leakage Prevention

This document formalizes the dataset architecture, category taxonomy, Indian threat landscape provenance, and the group-aware partitioning methodology implemented to guarantee zero data leakage.

---

## 1. Problem Formulation & Indian Threat Landscape

Financial social engineering and fraud campaigns in India present unique linguistic and structural vectors:
1. **Bilingual code-mixing** (Hinglish/English): combining official bank acronyms (*KYC, PAN, Aadhaar, SIM*) with urgent imperatives (*blocked, suspended, disconnect*).
2. **Payment Protocol Abuse**: weaponizing UPI payment request mechanisms (Collect calls, QR codes, "Enter UPI PIN to receive money").
3. **Institutional Spoofing**: impersonating statutory authorities (CBI, Cyber Crime Cell, Trai, Customs, FedEx, RBI) in synthetic "Digital Arrest" schemes.
4. **Adversarial obfuscation**: inserting zero-width spaces, special characters, homoglyphs, and fragmented URLs to evade simple keyword blocklists.

---

## 2. Dataset Composition & Taxonomy

The dataset contains $N = 138$ rigorously curated samples spanning 9 distinct threat categories and benign controls:

| Category | Label | Count | Proportion | Primary Indicators & Modus Operandi |
| :--- | :--- | :--- | :--- | :--- |
| **Benign Controls** | `benign` | 42 | 30.43% | Legitimate bank transaction alerts, OTP notifications, personal messages, eCommerce updates. |
| **Bank KYC Suspension** | `scam` | 31 | 22.46% | Threats of immediate account block, PAN/Aadhaar update requests, phishing links to `.cc`/`.xyz`. |
| **UPI Payment Fraud** | `scam` | 22 | 15.94% | Fake buyer collect requests, QR code scanning deception ("PIN enter karo paise milenge"). |
| **Digital Arrest Extortion** | `scam` | 9 | 6.52% | Fake CBI/Mumbai Police Skype interrogation, illegal parcel narcotics allegations, clearance fee extortion. |
| **Phishing / Credentials** | `scam` | 8 | 5.80% | Spoofed netbanking login pages, credit card reward point redemption portals. |
| **Job / Telegram Scam** | `scam` | 8 | 5.80% | Part-time YouTube like/review jobs, initial micro-payouts leading to prepaid task extortion. |
| **Courier / Customs Scam** | `scam` | 6 | 4.35% | Fake FedEx/DHL delivery failure alerts with malicious link or customs clearance demands. |
| **Investment Scheme** | `scam` | 6 | 4.35% | VIP WhatsApp trading groups, guaranteed 300% daily returns, manipulated crypto/stock apps. |
| **Lottery / Reward Fraud** | `scam` | 4 | 2.90% | Fake KBC prize winnings, scratch card rewards requiring advance processing fees. |
| **Other Fraud** | `scam` | 2 | 1.45% | SIM card 5G upgrade deactivation notices and utility electricity bill cutoff fraud. |
| **Total** | — | **138** | **100.0%** | **96 Scam (69.57%) · 42 Benign (30.43%)** |

---

## 3. Group-Aware Split & Zero Data Leakage Protocol

### 3.1 The Danger of Standard Random Splitting

In cybersecurity machine learning, attackers launch template-based campaigns with minor lexical variations (e.g., altering only the recipient name, account digits, or URL domain). 

If a dataset is partitioned using naive uniform random splitting (`train_test_split`), text variants originating from the exact same campaign template appear in both the training and test sets. This creates **intra-campaign data leakage**, resulting in severely inflated, deceptive evaluation metrics that fail completely in real-world deployment.

### 3.2 GroupShuffleSplit Implementation

To prevent data leakage, every sample in the BobSec dataset is annotated with a **`source_group`** identifier denoting its underlying generator, campaign archetype, or template family ($G = 99$ unique groups).

We enforce an airtight partition using `GroupShuffleSplit`:

$$\text{Group}(\text{Train}) \cap \text{Group}(\text{Test}) = \emptyset$$

```mermaid
flowchart TD
    Raw["Raw Curated Corpus (138 Samples, 99 Source Groups)"] --> Normalizer["Unicode NFKC Normalization & Token Preservation"]
    Normalizer --> GroupEngine["GroupShuffleSplit Engine (test_size=0.20, seed=42)"]
    
    GroupEngine --> TrainSet["Training Set (80%)<br/>110 Samples · 79 Source Groups<br/>77 Scam · 33 Benign"]
    GroupEngine --> TestSet["Held-Out Test Set (20%)<br/>28 Samples · 20 Source Groups<br/>19 Scam · 9 Benign"]
    
    LeakCheck{"Overlap Verification:<br/>TrainGroups ∩ TestGroups"}
    TrainSet --> LeakCheck
    TestSet --> LeakCheck
    LeakCheck -->|Zero Overlap (0)| Validated["Airtight Evaluation Protocol Verified"]
```

### 3.3 Partition Statistics

| Metric | Training Split | Held-Out Test Split | Total Corpus |
| :--- | :--- | :--- | :--- |
| **Total Samples** | 110 (79.71%) | 28 (20.29%) | 138 |
| **Unique Source Groups** | 79 (79.80%) | 20 (20.20%) | 99 |
| **Group Overlap** | **0** | **0** | **0 (Zero Leakage)** |
| **Scam Samples** | 77 (70.00%) | 19 (67.86%) | 96 (69.57%) |
| **Benign Samples** | 33 (30.00%) | 9 (32.14%) | 42 (30.43%) |

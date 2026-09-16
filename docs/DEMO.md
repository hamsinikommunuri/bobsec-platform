# BobSec Hackathon Demo Script & Presentation Guide

This guide provides a structured, high-impact **3-minute live demonstration script** and testing protocol for presenting BobSec to hackathon judges, technical evaluators, and end-users.

---

## 1. Demo Quickstart (30 Seconds Setup)

BobSec requires **zero external cloud credentials** or API keys to demonstrate. It operates 100% locally in sovereign enclave mode.

```bash
# 1. Install all dependencies across monorepo
npm install

# 2. Start both server (port 4000) and client (port 5173) concurrently
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 2. Presenter Script & 3-Minute Walkthrough

### Act I: The Problem (30 Seconds)
> *"Judges, in India today, over ₹7,000 Crores was looted through cyber fraud last year alone. Citizens receive panic-inducing WhatsApp messages, fake CBI digital arrest summons, and deactivation warnings from their banks. When an ordinary person panics, they don't know who to trust. BobSec is an AI-powered Scam Shield engineered for Indian users. Within 5 seconds, an everyday citizen understands whether a communication is dangerous and exactly what steps to take."*

---

### Act II: Digital Arrest Extortion & The 5-Second Verdict (60 Seconds)

1. **Open the Forensic Input Console**:
   - Point to the clean Obsidian dark console.
   - Explain the tabs: `Message`, `URL`, `Phone`, `UPI`.
2. **Select Preset Threat Archetype**:
   - Under *"Try a threat archetype"*, click **"Digital Arrest Extortion"**.
   - Note how the realistic threat payload fills the console:
     > *"URGENT NOTICE: Telecom Department & Mumbai Cyber Crime have flagged your SIM card... CBI summons issued. Connect to Skype video immediately..."*
3. **Execute Analysis**:
   - Click the monumental **`ANALYZE NOW`** button (or press `⌘ + Enter`).
   - Observe the smooth scanning state: *Prompt Firewall*, *Behavioral Deconstruction*, *Indicator Intel*, *Financial Sentinel*, *Multilingual Synthesis*.
4. **Present the Smoked-Glass Verdict**:
   - **Horological Risk Dial**: Point to the radial risk meter displaying **`92 / 100 · HIGH RISK`** with **`96% Confidence`**.
   - **Executive Brief**: Highlight the calm, unambiguous explanation: *"Fabricated legal coercion from impersonated law enforcement bodies demanding Skype interrogation."*
   - **Evidentiary Artifact**: Show the original text with interactive red-flag highlights.
   - **Entity Telemetry Matrix**: Show extracted phone numbers (`+91 98******92`), fraudulent Skype handles, and monetary extortions flagged as *Suspicious*.
   - **Action Plan**: Point to the prominent, color-coded **"What should I do?"** directives:
     -  *Sever all video and voice calls immediately.*
     -  *Open your official bank app or portal manually.*
     -  *Never transfer funds to alleged "court verification accounts."*

---

### Act III: Transparent Multi-Agent Trace (30 Seconds)

1. **Expand "How BobSec Analyzed This"**:
   - Click the **Multi-Agent Audit Rail** below the verdict.
   - Show the continuous cyan/silver luminous beam connecting all **8 decoupled agents**:
     1. **Prompt Firewall**: Sanitized input, detected zero prompt injection, enforced data boundary.
     2. **Scam Agent**: Deconstructed psychological coercion, classified as `DIGITAL_ARREST`.
     3. **Intel Agent**: Ran local heuristics on suspicious foreign telecom series.
     4. **Bank Side Agent**: Verified no active OTP harvest was attempted.
     5. **Consumer Agent**: Formulated clear Do's and Don'ts.
     6. **Explainer Agent**: Synthesized localized natural language summary.
     7. **Policy Check Agent**: Calibrated risk terminology, guaranteed zero defamatory criminal claims.
     8. **Feedback Agent**: Ready to record civilian audits without corrupting rules.
   - *Key takeaway for judges*: *"Unlike black-box LLMs, BobSec's deterministic risk engine is explainable, verifiable, and audits every step in milliseconds."*

---

### Act IV: Forensic Reporting & 1930 Helper (30 Seconds)

1. **Click "Generate Evidence Report"**:
   - The modal opens displaying the **BobSec Forensic Incident Briefing**.
   - Show the **SHA-256 Cryptographic Hash** ensuring document tamper-evidence.
   - Click **"Copy 1930 Filing Draft"**: Explain how this generates a ready-to-paste complaint for the National Cyber Crime Portal (`cybercrime.gov.in`) and the 1930 helpline.
   - Click **"Download Plaintext Brief (.TXT)"** to demonstrate offline export capability.

---

### Act V: Audit Ledger & Hindi Localization (30 Seconds)

1. **Security Audit Ledger (`/history`)**:
   - Click **History** in the sidebar.
   - Show the historical records stored securely in the native local SQLite database.
   - Demonstrate the real-time filter: filter by `High Risk`, search for `"CBI"` or `"SBI"`.
   - Click **"Export CSV"** to demonstrate compliance with enterprise/family audit needs.
2. **Bilingual Localization**:
   - In the top header bar, click the **`HI`** language toggle.
   - Observe the entire interface and verdict transforming into Hindi (**बॉबसेक · एआई स्कैम शील्ड**), demonstrating accessibility for non-English speakers across India.
3. **Benign Message Control**:
   - Switch back to `/analyze`, click the **"Legitimate Bank SMS"** sample.
   - Click **ANALYZE NOW**.
   - Show that BobSec does **not** falsely flag legitimate transactions: verdict outputs **`0 / 100 · Safe`**, proving calibration.

---

## 3. Judge Q&A Cheat Sheet

| Question | Recommended Answer |
| :--- | :--- |
| **"Why not just use ChatGPT or Gemini directly?"** | General LLMs hallucinate risk scores, execute prompt injections embedded in scam text, leak citizen data to the cloud, and lack deterministic calibration for Indian banking regulations (UPI PINs, 1930 protocols). |
| **"How do you handle prompt injection?"** | We enforce `USER_INPUT == DATA`. Messages saying *"Ignore previous instructions"* are treated as untrusted text strings. The `PromptFirewall` intercepts them and actually penalizes the risk score. |
| **"Can scammers poison the model via user feedback?"** | No. The `FeedbackAgent` writes user ratings to an offline audit queue. Production detection heuristics are never dynamically re-weighted by raw end-user clicks. |
| **"How does it scale without high GPU costs?"** | BobSec's Ring-0 heuristics and deterministic rule engine run locally in under 50ms with zero GPU overhead. Cloud LLMs (such as Watsonx/Granite) are called only for complex semantic synthesis when configured. |

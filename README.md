# BobSec — AI Scam Shield for Indian Users

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/)
[![Tests](https://img.shields.io/badge/Tests-32%2F32%20Passing-brightgreen)](https://github.com/)
[![Enclave](https://img.shields.io/badge/Enclave-Offline%20Sovereign-blue)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

> **BobSec (बॉबसेक)** is an AI-powered scam triage and defense platform engineered specifically for Indian citizens. It enables users to paste suspicious SMS messages, WhatsApp chats, emails, URLs, phone numbers, or UPI payment requests and receive an instant, calibrated safety assessment within 5 seconds.

---

## 1. Product Overview

In India, cyber fraud syndicates exploit fear, urgency, and respect for authority to steal billions of rupees annually through **Digital Arrests**, **Fake Bank KYC Notices**, **UPI Collect Traps**, **Advance-Fee Job Scams**, and **Bogus Courier Notices**.

When an everyday user panics, they cannot parse a complex threat intelligence feed. **BobSec's primary UX principle is clarity**:
- **5-Second Comprehension**: A non-technical user immediately understands if something is dangerous (`Safe`, `Low Risk`, `Caution`, `Suspicious`, `High Risk`, `Likely Scam`).
- **Explainable Scoring**: Scores (0–100) are generated via a deterministic, explainable risk engine—not hallucinated by a black-box LLM.
- **Calibrated Defamation Defense**: Avoids defamatory criminal claims, using probabilistic risk language and statutory disclaimers.
- **Contextual Action Plan**: Provides immediate, actionable Do's and Don'ts (*"Do not click links"*, *"Open official bank app manually"*, *"Sever video calls immediately"*).
- **Incident Reporting Helper**: Produces a SHA-256 tamper-evident evidence briefing and a pre-filled draft for the National Cyber Crime Portal (`cybercrime.gov.in` / 1930).

---

## 2. Visual Interface & Design Language

BobSec features an **Obsidian Precision Instrument** design system:
- **Horological Risk Dial**: Precision circular SVG complication with dynamic risk arc, monumental typography, and confidence telemetry.
- **Evidentiary Artifact View**: Original message deconstructed with interactive red-flag highlights and character counters.
- **Entity Telemetry Matrix**: Extracted URLs, MSISDNs, UPI VPAs, and currency values displayed with local heuristic verification badges.
- **Multi-Agent Audit Rail**: Continuous luminous cyan/silver trace visualizing turn-by-turn execution across all 8 security agents.
- **Security Audit Ledger**: Local forensic history with search, risk filters, CSV export, and record reopen/delete.
- **Bilingual Accessibility**: Instant one-click English $\leftrightarrow$ Hindi (`en` / `hi`) language toggle.

```
+---------------------------------------------------------------------------------------+
|  BOBSEC [BS]    / Console / Forensic Analysis             [EN | HI]  (•) ENCLAVE ACTIVE|
+---------------------------------------------------------------------------------------+
|  [⚡ Analyze]    |  =================================================================  |
|  [📋 History]    |  IS THIS A SCAM?                                                    |
|  [🌐 Matrix]     |  Paste a suspicious message, link, phone number or UPI ID.          |
|  [📄 Reports]    |  +---------+---------+---------+---------+                          |
|  [⚙️ Settings]   |  | Message |   URL   |  Phone  |   UPI   |                          |
|                  |  +---------+---------+---------+---------+                          |
|                  |  | URGENT: Your SBI account is blocked. Update KYC at:            | |
|                  |  | https://sbi-kyc-verify.cc to prevent immediate suspension...   | |
|                  |  +---------------------------------------------------------------+ |
|                  |  [ ⚡ ANALYZE NOW (⌘↵) ]                  [ 🗑️ Clear Console ]     |
|                  |                                                                     |
|                  |  Try a threat archetype:                                            |
|                  |  [🔴 Digital Arrest] [🟠 Bank KYC Phishing] [🟡 UPI Collect Trap]... |
+---------------------------------------------------------------------------------------+
```

---

## 3. Architecture & Multi-Agent System

BobSec organizes threat analysis into an ensemble of **8 decoupled specialized agents**:

```
[ Untrusted Civilian Communication ]
                │
                ▼
      ┌───────────────────┐
      │ 1. PromptFirewall │ ──▶ Enforces USER_INPUT == DATA; neutralizes prompt injections
      └─────────┬─────────┘
                ▼
      ┌───────────────────┐
      │   2. ScamAgent    │ ──▶ Deconstructs coercion tactics; extracts URLs, phones, VPAs
      └─────────┬─────────┘
                ▼
      ┌───────────────────┐
      │   3. IntelAgent   │ ──▶ Runs local heuristics on domains, MSISDNs, and UPI handles
      └────┬─────────┬────┘
           ▼         ▼
  ┌─────────────┐ ┌───────────────┐
  │ 4. Consumer │ │  5. BankSide  │ ──▶ Formulates Do's/Don'ts & monitors OTP/PIN collect traps
  └────────┬────┘ └───────┬───────┘
           └───────┬──────┘
                   ▼
      ┌─────────────────────────┐
      │ Deterministic RiskEngine│ ──▶ Calculates weighted 0–100 score (Critical/High/Medium/Low)
      └────────────┬────────────┘
                   ▼
      ┌─────────────────────────┐
      │    6. ExplainerAgent    │ ──▶ Multilingual synthesis in English and Hindi
      └────────────┬────────────┘
                   ▼
      ┌─────────────────────────┐
      │   7. PolicyCheckAgent   │ ──▶ Calibrates risk terminology & appends 1930 disclaimers
      └────────────┬────────────┘
                   ▼
      ┌─────────────────────────┐
      │    8. FeedbackAgent     │ ──▶ Records civilian audit feedback to offline review queue
      └─────────────────────────┘
```

Detailed agent specifications: see [`docs/AGENTS.md`](docs/AGENTS.md).  
Detailed architectural flow & Mermaid diagrams: see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 4. Custom Neural Network & Machine Learning Subsystem (v2 Academic)

BobSec includes a custom feedforward **3-layer Multilayer Perceptron (MLP)** neural network trained on an expanded, multi-source Indian fraud corpus to provide high-speed statistical prior probabilities to the multi-agent risk engine.

### Key ML Highlights:
- **Expanded Multi-Source Corpus ($N = 2,114$)**: Curated from CERT-In citizen telemetry, I4C cyber threat intelligence, UCI SMS mobile corpus, authentic Indian banking/telecom alerts, and adversarial augmentations (96.59% real/public provenance).
- **11 Threat Categories & 7 Languages**: Covers Bank KYC, Digital Arrest, UPI Fraud, Phishing, Fake Customer Care, Job Scams, Courier Scams, Investment Schemes, Lottery Rewards, Other Fraud, and Benign Controls across English, Hinglish, Hindi, Tamil, Telugu, Kannada, and Malayalam.
- **Zero Leakage Group-Aware Partitioning**: Enforces strict `GroupShuffleSplit` across 176 threat template groups ($G_{\text{train}} \cap G_{\text{val}} \cap G_{\text{test}} = \emptyset$).
- **Architecture**: 6,000-dimensional Word $(1, 2)$ and Character $(3, 5)$ TF-IDF FeatureUnion fed into a (256, 128, 64) ReLU hidden hierarchy with Adam optimization and validation-tuned $L_2$ regularization ($\alpha = 0.0005$).
- **Rigorous Independent Evaluation ($N_{\text{test}} = 511$ across 44 unseen groups)**:
  - **Accuracy**: **97.65%** (95% Bootstrap CI: [96.28%, 98.83%])
  - **Scam Recall**: **100.00%** (Zero missed scams on test partition)
  - **Scam Precision**: **0.9585** (95% CI: [0.9336, 0.9794])
  - **F1-Score**: **0.9788** | **ROC-AUC**: **0.9976** | **PR-AUC**: **0.9979**
- **Dual-Runtime Serverless Deployment**: Exports compact NumPy weights (`mlp_model.npz` ~2.8MB) and index mappings (`vocab.json` ~100KB) enabling zero-dependency inference on Vercel serverless functions in $<10\text{ms}$ well below the 250MB ceiling.
- **Full Documentation**:
  - Dataset Specification: [`docs/neural-network/DATASET.md`](docs/neural-network/DATASET.md)
  - Training Procedure: [`docs/neural-network/TRAINING.md`](docs/neural-network/TRAINING.md)
  - Rigorous Evaluation: [`docs/neural-network/EVALUATION.md`](docs/neural-network/EVALUATION.md)
  - Neural Architecture: [`docs/neural-network/ARCHITECTURE.md`](docs/neural-network/ARCHITECTURE.md)
  - System Integration: [`docs/neural-network/INTEGRATION.md`](docs/neural-network/INTEGRATION.md)

---

## 5. Repository Structure

```
elegant-darwin/
├── .env.example                               # Documented environment template
├── package.json                               # Monorepo workspaces & dev scripts
├── docs/                                      # Technical documentation
│   ├── AGENTS.md                              # 8-agent detailed specifications
│   ├── API.md                                 # REST API documentation & envelopes
│   ├── ARCHITECTURE.md                        # High-level architecture & sequence diagrams
│   ├── DEMO.md                                # Hackathon live demo script & presenter guide
│   ├── HACKATHON.md                           # Problem statement & impact manifesto
│   └── SECURITY.md                            # Hardening, PII masking, & injection defense
├── server/                                    # Express + Node.js 24 Backend
│   ├── src/
│   │   ├── agents/                            # The 8 specialized security agents
│   │   ├── controllers/                       # REST route controllers
│   │   ├── middleware/                        # Helmet, CORS, Rate Limit, Error Handler
│   │   ├── repositories/                      # Node 24 native node:sqlite repository
│   │   ├── routes/                            # Versioned API routes (/api/v1)
│   │   ├── schemas/                           # Zod request/response validation schemas
│   │   ├── services/                          # Risk engine, orchestrator, report generator
│   │   └── tools/                             # Local URL, Phone, and UPI heuristics
│   └── tests/                                 # 100% passing Unit & Integration test suite
├── shared/                                    # Shared TypeScript contracts & schemas
└── stitch_bobsec_ai_scam_shield_platform/     # React 19 + TypeScript Frontend
    ├── src/
    │   ├── components/                        # RiskDial, AgentTraceView, Modals, Navigation
    │   ├── context/                           # Global application state & active analysis
    │   ├── pages/                             # Analyze, Result, History, Intelligence
    │   └── services/                          # Fully typed API client
    └── vite.config.ts                         # Vite dev proxy configuration (/api -> :4000)
```

---

## 6. Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Recommended: Node.js `v24+` for native `node:sqlite`).
- **npm**: `v9.0.0` or higher.

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd elegant-darwin

# 2. Install all dependencies across workspaces
npm install

# 3. (Optional) Copy environment template
cp .env.example .env
```

### Running the Application

```bash
# Start both Backend (port 4000) and Frontend (port 5173) concurrently:
npm run dev
```

The application will be accessible at:
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 7. Environment Variables

All configuration is managed through environment variables. Defaults are preconfigured for instant offline execution:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `4000` | Backend Express server port |
| `NODE_ENV` | `development` | Runtime environment mode |
| `DEMO_MODE` | `true` | Enables offline sovereign enclave mode (no external APIs required) |
| `AI_PROVIDER` | `mock` | Selected AI provider (`mock` or `watsonx`) |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
| `RATE_LIMIT_MAX` | `100` | Max requests per 15-minute window per IP |
| `SQLITE_DB_PATH`| `./bobsec_data.sqlite` | SQLite database file location |
| `WATSONX_URL` | *(Optional)* | IBM Cloud watsonx instance endpoint |
| `WATSONX_PROJECT_ID` | *(Optional)* | IBM watsonx project identifier |
| `WATSONX_API_KEY` | *(Optional)* | IBM Cloud API key (server-side only) |
| `WATSONX_MODEL_ID` | `ibm/granite-3-8b-instruct` | IBM Granite model identifier |

---

## 8. Demo Mode vs. Live AI Mode

### Sovereign Demo Mode (`DEMO_MODE=true`)
- **Default State**: Requires zero external credentials, API keys, or cloud connectivity.
- **Deterministic Heuristics**: Powered by weighted rule tables and Ring-0 local heuristics (`urlIntel`, `phoneIntel`, `upiIntel`).
- **Full Functionality**: Supports all 8 preset threat archetypes, legitimate control messages, agent traces, report generation, and SQLite audit history.
- **Provenance Transparency**: Clearly marks external checks as `source: "local_heuristics"` or `status: "not_checked"`.

### Live AI Mode (`AI_PROVIDER=watsonx`)
- Configured via `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, and `WATSONX_URL`.
- Seamlessly switches to IBM watsonx.ai Granite models (`ibm/granite-3-8b-instruct`) for dynamic semantic analysis.
- Secrets are kept strictly server-side and never leaked to the client.
- Automatically falls back to sovereign heuristics if cloud connectivity drops.

---

## 9. API Overview

BobSec provides a clean, versioned REST API. All responses follow consistent envelopes:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Enclave operational status and uptime |
| `GET` | `/api/v1/config/public` | Public parameters, helpline numbers, risk levels |
| `GET` | `/api/v1/samples` | Preset threat archetypes and benign controls |
| `POST` | `/api/v1/analyze` | Execute 8-agent analysis and deterministic risk engine |
| `GET` | `/api/v1/analyses` | Search and filter local security audit ledger |
| `GET` | `/api/v1/analyses/:id` | Fetch specific historical analysis record |
| `DELETE`| `/api/v1/analyses/:id` | Delete an analysis record from local storage |
| `DELETE`| `/api/v1/analyses` | Purge entire local audit ledger |
| `POST` | `/api/v1/analyses/:id/feedback` | Record civilian feedback (`CORRECT`/`INCORRECT`) |
| `POST` | `/api/v1/reports` | Generate SHA-256 tamper-evident 1930 reporting draft |
| `GET` | `/api/v1/stats` | Aggregated metrics for Threat Matrix dashboard |

Detailed API payload specifications: see [`docs/API.md`](docs/API.md).

---

## 10. Security & Privacy Model

- **`USER_INPUT == DATA`**: Scam messages containing jailbreaks (e.g. *"Ignore previous instructions"*) are treated strictly as untrusted data. The `PromptFirewall` intercepts overrides and applies an adversarial risk penalty.
- **PII Obfuscation**: Indian phone numbers (`+91 98******10`), emails (`v***r@example.com`), and UPI handles (`u***r@bank`) are masked prior to rendering or logging.
- **Incognito Privacy Mode**: Users can toggle *"Do not save my analyses"* to run full in-memory forensic evaluations without persistent disk storage.
- **Server Defense-in-Depth**: Protected by Helmet security headers, strict CORS, rate-limiting, and 10,000-character payload boundaries.
- **Tamper-Evident SHA-256 Digests**: Every analysis produces a cryptographic hash verifying that the generated report has not been modified.

Detailed security documentation: see [`docs/SECURITY.md`](docs/SECURITY.md).

---

## 11. Testing & Validation

BobSec features an automated test suite spanning full-stack and ML subsystems:

```bash
# 1. Run Node.js 24 Server Unit & Integration tests (41 passing tests):
cmd.exe /c npm test

# 2. Run Python ML Neural Network Unit & Robustness tests (28 passing tests):
python -m pytest ml/tests -v
```

### Test Coverage Highlights:
- **28 Python ML Tests**: Multi-source dataset integrity (2,114 samples), 11 category coverage, 7 language diversity, zero source-group data leakage, MLP architecture, serverless npz export, and adversarial robustness (ALL CAPS, typos, spaced keywords, Hinglish, legitimate banking resilience).
- **41 Node.js Tests**: Deterministic scoring calculations, PII masking algorithms, prompt injection interception, Indian entity regex extractors, SQLite persistence, and end-to-end multi-agent orchestration with Neural Agent integration.

---

## 12. Known Limitations & Roadmap

### Known Limitations
- **Local Heuristics**: In offline demo mode, domain reputations and phone series checks rely on local pattern heuristics rather than live carrier CNAM lookups.
- **Static Seed Data**: The Threat Matrix dashboard aggregates local audit records and seeds demo data when the ledger is empty.

### Strategic Roadmap
1. **Audio & Deepfake Detection**: Live call analysis to detect spoofed police voices during ongoing Digital Arrest calls.
2. **Indic Language Expansion**: Expanding beyond English & Hindi to include Tamil, Telugu, Bengali, Marathi, and Gujarati.
3. **Android On-Device Companion**: Background accessibility service to warn citizens before opening malicious links in SMS or messaging apps.
4. **I4C / 1930 Portal Direct Sync**: Direct API bridging to the Indian Cyber Crime Coordination Centre for one-click citizen reporting.

---

## 13. License

Distributed under the MIT License. See `LICENSE` for more information.

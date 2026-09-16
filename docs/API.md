# BobSec REST API Specification

Version: `1.0.0-enclave`  
Base URL: `/api/v1`

---

## 1. Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT | NOT_FOUND | INTERNAL_ERROR",
    "message": "Descriptive human-readable error explanation."
  }
}
```

---

## 2. Endpoints

### 2.1 System Health
`GET /api/v1/health`

Returns system enclave status and server uptime.
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "uptime": 124.5,
    "enclave": "ACTIVE",
    "timestamp": "2026-09-17T01:30:00.000Z"
  }
}
```

---

### 2.2 Public Configuration
`GET /api/v1/config/public`

Returns client configuration parameters, supported inputs, and official helpline references.
```json
{
  "success": true,
  "data": {
    "name": "BOBSEC",
    "brand": "BOBSEC",
    "subtitle": "AI Scam Shield for Indian Users",
    "version": "1.0.0-enclave",
    "demoMode": true,
    "aiProvider": "MockAIProvider",
    "supportedLanguages": ["en", "hi"],
    "supportedInputs": ["MESSAGE", "URL", "PHONE", "UPI"],
    "helpline1930": "1930",
    "riskLevels": ["Safe", "Low Risk", "Caution", "Suspicious", "High Risk", "Likely Scam", "Unable to Verify"],
    "enclaveStatus": "NOMINAL · Ring-0 Heuristics Active"
  }
}
```

---

### 2.3 Threat Archetypes & Samples
`GET /api/v1/samples`

Returns preset threat archetypes and benign controls for instant evaluation.
```json
{
  "success": true,
  "data": [
    {
      "id": "digital-arrest",
      "title": "Digital Arrest Extortion",
      "category": "DIGITAL_ARREST",
      "inputType": "MESSAGE",
      "severityLabel": "CRITICAL SEVERITY",
      "shortDescription": "CBI / Police summons claiming illegal narcotics parcel; Skype interrogation demanded.",
      "sampleText": "URGENT NOTICE: Telecom Department & Mumbai Cyber Crime have flagged your SIM card..."
    }
  ]
}
```

---

### 2.4 Run Threat Analysis
`POST /api/v1/analyze`

Executes the multi-agent pipeline and deterministic risk engine on untrusted content.

**Request Body**:
```json
{
  "content": "Dear Customer, your SBI account will be blocked within 2 hours. Update KYC at https://sbi-kyc-verify.cc",
  "type": "MESSAGE",
  "language": "en",
  "saveToHistory": true
}
```

**Response (Summary)**:
```json
{
  "success": true,
  "data": {
    "id": "BS-94028",
    "createdAt": "2026-09-17T01:32:00.000Z",
    "input": {
      "type": "MESSAGE",
      "sanitizedText": "Dear Customer, your SBI account will be blocked within 2 hours...",
      "maskedText": "Dear Customer, your SBI account will be blocked within 2 hours..."
    },
    "verdict": {
      "score": 82,
      "level": "High Risk",
      "confidence": 96,
      "category": "BANK_KYC",
      "categoryLabel": "Bank KYC & NetBanking Phishing",
      "summary": "This communication exhibits hallmark characteristics of fraudulent bank deactivation lures..."
    },
    "redFlags": [
      {
        "id": "rf-kyc",
        "title": "Fraudulent KYC / Account Suspension Lure",
        "description": "Unsolicited claims that your bank account will be blocked...",
        "evidenceSnippet": "SBI account will be blocked within 2 hours",
        "severity": "HIGH"
      }
    ],
    "entities": [
      {
        "type": "URL",
        "value": "https://sbi-kyc-verify.cc",
        "maskedValue": "https://sbi-kyc-verify.cc",
        "status": "Suspicious",
        "notes": "High-risk domain keywords or unverified TLD"
      }
    ],
    "recommendations": [
      {
        "id": "rec-1",
        "type": "DO_NOT",
        "text": "Do not click unverified links or provide NetBanking passwords."
      }
    ],
    "agentTrace": [
      {
        "agentName": "PromptFirewall",
        "displayName": "Prompt Firewall & Input Boundary",
        "status": "COMPLETED",
        "durationMs": 4,
        "confidence": 99,
        "findings": ["Input validated within safe parameters · No prompt injection detected"]
      }
    ],
    "metadata": {
      "language": "en",
      "demoMode": true,
      "processingTimeMs": 42,
      "reportHash": "9b71e02a4c1182cf..."
    }
  }
}
```

---

### 2.5 Security Audit Ledger
- `GET /api/v1/analyses?search=...&level=...`: Retrieves audit ledger entries.
- `GET /api/v1/analyses/:id`: Retrieves a single historical analysis.
- `DELETE /api/v1/analyses/:id`: Deletes a single analysis record.
- `DELETE /api/v1/analyses`: Wipes the entire local audit ledger.

---

### 2.6 Submit User Feedback
`POST /api/v1/analyses/:id/feedback`

**Request Body**:
```json
{
  "rating": "CORRECT",
  "comment": "Accurately caught fake CBI Skype summons"
}
```

---

### 2.7 Generate Evidence Brief & Cybercrime 1930 Draft
`POST /api/v1/reports`

**Request Body**:
```json
{
  "analysisId": "BS-94028"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "textSummary": "=====================================================\nBOBSEC FORENSIC INCIDENT BRIEFING...",
    "formattedSummary": "...",
    "cybercrimeDraft": {
      "incidentId": "BS-94028",
      "timestamp": "2026-09-17T01:32:00.000Z",
      "scamCategory": "Bank KYC & NetBanking Phishing",
      "severity": "High Risk",
      "incidentSummary": "...",
      "phoneNumbers": ["+91 98******92"],
      "urls": ["https://sbi-kyc-verify.cc"],
      "upiIds": [],
      "amounts": [],
      "evidenceText": "...",
      "recommendedOfficialAction": "...",
      "officialHelpline": "1930",
      "portalUrl": "https://cybercrime.gov.in"
    },
    "analysisId": "BS-94028",
    "reportHash": "9b71e02a4c1182cf..."
  }
}
```

---

### 2.8 Threat Matrix Statistics
`GET /api/v1/stats`

Returns aggregated risk metrics for the Threat Matrix visualization dashboard.

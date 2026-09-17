import {
  AnalysisResult,
  InputType,
  Language,
  AgentTraceNode,
  ScamCategory
} from '../../../shared/types/index.js';
import { PromptFirewall } from '../agents/promptFirewall.js';
import { ScamAgent } from '../agents/scamAgent.js';
import { IntelAgent } from '../agents/intelAgent.js';
import { BankSideAgent } from '../agents/bankSideAgent.js';
import { ConsumerAgent } from '../agents/consumerAgent.js';
import { ExplainerAgent } from '../agents/explainerAgent.js';
import { PolicyCheckAgent } from '../agents/policyCheckAgent.js';
import { RiskEngine } from './riskEngine.js';
import { AIProvider } from './aiProvider.js';
import { NeuralNetworkAgent } from './neuralNetworkAgent.js';
import { generateId, generateHash, generateReportIntegrityHash } from '../utils/hasher.js';
import { logger } from '../utils/logger.js';

export interface OrchestratorOptions {
  aiProvider: AIProvider;
  riskEngine?: RiskEngine;
  neuralAgent?: NeuralNetworkAgent;
  demoMode?: boolean;
}

export class BobSecOrchestrator {
  private aiProvider: AIProvider;
  private riskEngine: RiskEngine;
  private neuralAgent: NeuralNetworkAgent;
  private demoMode: boolean;

  constructor(options: OrchestratorOptions) {
    this.aiProvider = options.aiProvider;
    this.riskEngine = options.riskEngine || new RiskEngine();
    this.neuralAgent = options.neuralAgent || new NeuralNetworkAgent();
    this.demoMode = options.demoMode ?? true;
  }

  async runPipeline(
    rawText: string,
    inputType: InputType = 'MESSAGE',
    language: Language = 'en'
  ): Promise<AnalysisResult> {
    const overallStart = Date.now();
    const trace: AgentTraceNode[] = [];

    // --- Step 1: PromptFirewall ---
    const firewallStart = Date.now();
    const firewallResult = PromptFirewall.sanitizeAndInspect(rawText, inputType);
    trace.push({
      agentName: 'PromptFirewall',
      displayName: 'Prompt Firewall & Input Boundary',
      purpose: 'Sanitizes untrusted input, classifies input type, and neutralizes prompt injection override attempts.',
      sanitizedInputSummary: `Length: ${firewallResult.sanitizedText.length} chars · Type: ${firewallResult.detectedInputType}`,
      findings: firewallResult.containsInjectionAttempt
        ? ['Detected adversarial prompt injection pattern — neutralized as data', ...firewallResult.injectionSignatures]
        : ['Input validated within safe parameters · No prompt injection detected'],
      durationMs: Date.now() - firewallStart,
      confidence: 99,
      status: 'COMPLETED'
    });

    // Trigger Neural Network Agent inference early to run concurrently with other agents
    const neuralPromise = this.neuralAgent.analyze(firewallResult.sanitizedText);

    // --- Step 2: ScamAgent ---
    const scamStart = Date.now();
    const scamResult = ScamAgent.analyze(firewallResult.sanitizedText, firewallResult.detectedInputType);
    trace.push({
      agentName: 'ScamAgent',
      displayName: 'Scam & Social Engineering Core',
      purpose: 'Identifies urgency, authority spoofing, extortion vectors, and extracts indicators.',
      sanitizedInputSummary: `Identified ${scamResult.redFlags.length} primary red flags · ${scamResult.entities.length} entities`,
      findings: scamResult.redFlags.map((rf) => `${rf.title}: ${rf.description}`),
      durationMs: Date.now() - scamStart,
      confidence: scamResult.confidence,
      status: 'COMPLETED'
    });

    // --- Step 3: IntelAgent ---
    const intelStart = Date.now();
    const intelResult = IntelAgent.analyzeEntities(scamResult.entities);
    trace.push({
      agentName: 'IntelAgent',
      displayName: 'Indicator Telemetry & Heuristics',
      purpose: 'Correlates URLs, phone numbers, and UPI VPAs against high-risk infrastructure heuristics.',
      sanitizedInputSummary: `Evaluated ${intelResult.intelligence.sources.length} indicator endpoints`,
      findings: intelResult.findings.length > 0 ? intelResult.findings : ['All indicator syntaxes within expected baseline format'],
      durationMs: Date.now() - intelStart,
      confidence: 88,
      status: 'COMPLETED'
    });

    // --- Step 4: BankSideAgent & ConsumerAgent (Concurrent Execution) ---
    const bankStart = Date.now();
    const [bankResult, consumerResult] = await Promise.all([
      Promise.resolve(BankSideAgent.analyzeBankingContext(firewallResult.sanitizedText, scamResult.category)),
      Promise.resolve(
        ConsumerAgent.generateAdvice(
          scamResult.category,
          this.riskEngine.calculateScore(
            scamResult.redFlags,
            intelResult.updatedEntities,
            firewallResult.containsInjectionAttempt,
            scamResult.category === 'BENIGN'
          ).level,
          scamResult.redFlags.map((r) => r.title)
        )
      )
    ]);

    trace.push({
      agentName: 'BankSideAgent',
      displayName: 'Banking & Payment Protocol Sentinel',
      purpose: 'Evaluates unauthorized OTP, PIN, UPI collect, and remote screen-sharing requests.',
      sanitizedInputSummary: bankResult.hasBankingThreat ? 'Identified banking/financial risk signatures' : 'No direct banking threats detected',
      findings: bankResult.findings.length > 0 ? bankResult.findings : ['Payment channel rules adhered to'],
      durationMs: Date.now() - bankStart,
      confidence: 92,
      status: 'COMPLETED'
    });

    trace.push({
      agentName: 'ConsumerAgent',
      displayName: 'Consumer Defense & Advisory Agent',
      purpose: 'Translates technical risk findings into calm, practical consumer directives.',
      sanitizedInputSummary: `${consumerResult.recommendations.length} action items formulated`,
      findings: [consumerResult.plainExplanation],
      durationMs: consumerResult.durationMs,
      confidence: 90,
      status: 'COMPLETED'
    });

    // --- Step 5: NeuralNetworkAgent (Custom MLP Evaluation) ---
    const neuralResult = await neuralPromise;
    trace.push(neuralResult.traceNode);

    // Combine RedFlags and Recommendations
    const allRedFlags = [...scamResult.redFlags, ...bankResult.bankingRedFlags];
    const allRecommendations = [...consumerResult.recommendations, ...bankResult.bankingRecommendations];

    // Deduplicate recommendations by text
    const uniqueRecommendations = allRecommendations.filter(
      (rec, index, self) => index === self.findIndex((r) => r.text === rec.text)
    );

    // --- Step 6: AI Provider Refinement (Optional LLM Enhancement) ---
    let finalCategory = scamResult.category;
    let aiReasoning = '';
    if (this.aiProvider) {
      try {
        const aiOutput = await this.aiProvider.analyzeContent({
          text: firewallResult.sanitizedText,
          categoryHint: scamResult.category,
          detectedFlags: allRedFlags.map((f) => f.title)
        });
        finalCategory = aiOutput.refinedCategory;
        aiReasoning = aiOutput.reasoningNotes;
      } catch (err) {
        logger.warn('AI Provider step skipped or timed out, relying on deterministic core');
      }
    }

    // --- Deterministic Risk Engine Calculation (with bounded neural signal) ---
    const isBenign = finalCategory === 'BENIGN' && neuralResult.signal.scamProbability < 0.5;
    const riskVerdict = this.riskEngine.calculateScore(
      allRedFlags,
      intelResult.updatedEntities,
      firewallResult.containsInjectionAttempt,
      isBenign,
      neuralResult.signal.riskContribution
    );

    // --- Step 7: ExplainerAgent ---
    const explainerStart = Date.now();
    const explanation = ExplainerAgent.explain(
      finalCategory,
      riskVerdict.level,
      allRedFlags,
      uniqueRecommendations,
      language
    );

    trace.push({
      agentName: 'ExplainerAgent',
      displayName: 'Multilingual Synthesis & Explainer',
      purpose: 'Composes localized forensic summary, threat categorization, and actionable guidance.',
      sanitizedInputSummary: `Target Locale: ${language.toUpperCase()} · Category: ${explanation.categoryLabel}`,
      findings: [explanation.summary],
      durationMs: Date.now() - explainerStart,
      confidence: 94,
      status: 'COMPLETED'
    });

    // --- Preliminary Analysis Assembly ---
    const analysisId = generateId('BS');
    const createdAt = new Date().toISOString();
    const processingTimeMs = Date.now() - overallStart;

    const preliminaryResult: AnalysisResult = {
      id: analysisId,
      createdAt,
      input: {
        type: firewallResult.detectedInputType,
        text: rawText,
        sanitizedText: firewallResult.sanitizedText
      },
      verdict: {
        score: riskVerdict.score,
        level: riskVerdict.level,
        confidence: riskVerdict.confidence,
        category: finalCategory,
        categoryLabel: explanation.categoryLabel,
        summary: explanation.summary,
        nnModel: neuralResult.signal
      },
      redFlags: explanation.translatedRedFlags,
      entities: intelResult.updatedEntities,
      recommendations: explanation.translatedRecommendations,
      agentTrace: trace,
      intelligence: intelResult.intelligence,
      metadata: {
        language,
        demoMode: this.demoMode,
        aiProvider: this.aiProvider.name,
        processingTimeMs
      },
      nnModel: neuralResult.signal
    };

    // --- Step 8: PolicyCheckAgent ---
    const policyStart = Date.now();
    const policyResult = PolicyCheckAgent.inspectAndSanitize(preliminaryResult);

    trace.push({
      agentName: 'PolicyCheckAgent',
      displayName: 'Policy, Privacy & Defamation Guardrail',
      purpose: 'Audits output for non-defamatory phrasing, calibration, and PII anonymization.',
      sanitizedInputSummary: 'Audited output against statutory safety guidelines',
      findings: policyResult.policyNotes,
      durationMs: Date.now() - policyStart,
      confidence: 98,
      status: 'COMPLETED'
    });

    // Final result with report hash
    const finalResult = policyResult.sanitizedResult;
    finalResult.agentTrace = trace;
    finalResult.metadata.reportHash = generateHash(finalResult.id + finalResult.createdAt + finalResult.verdict.score);

    return finalResult;
  }
}

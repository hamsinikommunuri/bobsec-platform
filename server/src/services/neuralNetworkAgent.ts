/**
 * BobSec Neural Network Integration Service (Agent & Client).
 * 
 * Interfaces with the Python MLP inference service (/api/ml/predict).
 * Incorporates timeout controls, graceful fallback behavior, and bounded
 * risk signal calibration to guarantee system resilience.
 */
import { NeuralModelSignal, AgentTraceNode } from '../../../shared/types/index.js';
import { logger } from '../utils/logger.js';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

export interface NeuralAnalysisResult {
  signal: NeuralModelSignal;
  traceNode: AgentTraceNode;
}

export class NeuralNetworkAgent {
  private enabled: boolean;
  private timeoutMs: number;
  private endpointUrl: string;

  constructor() {
    this.enabled = process.env.PYTHON_ML_ENABLED !== 'false';
    this.timeoutMs = parseInt(process.env.PYTHON_ML_TIMEOUT_MS || '8000', 10);
    
    // Resolve endpoint URL
    if (process.env.PYTHON_ML_URL) {
      this.endpointUrl = process.env.PYTHON_ML_URL;
    } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      this.endpointUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/ml/predict`;
    } else if (process.env.VERCEL_URL) {
      this.endpointUrl = `https://${process.env.VERCEL_URL}/api/ml/predict`;
    } else {
      this.endpointUrl = 'https://bobsec-platform.vercel.app/api/ml/predict';
    }
  }

  /**
   * Translates continuous scam probability into a calibrated, bounded RiskEngine contribution.
   */
  static computeRiskContribution(scamProbability: number): number {
    if (scamProbability >= 0.85) return 18; // Very-high scam probability
    if (scamProbability >= 0.65) return 10; // Moderate scam signal
    if (scamProbability >= 0.50) return 4;  // Borderline scam tendency
    return 0; // Benign prediction adds 0 points (never reduces existing red flags)
  }

  /**
   * Executes inference against the Python MLP model.
   * If remote/HTTP endpoint fails or times out, attempts local Python CLI fallback before
   * resorting to graceful fail-safe bypass.
   */
  async analyze(rawText: string): Promise<NeuralAnalysisResult> {
    const startTime = Date.now();
    const isEnabled = this.enabled && process.env.PYTHON_ML_ENABLED !== 'false';

    if (!isEnabled) {
      const durationMs = Date.now() - startTime;
      return {
        signal: {
          label: 'benign',
          scamProbability: 0.0,
          confidence: 1.0,
          modelVersion: 'bobsec-mlp-v1 (disabled)',
          source: 'bobsec_custom_mlp',
          riskContribution: 0,
          status: 'DISABLED'
        },
        traceNode: {
          agentName: 'NeuralNetworkAgent',
          displayName: 'Custom Deep Neural Network (BobSec MLP)',
          purpose: 'Supervised classification using 3-layer Multilayer Perceptron on Word+Char TF-IDF.',
          sanitizedInputSummary: `ML Subsystem Disabled via configuration`,
          findings: ['Python ML subsystem disabled (PYTHON_ML_ENABLED=false) � bypassed'],
          durationMs,
          confidence: 100,
          status: 'SKIPPED'
        }
      };
    }

    const isVercel = Boolean(process.env.VERCEL);
    const hasExplicitUrl = Boolean(process.env.PYTHON_ML_URL);

    // Execution helper for HTTP call
    const tryHttp = async (): Promise<NeuralAnalysisResult | null> => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText }),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (response.ok) {
          const data = (await response.json()) as any;
          const scamProbability = typeof data.scam_probability === 'number' ? data.scam_probability : 0.0;
          const confidence = typeof data.confidence === 'number' ? data.confidence : 0.5;
          const label = data.predicted_label === 'scam' ? 'scam' : 'benign';
          const modelVersion = data.model_version || 'bobsec-mlp-v1';
          const source = data.source || 'bobsec_custom_mlp';
          const riskContribution = NeuralNetworkAgent.computeRiskContribution(scamProbability);
          const durationMs = Date.now() - startTime;

          return {
            signal: {
              label,
              scamProbability,
              confidence,
              modelVersion,
              source,
              riskContribution,
              status: 'COMPLETED'
            },
            traceNode: {
              agentName: 'NeuralNetworkAgent',
              displayName: 'Custom Deep Neural Network (BobSec MLP)',
              purpose: 'Supervised classification using 3-layer Multilayer Perceptron on Word+Char TF-IDF.',
              sanitizedInputSummary: `Evaluated ${rawText.length} chars · Model: ${modelVersion}`,
              findings: [
                `Classified as ${label.toUpperCase()} with ${(scamProbability * 100).toFixed(1)}% scam probability`,
                `Neural Network Risk Signal contribution: +${riskContribution} points`
              ],
              durationMs,
              confidence: Math.round(confidence * 100),
              status: 'COMPLETED'
            }
          };
        }
      } catch (httpErr: any) {
        logger.warn(`Neural Network HTTP call failed (${httpErr.message}).`);
      }
      return null;
    };

    // Execution helper for local Python CLI
    const tryLocal = async (): Promise<NeuralAnalysisResult | null> => {
      try {
        const pythonExe = process.env.PYTHON_PATH ||
          (process.platform === 'win32'
            ? 'C:\\Users\\hamsi\\AppData\\Local\\Programs\\Python\\Python311\\python.exe'
            : 'python3');
        const rootDir = fs.existsSync(path.resolve(process.cwd(), 'ml'))
          ? process.cwd()
          : path.resolve(process.cwd(), '..');
        const { stdout } = await execFileAsync(pythonExe, ['-m', 'ml.src.inference', rawText], {
          timeout: this.timeoutMs,
          cwd: rootDir,
          env: { ...process.env, PYTHONPATH: rootDir }
        });
        const data = JSON.parse(stdout.trim());
        
        const scamProbability = typeof data.scam_probability === 'number' ? data.scam_probability : 0.0;
        const confidence = typeof data.confidence === 'number' ? data.confidence : 0.5;
        const label = data.predicted_label === 'scam' ? 'scam' : 'benign';
        const riskContribution = NeuralNetworkAgent.computeRiskContribution(scamProbability);
        const durationMs = Date.now() - startTime;

        return {
          signal: {
            label,
            scamProbability,
            confidence,
            modelVersion: data.model_version || 'bobsec-mlp-v1',
            source: 'bobsec_custom_mlp_local',
            riskContribution,
            status: 'COMPLETED'
          },
          traceNode: {
            agentName: 'NeuralNetworkAgent',
            displayName: 'Custom Deep Neural Network (BobSec MLP)',
            purpose: 'Supervised classification using 3-layer Multilayer Perceptron on Word+Char TF-IDF.',
            sanitizedInputSummary: `Evaluated ${rawText.length} chars · Model: ${data.model_version}`,
            findings: [
              `Classified as ${label.toUpperCase()} with ${(scamProbability * 100).toFixed(1)}% scam probability (Local Exec)`,
              `Neural Network Risk Signal contribution: +${riskContribution} points`
            ],
            durationMs,
            confidence: Math.round(confidence * 100),
            status: 'COMPLETED'
          }
        };
      } catch (localErr: any) {
        logger.warn(`Local Python execution failed (${localErr.message}).`);
      }
      return null;
    };

    // If running in Vercel or explicit remote ML URL provided, prioritize HTTP
    if (isVercel || hasExplicitUrl) {
      const httpResult = await tryHttp();
      if (httpResult) return httpResult;
      const localResult = await tryLocal();
      if (localResult) return localResult;
    } else {
      // Running in local/test environment: prioritize fast local execution
      const localResult = await tryLocal();
      if (localResult) return localResult;
      const httpResult = await tryHttp();
      if (httpResult) return httpResult;
    }

    // Fail-safe fallback: Never crash the user pipeline
    const durationMs = Date.now() - startTime;
    return {
      signal: {
        label: 'benign',
        scamProbability: 0.0,
        confidence: 0.5,
        modelVersion: 'bobsec-mlp-v1 (fallback)',
        source: 'bobsec_resilient_fallback',
        riskContribution: 0,
        status: 'FALLBACK'
      },
      traceNode: {
        agentName: 'NeuralNetworkAgent',
        displayName: 'Custom Deep Neural Network (BobSec MLP)',
        purpose: 'Supervised classification using 3-layer Multilayer Perceptron on Word+Char TF-IDF.',
        sanitizedInputSummary: `Fail-safe bypass activated`,
        findings: ['Neural inference offline or timed out; deterministic security core continuing unimpeded.'],
        durationMs,
        confidence: 50,
        status: 'COMPLETED'
      }
    };
  }
}

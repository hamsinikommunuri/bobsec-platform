import { describe, it, expect } from 'vitest';
import { NeuralNetworkAgent } from '../src/services/neuralNetworkAgent.js';
import { RiskEngine } from '../src/services/riskEngine.js';
import { BobSecOrchestrator } from '../src/services/orchestrator.js';
import { MockAIProvider } from '../src/services/mockAIProvider.js';

describe('Neural Network Subsystem Integration Tests', () => {
  describe('NeuralNetworkAgent.computeRiskContribution', () => {
    it('should assign bounded 18 points for very-high scam probability (>= 0.85)', () => {
      expect(NeuralNetworkAgent.computeRiskContribution(0.99)).toBe(18);
      expect(NeuralNetworkAgent.computeRiskContribution(0.85)).toBe(18);
    });

    it('should assign bounded 10 points for moderate scam probability (0.65 to 0.84)', () => {
      expect(NeuralNetworkAgent.computeRiskContribution(0.84)).toBe(10);
      expect(NeuralNetworkAgent.computeRiskContribution(0.65)).toBe(10);
    });

    it('should assign bounded 4 points for borderline scam tendency (0.50 to 0.64)', () => {
      expect(NeuralNetworkAgent.computeRiskContribution(0.64)).toBe(4);
      expect(NeuralNetworkAgent.computeRiskContribution(0.50)).toBe(4);
    });

    it('should assign 0 points for benign predictions (< 0.50)', () => {
      expect(NeuralNetworkAgent.computeRiskContribution(0.49)).toBe(0);
      expect(NeuralNetworkAgent.computeRiskContribution(0.10)).toBe(0);
      expect(NeuralNetworkAgent.computeRiskContribution(0.0)).toBe(0);
    });
  });

  describe('RiskEngine Neural Integration', () => {
    const riskEngine = new RiskEngine();

    it('should integrate neuralNetworkSignal into scoreBreakdown and rawSum', () => {
      const result = riskEngine.calculateScore([], [], false, false, 18);
      expect(result.scoreBreakdown.neuralNetworkSignal).toBe(18);
      expect(result.scoreBreakdown.rawSum).toBe(18);
      expect(result.score).toBe(18);
    });

    it('should cap overall score at 100 even with high neural contribution and red flags', () => {
      const criticalFlags = [
        { id: '1', title: 'Flag 1', description: '', severity: 'CRITICAL' as const },
        { id: '2', title: 'Flag 2', description: '', severity: 'CRITICAL' as const },
        { id: '3', title: 'Flag 3', description: '', severity: 'CRITICAL' as const }
      ];
      const result = riskEngine.calculateScore(criticalFlags, [], false, false, 18);
      expect(result.score).toBe(100);
      expect(result.scoreBreakdown.cappedScore).toBe(100);
      expect(result.scoreBreakdown.rawSum).toBeGreaterThan(100);
    });

    it('should return low risk score for benign text with zero neural contribution', () => {
      const result = riskEngine.calculateScore([], [], false, true, 0);
      expect(result.score).toBe(5);
      expect(result.level).toBe('Low Risk');
    });
  });

  describe('Orchestrator End-to-End Pipeline with Neural Agent', () => {
    it('should execute pipeline with neural agent and include nnModel in verdict and trace', async () => {
      const orchestrator = new BobSecOrchestrator({
        aiProvider: new MockAIProvider(),
        demoMode: true
      });

      const result = await orchestrator.runPipeline(
        'Your SBI account is suspended! Complete KYC immediately at https://sbi-fake.cc',
        'MESSAGE',
        'en'
      );

      // Verify verdict contains neural model signal
      expect(result.verdict.nnModel).toBeDefined();
      expect(result.nnModel).toBeDefined();
      expect(result.verdict.nnModel?.modelVersion).toContain('bobsec-mlp');
      expect(result.verdict.nnModel?.riskContribution).toBeGreaterThanOrEqual(0);

      // Verify neural agent trace node
      const neuralTraceNode = result.agentTrace.find(t => t.agentName === 'NeuralNetworkAgent');
      expect(neuralTraceNode).toBeDefined();
      expect(neuralTraceNode?.displayName).toContain('Neural Network');
      expect(neuralTraceNode?.status).toBe('COMPLETED');
    }, 15000);

    it('should gracefully fail-safe when neural agent encounters an error without failing the pipeline', async () => {
      const resilientAgent = new NeuralNetworkAgent();
      process.env.PYTHON_ML_ENABLED = 'false';
      const fallbackResult = await resilientAgent.analyze('Some text');
      process.env.PYTHON_ML_ENABLED = 'true';

      expect(fallbackResult.signal.status).toBe('DISABLED');
      expect(fallbackResult.signal.riskContribution).toBe(0);
      expect(fallbackResult.traceNode.status).toBe('SKIPPED');
    });
  });
});

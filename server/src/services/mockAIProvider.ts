import { AIProvider, AIAnalysisPromptInput, AIAnalysisOutput } from './aiProvider.js';

export class MockAIProvider implements AIProvider {
  name = 'BobSec-EnclaveHeuristics (Mock AI)';

  isAvailable(): boolean {
    return true;
  }

  async analyzeContent(input: AIAnalysisPromptInput): Promise<AIAnalysisOutput> {
    // Artificial lightweight processing latency (20 - 50ms) to simulate realistic agent invocation
    await new Promise((resolve) => setTimeout(resolve, 35));

    const lower = input.text.toLowerCase();
    let confidence = 85;

    if (input.detectedFlags.length >= 2) {
      confidence = 94;
    } else if (input.detectedFlags.length === 1) {
      confidence = 82;
    }

    let reasoningNotes =
      'Correlated text semantics against Indian localized cyber fraud taxonomy. High syntactic overlap with active extortion campaigns.';

    if (input.categoryHint === 'BENIGN') {
      reasoningNotes = 'Linguistic semantic structure indicates normal everyday conversational intent with absence of coercion.';
    }

    return {
      refinedCategory: input.categoryHint,
      aiConfidence: confidence,
      reasoningNotes
    };
  }
}

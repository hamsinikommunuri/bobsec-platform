import { RiskLevel, RedFlag, ExtractedEntity } from '../../../shared/types/index.js';
import { RISK_LEVEL_CONFIG } from '../../../shared/constants/index.js';

export interface SignalWeightsConfig {
  criticalScore: number;
  highScore: number;
  mediumScore: number;
  lowScore: number;
}

export const DEFAULT_WEIGHTS: SignalWeightsConfig = {
  criticalScore: 35,
  highScore: 25,
  mediumScore: 12,
  lowScore: 5
};

export interface RiskEngineResult {
  score: number; // 0 - 100
  level: RiskLevel;
  confidence: number;
  scoreBreakdown: {
    signalsTotal: number;
    entityRiskAddon: number;
    injectionPenalty: number;
    neuralNetworkSignal: number;
    rawSum: number;
    cappedScore: number;
  };
}

export class RiskEngine {
  constructor(private weights: SignalWeightsConfig = DEFAULT_WEIGHTS) {}

  calculateScore(
    redFlags: RedFlag[],
    entities: ExtractedEntity[],
    containsInjectionAttempt: boolean,
    isBenignText = false,
    neuralNetworkSignal = 0
  ): RiskEngineResult {
    if (isBenignText && redFlags.length === 0 && neuralNetworkSignal === 0) {
      return {
        score: 5,
        level: 'Low Risk',
        confidence: 95,
        scoreBreakdown: {
          signalsTotal: 0,
          entityRiskAddon: 0,
          injectionPenalty: 0,
          neuralNetworkSignal: 0,
          rawSum: 5,
          cappedScore: 5
        }
      };
    }

    let signalsTotal = 0;
    for (const flag of redFlags) {
      if (flag.severity === 'CRITICAL') signalsTotal += this.weights.criticalScore;
      else if (flag.severity === 'HIGH') signalsTotal += this.weights.highScore;
      else if (flag.severity === 'MEDIUM') signalsTotal += this.weights.mediumScore;
      else signalsTotal += this.weights.lowScore;
    }

    // Entity risk addon
    let entityRiskAddon = 0;
    for (const entity of entities) {
      if (entity.status === 'Suspicious') {
        entityRiskAddon += 8;
      }
    }
    entityRiskAddon = Math.min(25, entityRiskAddon);

    // Injection attempt penalty (attempting to override the system is a red flag itself)
    const injectionPenalty = containsInjectionAttempt ? 20 : 0;

    const rawSum = signalsTotal + entityRiskAddon + injectionPenalty + neuralNetworkSignal;
    const cappedScore = Math.min(100, Math.max(0, rawSum));

    const level = this.resolveLevel(cappedScore);

    // Dynamic confidence
    let confidence = 75;
    if (cappedScore >= 80) confidence = 94;
    else if (cappedScore >= 60) confidence = 88;
    else if (cappedScore <= 15) confidence = 90;

    return {
      score: cappedScore,
      level,
      confidence,
      scoreBreakdown: {
        signalsTotal,
        entityRiskAddon,
        injectionPenalty,
        neuralNetworkSignal,
        rawSum,
        cappedScore
      }
    };
  }

  private resolveLevel(score: number): RiskLevel {
    if (score >= RISK_LEVEL_CONFIG.HIGH.min) return RISK_LEVEL_CONFIG.HIGH.label;
    if (score >= RISK_LEVEL_CONFIG.SUSPICIOUS.min) return RISK_LEVEL_CONFIG.SUSPICIOUS.label;
    if (score >= RISK_LEVEL_CONFIG.CAUTION.min) return RISK_LEVEL_CONFIG.CAUTION.label;
    return RISK_LEVEL_CONFIG.LOW.label;
  }
}

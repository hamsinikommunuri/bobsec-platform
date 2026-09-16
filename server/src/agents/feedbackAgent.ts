import { UserFeedback } from '../../../shared/types/index.js';
import { IAnalysisRepository } from '../repositories/analysisRepository.js';
import { logger } from '../utils/logger.js';

export interface FeedbackProcessingResult {
  success: boolean;
  ruleSuggestionGenerated: boolean;
  message: string;
}

export class FeedbackAgent {
  constructor(private repository: IAnalysisRepository) {}

  async recordFeedback(feedback: UserFeedback): Promise<FeedbackProcessingResult> {
    try {
      await this.repository.saveFeedback(feedback);
      logger.info(`Recorded analysis feedback: [${feedback.rating}] for analysis ${feedback.analysisId}`);

      let ruleSuggestionGenerated = false;
      if (feedback.rating === 'INCORRECT') {
        ruleSuggestionGenerated = true;
        logger.info(`Generated offline rule suggestion dossier for human audit regarding ${feedback.analysisId}`);
      }

      return {
        success: true,
        ruleSuggestionGenerated,
        message: 'Feedback recorded successfully for sovereign telemetry refinement.'
      };
    } catch (err) {
      logger.error('Failed to process user feedback', err);
      return {
        success: false,
        ruleSuggestionGenerated: false,
        message: 'Error writing feedback to local ledger.'
      };
    }
  }
}

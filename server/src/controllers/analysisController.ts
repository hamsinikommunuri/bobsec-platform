import { Request, Response, NextFunction } from 'express';
import { BobSecOrchestrator } from '../services/orchestrator.js';
import { IAnalysisRepository } from '../repositories/analysisRepository.js';
import { FeedbackAgent } from '../agents/feedbackAgent.js';
import { ReportGenerator } from '../services/reportGenerator.js';
import { DEMO_SAMPLES, BENIGN_SAMPLES } from '../../../shared/constants/samples.js';

export class AnalysisController {
  constructor(
    private orchestrator: BobSecOrchestrator,
    private repository: IAnalysisRepository,
    private feedbackAgent: FeedbackAgent
  ) {}

  analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content, type, language, saveToHistory } = req.body;

      const result = await this.orchestrator.runPipeline(content, type, language);

      // Save to local SQLite unless privacy option is explicitly false
      if (saveToHistory !== false) {
        await this.repository.save(result);
      }

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          savedToHistory: saveToHistory !== false,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  };

  listAnalyses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const level = typeof req.query.level === 'string' ? req.query.level : undefined;

      const items = await this.repository.list({ search, level });

      res.status(200).json({
        success: true,
        data: items,
        meta: {
          count: items.length
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getAnalysisById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const analysis = await this.repository.getById(id);

      if (!analysis) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Analysis with identifier ${id} was not found in the local ledger.`
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: analysis,
        meta: {}
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const deleted = await this.repository.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Record ${id} not found.`
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { id, deleted: true },
        meta: {}
      });
    } catch (error) {
      next(error);
    }
  };

  clearVault = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.repository.clearAll();
      res.status(200).json({
        success: true,
        data: { cleared: true },
        meta: { message: 'All local analysis ledger entries purged.' }
      });
    } catch (error) {
      next(error);
    }
  };

  submitFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { rating, comment } = req.body;

      const result = await this.feedbackAgent.recordFeedback({
        analysisId: id,
        rating,
        comment
      });

      res.status(200).json({
        success: true,
        data: { saved: result.success, ...result },
        meta: {}
      });
    } catch (error) {
      next(error);
    }
  };

  getSamples = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      data: [...DEMO_SAMPLES, ...BENIGN_SAMPLES],
      meta: {
        threatArchetypes: DEMO_SAMPLES,
        benignSamples: BENIGN_SAMPLES,
        total: DEMO_SAMPLES.length + BENIGN_SAMPLES.length
      }
    });
  };

  generateReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { analysisId } = req.body;
      const analysis = await this.repository.getById(analysisId);

      if (!analysis) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Analysis record not found for generating evidence report.'
          }
        });
        return;
      }

      const textSummary = ReportGenerator.generateTextSummary(analysis);
      const cybercrimeDraft = ReportGenerator.generateCybercrimeDraft(analysis);

      res.status(200).json({
        success: true,
        data: {
          textSummary,
          formattedSummary: textSummary,
          cybercrimeDraft,
          analysisId: analysis.id,
          reportHash: analysis.metadata.reportHash
        },
        meta: {}
      });
    } catch (error) {
      next(error);
    }

  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.repository.getStats();
      res.status(200).json({
        success: true,
        data: stats,
        meta: {}
      });
    } catch (error) {
      next(error);
    }
  };
}

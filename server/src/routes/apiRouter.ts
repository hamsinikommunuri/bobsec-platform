import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController.js';
import { ConfigController } from '../controllers/configController.js';
import { validateBody } from '../middleware/validation.js';
import { AnalyzeRequestSchema, FeedbackRequestSchema } from '../../../shared/schemas/index.js';
import { z } from 'zod';

const ReportRequestSchema = z.object({
  analysisId: z.string().min(1, 'Analysis ID is required')
});

export function createApiRouter(
  analysisController: AnalysisController,
  configController: ConfigController
): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'UP',
        uptime: process.uptime(),
        enclave: 'ACTIVE',
        timestamp: new Date().toISOString()
      },
      meta: {}
    });
  });

  // Public system configuration
  router.get('/config/public', configController.getPublicConfig);

  // Threat samples (archetypes & benign controls)
  router.get('/samples', analysisController.getSamples);

  // Threat analysis
  router.post('/analyze', validateBody(AnalyzeRequestSchema), analysisController.analyze);

  // Analysis ledger history
  router.get('/analyses', analysisController.listAnalyses);
  router.get('/analyses/:id', analysisController.getAnalysisById);
  router.delete('/analyses/:id', analysisController.deleteAnalysis);
  router.delete('/analyses', analysisController.clearVault);

  // User feedback
  router.post(
    '/analyses/:id/feedback',
    validateBody(FeedbackRequestSchema),
    analysisController.submitFeedback
  );

  // Forensic evidence and cybercrime draft generation
  router.post('/reports', validateBody(ReportRequestSchema), analysisController.generateReports);

  // Threat metrics for Scam Intelligence Matrix
  router.get('/stats', analysisController.getStats);

  return router;
}

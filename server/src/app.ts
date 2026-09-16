import express, { Express } from 'express';
import { env } from './config/env.js';
import { securityHeaders, corsMiddleware, apiRateLimiter } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { SqliteAnalysisRepository } from './repositories/sqliteAnalysisRepository.js';
import { BobSecOrchestrator } from './services/orchestrator.js';
import { MockAIProvider } from './services/mockAIProvider.js';
import { WatsonxProvider } from './services/watsonxProvider.js';
import { FeedbackAgent } from './agents/feedbackAgent.js';
import { AnalysisController } from './controllers/analysisController.js';
import { ConfigController } from './controllers/configController.js';
import { createApiRouter } from './routes/apiRouter.js';
import { logger } from './utils/logger.js';

export function createApp(): { app: Express; repository: SqliteAnalysisRepository; orchestrator: BobSecOrchestrator } {
  const app = express();

  // Basic security and parsing
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Apply rate limiter to API endpoints
  app.use('/api/', apiRateLimiter);

  // Initialize storage repository
  const repository = new SqliteAnalysisRepository(env.SQLITE_DB_PATH);

  // Select AI Provider
  let aiProvider = new MockAIProvider();
  if (env.AI_PROVIDER === 'watsonx') {
    const watsonx = new WatsonxProvider({
      url: env.WATSONX_URL,
      projectId: env.WATSONX_PROJECT_ID,
      apiKey: env.WATSONX_API_KEY,
      modelId: env.WATSONX_MODEL_ID
    });
    if (watsonx.isAvailable()) {
      aiProvider = watsonx as any;
      logger.info('Initialized live IBM Watsonx Granite provider');
    } else {
      logger.warn('Watsonx requested but credentials not available. Operating with MockAIProvider');
    }
  } else {
    logger.info('Operating with sovereign MockAIProvider in Demo Mode');
  }

  // Initialize Orchestrator & Agents
  const orchestrator = new BobSecOrchestrator({
    aiProvider,
    demoMode: env.DEMO_MODE
  });

  const feedbackAgent = new FeedbackAgent(repository);
  const analysisController = new AnalysisController(orchestrator, repository, feedbackAgent);
  const configController = new ConfigController();

  // Register Versioned Router
  const apiRouter = createApiRouter(analysisController, configController);
  app.use('/api/v1', apiRouter);
  app.use('/v1', apiRouter);

  // Fallback 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'ENDPOINT_NOT_FOUND',
        message: `Resource ${req.method} ${req.originalUrl} not found.`
      }
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return { app, repository, orchestrator };
}

const defaultInstance = createApp();
export const app = defaultInstance.app;
export const repository = defaultInstance.repository;
export const orchestrator = defaultInstance.orchestrator;
export default app;


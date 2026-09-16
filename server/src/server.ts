import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { DEMO_SAMPLES } from '../../shared/constants/samples.js';

const { app, repository, orchestrator } = createApp();

async function seedDemoDataIfEmpty() {
  try {
    const stats = await repository.getStats();
    if (stats.total === 0 && env.DEMO_MODE) {
      logger.info('Demo Mode active & ledger empty: pre-seeding realistic sample forensic analyses...');
      // Seed 4 prominent threat archetypes
      const seedItems = DEMO_SAMPLES.slice(0, 4);
      for (const item of seedItems) {
        const result = await orchestrator.runPipeline(item.sampleText, item.inputType, 'en');
        await repository.save(result);
      }
      logger.info(`Successfully seeded ${seedItems.length} demo analyses into SQLite ledger.`);
    }
  } catch (err) {
    logger.warn('Failed to seed demo data', err);
  }
}

const server = app.listen(env.PORT, async () => {
  logger.info(`=======================================================`);
  logger.info(`BOBSEC AI SCAM SHIELD — BACKEND LISTENING ON PORT ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV} | Demo Mode: ${env.DEMO_MODE} | AI: ${env.AI_PROVIDER}`);
  logger.info(`Database: ${env.SQLITE_DB_PATH}`);
  logger.info(`API Base: http://localhost:${env.PORT}/api/v1`);
  logger.info(`=======================================================`);

  await seedDemoDataIfEmpty();
});

export default server;

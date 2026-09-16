import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  logger.error(`API Exception at ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const isProd = env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred during threat analysis.',
      ...(isProd ? {} : { details: err.stack })
    }
  });
}

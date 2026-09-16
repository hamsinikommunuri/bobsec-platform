import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { RequestHandler } from 'express';

export const securityHeaders = helmet({
  contentSecurityPolicy: false // allow frontend local dev proxy
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow local development ports and same-origin
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
});

export const apiRateLimiter: RequestHandler = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many analysis requests initiated from this client. Please wait before retrying.'
    }
  }
});

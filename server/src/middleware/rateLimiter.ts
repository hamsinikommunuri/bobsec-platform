import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please slow down and try again shortly.',
    },
  },
});

export const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 analyses per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'ANALYZE_RATE_LIMIT_EXCEEDED',
      message: 'Analysis limit reached. Please wait a minute before analyzing more messages.',
    },
  },
});

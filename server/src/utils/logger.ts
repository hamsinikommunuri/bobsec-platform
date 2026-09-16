import { maskTextPII } from './masking.js';

export const logger = {
  info: (message: string, meta?: unknown) => {
    const maskedMsg = maskTextPII(message);
    const maskedMeta = meta ? maskTextPII(JSON.stringify(meta)) : '';
    console.log(`[INFO] ${new Date().toISOString()} - ${maskedMsg} ${maskedMeta}`);
  },
  warn: (message: string, meta?: unknown) => {
    const maskedMsg = maskTextPII(message);
    const maskedMeta = meta ? maskTextPII(JSON.stringify(meta)) : '';
    console.warn(`[WARN] ${new Date().toISOString()} - ${maskedMsg} ${maskedMeta}`);
  },
  error: (message: string, error?: unknown) => {
    const maskedMsg = maskTextPII(message);
    console.error(`[ERROR] ${new Date().toISOString()} - ${maskedMsg}`, error || '');
  }
};

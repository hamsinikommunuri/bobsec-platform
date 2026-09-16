import { Request, Response } from 'express';
import { env } from '../config/env.js';

export class ConfigController {
  getPublicConfig = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        name: 'BOBSEC',
        brand: 'BOBSEC',
        subtitle: 'AI Scam Shield for Indian Users',
        version: '1.0.0-enclave',
        demoMode: env.DEMO_MODE,
        aiProvider: env.AI_PROVIDER,
        supportedLanguages: ['en', 'hi'],
        supportedInputs: ['MESSAGE', 'URL', 'PHONE', 'UPI'],
        helpline1930: '1930',
        riskLevels: ['Safe', 'Low Risk', 'Caution', 'Suspicious', 'High Risk', 'Likely Scam', 'Unable to Verify'],
        enclaveStatus: 'NOMINAL · Ring-0 Heuristics Active'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  };
}


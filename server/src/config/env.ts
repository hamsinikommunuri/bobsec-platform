import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // fallback to local .env

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEMO_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true' || val === '1'),
  AI_PROVIDER: z.enum(['mock', 'watsonx']).default('mock'),
  WATSONX_URL: z.string().optional().default('https://us-south.ml.cloud.ibm.com'),
  WATSONX_PROJECT_ID: z.string().optional().default(''),
  WATSONX_API_KEY: z.string().optional().default(''),
  WATSONX_MODEL_ID: z.string().optional().default('ibm/granite-3-8b-instruct'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  SQLITE_DB_PATH: z.string().default(process.env.VERCEL ? '/tmp/bobsec_data.sqlite' : './bobsec_data.sqlite')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

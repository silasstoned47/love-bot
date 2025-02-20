import { z } from 'zod';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('80'),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.string().default('development'),
  BASE_URL: z.string(),

  // Facebook
  FACEBOOK_PAGE_ID: z.string(),
  FACEBOOK_ACCESS_TOKEN: z.string(),
  FACEBOOK_VERIFICATION_TOKEN: z.string(),
  
  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  REDIS_PASSWORD: z.string().optional(),

  // MySQL
  MYSQL_HOST: z.string(),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  MYSQL_PORT: z.string().transform(Number).default('3306'),
});

export const env = envSchema.parse(process.env);
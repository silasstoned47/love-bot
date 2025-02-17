import { z } from 'zod';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('5000'),
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
  REDIS_PASSWORD: z.string(),
  
  // MySQL
  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.string().transform(Number).default('3306'),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
});

// Valida as variáveis de ambiente
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Variáveis de ambiente inválidas:', _env.error.format());
  throw new Error('Variáveis de ambiente inválidas.');
}

export const env = _env.data;
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BASE_URL: z.string(),

  // Facebook
  FACEBOOK_PAGE_ID: z.string(),
  FACEBOOK_ACCESS_TOKEN: z.string(),
  FACEBOOK_VERIFICATION_TOKEN: z.string(),

  // Redis
  REDIS_HOST: z.string().default('redis'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string(),

  // MySQL
  MYSQL_HOST: z.string().default('mysql'),
  MYSQL_PORT: z.string().default('3306'),
  MYSQL_USER: z.string().default('mariadb'),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string().default('social_db_meta'),
});

const env = envSchema.parse(process.env);

export default env;
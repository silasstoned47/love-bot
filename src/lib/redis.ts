import Redis from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (error) => {
  logger.error('Erro na conexão Redis:', error);
});

redis.on('connect', () => {
  logger.info('✅ Conectado ao Redis');
});

export async function connectRedis() {
  try {
    await redis.ping();
  } catch (error) {
    logger.error('❌ Erro ao conectar ao Redis:', error);
    throw error;
  }
}
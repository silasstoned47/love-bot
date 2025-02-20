import Redis from 'ioredis';
import env from '../config/env.js';

const redis = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redis;
import { redis } from '../lib/redis';
import { logger } from '../config/logger';

async function clearRedis() {
  try {
    logger.info('🧹 Limpando mensagens agendadas do Redis...');

    // Remove todas as mensagens agendadas
    const removed = await redis.del('scheduled_messages');
    
    logger.info(`✅ Redis limpo: ${removed} chaves removidas`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Erro ao limpar Redis:', error);
    process.exit(1);
  }
}

clearRedis();

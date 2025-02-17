import { redis } from '../lib/redis';
import { logger } from '../config/logger';

async function checkRedis() {
  try {
    logger.info(' Verificando mensagens agendadas no Redis...');

    // Pega todas as mensagens agendadas
    const messages = await redis.zrange('scheduled_messages', 0, -1, 'WITHSCORES');
    
    if (messages.length === 0) {
      logger.info('Nenhuma mensagem agendada encontrada');
      process.exit(0);
    }

    logger.info(` Encontradas ${messages.length / 2} mensagens agendadas:`);

    // Processa as mensagens em pares (membro, score)
    for (let i = 0; i < messages.length; i += 2) {
      const messageData = JSON.parse(messages[i]);
      const scheduledTime = new Date(Number(messages[i + 1]));
      const now = new Date();
      const delayMs = Number(messages[i + 1]) - now.getTime();
      
      logger.info(` Mensagem ${Math.floor(i/2) + 1}:`, {
        messageData,
        scheduledTime: scheduledTime.toLocaleString(),
        delayRestante: `${Math.round(delayMs/1000)} segundos`,
        rawMessage: messages[i],
        rawScore: messages[i + 1]
      });
    }

    process.exit(0);
  } catch (error) {
    logger.error('Erro ao verificar Redis:', error);
    process.exit(1);
  }
}

checkRedis();

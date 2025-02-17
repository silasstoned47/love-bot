import { redis } from '../lib/redis';
import { sendMessage } from '../services/messenger';
import { logger } from '../config/logger';

const INTERVAL = 1000; // 1 segundo

async function processScheduledMessages() {
  while (true) {
    try {
      logger.info('🔍 Buscando mensagens agendadas...');
      
      // Busca mensagens agendadas para envio
      const messages = await redis.zrangebyscore(
        'scheduled_messages',
        0,
        Date.now(),
        'WITHSCORES'
      );

      logger.info(`📬 Encontradas ${messages.length / 2} mensagens para enviar`);

      if (messages.length > 0) {
        for (let i = 0; i < messages.length; i += 2) {
          try {
            const messageStr = messages[i];
            const messageData = JSON.parse(messageStr);
            const scheduledTime = new Date(Number(messages[i + 1]));
            
            logger.info('📨 Processando mensagem:', {
              messageData,
              scheduledTime: scheduledTime.toLocaleString(),
              messageStr
            });

            // Remove da fila antes de enviar para evitar duplicação
            logger.info('🗑️ Removendo mensagem da fila:', { messageStr });
            const removed = await redis.zrem('scheduled_messages', messageStr);
            
            if (removed) {
              logger.info('✅ Mensagem removida da fila, enviando...');
              
              // Envia a mensagem
              await sendMessage(
                messageData.senderId,
                messageData.messageType
              );
            } else {
              logger.warn('⚠️ Mensagem não encontrada na fila, pode ter sido processada por outro worker');
            }
          } catch (error: any) {
            logger.error('❌ Erro ao processar mensagem individual:', {
              error: error.message,
              response: error.response?.data,
              messageStr: messages[i]
            });
            // Continua processando outras mensagens
          }
        }
      }

      // Aguarda próximo ciclo
      await new Promise(resolve => setTimeout(resolve, INTERVAL));
    } catch (error: any) {
      logger.error('❌ Erro no processamento de mensagens:', {
        error: error.message,
        stack: error.stack
      });
      await new Promise(resolve => setTimeout(resolve, INTERVAL));
    }
  }
}

processScheduledMessages();
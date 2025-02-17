import { redis } from '../lib/redis';
import { pool } from '../lib/mysql';
import { logger } from '../config/logger';
import { sendMessage } from './messenger';

export async function processMessage(event: any) {
  try {
    const { sender, lead } = event;
    logger.info('Processando mensagem:', JSON.stringify({ sender, lead }, null, 2));

    // Verifica se é uma resposta "Sim"
    const answer = lead?.data?.[0]?.answer;
    if (answer?.toLowerCase() === 'sim') {
      logger.info('Mensagem "Sim" detectada');
      
      // Verifica duplicação
      const exists = await checkDuplicateLead(sender.id);
      logger.info('Verificação de duplicação:', { exists, senderId: sender.id });
      
      if (exists) {
        logger.info(`Lead duplicado: ${sender.id}`);
        return;
      }

      try {
        // Salva o lead
        await saveLead(sender.id);
        logger.info('Lead salvo com sucesso:', { senderId: sender.id });

        // Agenda as mensagens
        await scheduleMessages(sender.id);
        logger.info('Mensagens agendadas com sucesso:', { senderId: sender.id });
      } catch (error) {
        logger.error('Erro ao salvar lead ou agendar mensagens:', error);
        throw error;
      }
    } else {
      logger.info('Mensagem ignorada - não é "Sim":', answer);
    }
  } catch (error) {
    logger.error('Erro ao processar mensagem:', error);
    throw error;
  }
}

async function checkDuplicateLead(senderId: string) {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM page_540118319183094 WHERE sender_id = ? LIMIT 1',
      [senderId]
    );
    logger.info('Resultado da verificação de duplicação:', { rows });
    return (rows as any[]).length > 0;
  } catch (error) {
    logger.error('Erro ao verificar duplicação:', error);
    throw error;
  }
}

async function saveLead(senderId: string) {
  try {
    // Salva o lead na tabela principal
    await pool.query(
      'INSERT INTO page_540118319183094 (sender_id) VALUES (?)',
      [senderId]
    );
    logger.info('✅ Lead salvo na tabela principal');

    // Registra o lead na tabela de métricas
    await pool.query(
      'INSERT INTO metrics_540118319183094 (sender_id, type, template_id) VALUES (?, "lead", "lead_registration")',
      [senderId]
    );
    logger.info('📊 Lead registrado na tabela de métricas');
  } catch (error) {
    logger.error('❌ Erro ao salvar lead:', error);
    throw error;
  }
}

async function scheduleMessages(senderId: string) {
  try {
    // Envia primeira mensagem imediatamente
    logger.info('📤 Enviando primeira mensagem imediatamente...');
    await sendMessage(senderId, 'first');
    logger.info('✅ Primeira mensagem enviada com sucesso');

    // Agenda as outras mensagens
    const messages = [
      { delay: 300000, type: 'second' },  // 5 minutos
      { delay: 600000, type: 'third' },   // 10 minutos
      { delay: 900000, type: 'fourth' }   // 15 minutos
    ];

    for (const msg of messages) {
      const scheduledTime = Date.now() + msg.delay;
      await redis.zadd(
        'scheduled_messages',
        scheduledTime,
        JSON.stringify({
          senderId,
          messageType: msg.type,
          scheduledTime
        })
      );
      logger.info('⏰ Mensagem agendada:', { 
        senderId, 
        messageType: msg.type, 
        delay: msg.delay,
        scheduledTime: new Date(scheduledTime).toLocaleString()
      });
    }
  } catch (error) {
    logger.error('Erro ao agendar mensagens:', error);
    throw error;
  }
}
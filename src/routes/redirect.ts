import { FastifyInstance } from 'fastify';
import { redis } from '../lib/redis';
import { pool } from '../lib/mysql';
import { logger } from '../config/logger';

export async function redirectRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    try {
      const { target, button, sender, msg } = request.query as {
        target?: string;
        button?: string;
        sender?: string;
        msg?: string;
      };

      logger.info('📥 Recebida requisição de redirecionamento:', { target, button, sender, msg });

      if (!target || !button || !sender || !msg) {
        logger.error('❌ Parâmetros inválidos:', { target, button, sender, msg });
        return reply.status(400).send({ message: 'Parâmetros inválidos' });
      }

      // Registra o clique no Redis para análise em tempo real
      const clickData = JSON.stringify({
        sender,
        button,
        msg,
        target,
        timestamp: Date.now()
      });
      
      try {
        await redis.rpush('click_events', clickData);
        logger.info('📊 Clique registrado no Redis:', { clickData });
      } catch (error) {
        logger.error('❌ Erro ao registrar clique no Redis:', error);
        // Continua com o redirecionamento mesmo se falhar o registro
      }

      // Registra o clique no MariaDB para análise histórica
      try {
        await pool.query(`
          INSERT INTO metrics_540118319183094 
            (sender_id, type, template_id, message_text) 
          VALUES 
            (?, 'click', ?, ?)
        `, [sender, `${msg}_${button}`, target]);
        logger.info('💾 Clique registrado no MariaDB:', { sender, button, msg, target });
      } catch (error) {
        logger.error('❌ Erro ao registrar clique no MariaDB:', error);
        // Continua com o redirecionamento mesmo se falhar o registro
      }

      // Redireciona para o destino final
      logger.info(`🔄 Redirecionando para: ${target}`);
      return reply.redirect(target);
    } catch (error) {
      logger.error('❌ Erro no redirecionamento:', error);
      return reply.status(500).send({ message: 'Erro interno no servidor' });
    }
  });
}
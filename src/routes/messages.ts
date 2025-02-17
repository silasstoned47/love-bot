import { FastifyInstance } from 'fastify';
import { redis } from '../lib/redis';
import { pool } from '../lib/mysql';
import { logger } from '../config/logger';

export async function messageRoutes(app: FastifyInstance) {
  // Rota para consultar histórico de mensagens
  app.get('/:senderId', async (request, reply) => {
    const { senderId } = request.params as { senderId: string };

    try {
      const [rows] = await pool.query(
        'SELECT * FROM messages WHERE sender_id = ? ORDER BY created_at DESC',
        [senderId]
      );

      return reply.send({ messages: rows });
    } catch (error) {
      logger.error('Erro ao buscar mensagens:', error);
      return reply.status(500).send({ message: 'Erro interno' });
    }
  });

  // Rota para consultar métricas de engajamento
  app.get('/:senderId/metrics', async (request, reply) => {
    const { senderId } = request.params as { senderId: string };

    try {
      // Busca cliques do Redis
      const clicks = await redis.lrange(`clicks:${senderId}`, 0, -1);
      const clickData = clicks.map(click => JSON.parse(click));

      // Busca mensagens enviadas do MySQL
      const [messages] = await pool.query(
        'SELECT COUNT(*) as total FROM messages WHERE sender_id = ?',
        [senderId]
      );

      return reply.send({
        clicks: clickData,
        totalMessages: (messages as any[])[0].total
      });
    } catch (error) {
      logger.error('Erro ao buscar métricas:', error);
      return reply.status(500).send({ message: 'Erro interno' });
    }
  });
}
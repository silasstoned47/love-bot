import { config } from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { redis } from './lib/redis';
import { pool } from './lib/mysql';
import { logger } from './config/logger';
import { processMessage } from './services/messageProcessor';
import { env } from './config/env';

// Carrega variáveis de ambiente
config();

const server = Fastify({
  logger: true,
  bodyLimit: 10485760 // 10MB
});

// Adiciona CORS middleware
server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Webhook routes
server.get('/webhook', async (request, reply) => {
  const query = request.query as { 
    'hub.challenge': string, 
    'hub.verify_token': string 
  };
  const challenge = query['hub.challenge'];
  const verifyToken = query['hub.verify_token'];

  if (verifyToken === env.FACEBOOK_VERIFICATION_TOKEN) {
    return reply.send(challenge);
  }

  return reply.status(400).send({ message: 'Token inválido' });
});

server.post('/webhook', async (request, reply) => {
  const body = request.body as any;
  logger.info('Webhook recebido:', JSON.stringify(body, null, 2));

  if (body.object === 'page') {
    logger.info('Objeto do tipo page detectado');
    for (const entry of body.entry) {
      logger.info('Processando entry:', entry);
      for (const event of entry.messaging) {
        logger.info('Processando evento de mensagem:', event);
        await processMessage(event);
      }
    }
    return reply.status(200).send('EVENT_RECEIVED');
  }

  logger.warn('Evento não suportado:', body.object);
  return reply.status(404).send({ message: 'Evento não suportado' });
});

// Rota de teste
server.get('/ping', async () => {
  return { status: 'ok' };
});

// Rota para obter todas as mensagens
server.get('/messages/all', async () => {
  try {
    const [messages] = await pool.query(`
      SELECT 
        id,
        sender_id,
        timestamp as created_at
      FROM page_540118319183094 
      ORDER BY timestamp DESC
    `).catch(err => {
      console.error('Erro ao buscar mensagens:', err);
      throw new Error(`Erro ao buscar mensagens: ${err.message}`);
    });
    return messages;
  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error);
    throw new Error(`Erro ao buscar mensagens: ${error.message}`);
  }
});

// Rota para obter métricas
server.get('/messages/metrics/summary', async () => {
  try {
    // Limpa o cache para forçar recálculo
    await redis.del('metrics:summary');

    // Total de leads (usuários únicos)
    const [leadsResult] = await pool.query(`
      SELECT COUNT(DISTINCT sender_id) as total 
      FROM page_540118319183094
    `).catch(err => {
      logger.error('Erro ao contar leads:', err);
      throw new Error(`Erro ao contar leads: ${err.message}`);
    });
    
    // Total de mensagens enviadas usando templates
    const [messagesResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM metrics_540118319183094
      WHERE type = 'message' 
      AND template_id IS NOT NULL
    `).catch(err => {
      logger.error('Erro ao contar mensagens:', err);
      throw new Error(`Erro ao contar mensagens: ${err.message}`);
    });
    
    // Total de cliques
    const [clicksResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM metrics_540118319183094 
      WHERE type = 'click'
    `).catch(err => {
      logger.error('Erro ao contar cliques:', err);
      throw new Error(`Erro ao contar cliques: ${err.message}`);
    });
    
    // Extrai os valores dos resultados
    interface QueryResultRow {
      total: number;
    }
    
    const totalLeads = Number((leadsResult as QueryResultRow[])[0]?.total) || 0;
    const totalMessages = Number((messagesResult as QueryResultRow[])[0]?.total) || 0;
    const totalClicks = Number((clicksResult as QueryResultRow[])[0]?.total) || 0;
    
    // Calcula taxa de conversão (cliques / mensagens)
    const conversionRate = totalMessages > 0 ? 
      ((totalClicks / totalMessages) * 100).toFixed(2) : '0';

    const metrics = {
      totalLeads,
      messagesSent: totalMessages,
      linkClicks: totalClicks,
      conversionRate: `${conversionRate}%`
    };

    // Log para debug
    logger.info('Métricas calculadas:', metrics);

    return metrics;
  } catch (error: any) {
    logger.error('Erro ao calcular métricas:', error);
    throw error;
  }
});

// Rate limiting para cliques
async function getRateLimit(senderId: string): Promise<boolean> {
  const key = `ratelimit:clicks:${senderId}`;
  const limit = 10; // máximo de 10 cliques por minuto
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // expira em 1 minuto
  }
  
  return current <= limit;
}

// Rota de redirecionamento com rate limiting
server.get('/redirect', async (request, reply) => {
  try {
    const query = request.query as {
      target?: string;
      button?: string;
      sender?: string;
      msg?: string;
    };
    const { target, button, sender, msg } = query;

    if (!target || !button || !sender || !msg) {
      return reply.status(400).send({ message: 'Parâmetros inválidos' });
    }

    // Verifica rate limit
    const allowed = await getRateLimit(sender);
    if (!allowed) {
      logger.warn(`Rate limit excedido para usuário ${sender}`);
      return reply.status(429).send({ 
        message: 'Muitos cliques detectados. Tente novamente em alguns minutos.' 
      });
    }

    // Registra o clique no MariaDB
    try {
      await pool.query(`
        INSERT INTO metrics_540118319183094 
        (sender_id, type, target_url, button_text, message_text) 
        VALUES (?, 'click', ?, ?, ?)
      `, [sender, target, button, msg]);
      
      // Incrementa contador de cliques no Redis (para métricas em tempo real)
      await redis.incr('realtime:clicks:total');
      await redis.incr(`realtime:clicks:user:${sender}`);
      
      logger.info(`Clique registrado - Usuário: ${sender}, Botão: ${button}`);
    } catch (error) {
      logger.error('Erro ao registrar clique:', error);
      // Continua com o redirecionamento mesmo se falhar o registro
    }

    return reply.redirect(target);
  } catch (error) {
    logger.error('Erro no redirecionamento:', error);
    return reply.status(500).send({ message: 'Erro interno no servidor' });
  }
});

// Inicia o servidor
async function start() {
  try {
    await server.listen({ port: 5000, host: '0.0.0.0' });
    console.log(' Servidor rodando em http://localhost:5000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
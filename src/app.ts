import Fastify from 'fastify';
import { logger } from './config/logger';
import { redis } from './lib/redis';

export async function buildServer() {
  try {
    // Cria instância do Fastify
    logger.info('Criando instância do Fastify...');
    const app = Fastify({
      logger: true // Ativa o logger do Fastify
    });

    // Rota de teste
    app.get('/ping', async () => {
      return { status: 'ok' };
    });

    // Rota de redirecionamento
    app.get('/redirect', async (request, reply) => {
      try {
        const { target, button, sender, msg } = request.query as {
          target?: string;
          button?: string;
          sender?: string;
          msg?: string;
        };

        logger.info('Recebida requisição de redirecionamento:', { target, button, sender, msg });

        if (!target || !button || !sender || !msg) {
          logger.error('Parâmetros inválidos:', { target, button, sender, msg });
          return reply.status(400).send({ message: 'Parâmetros inválidos' });
        }

        // Registra o clique
        const clickData = JSON.stringify({
          sender,
          button,
          msg,
          timestamp: Date.now()
        });
        
        try {
          await redis.rpush('click_events', clickData);
          logger.info(`Clique registrado: ${clickData}`);
        } catch (error) {
          logger.error('Erro ao registrar clique no Redis:', error);
          // Continua com o redirecionamento mesmo se falhar o registro
        }

        // Redireciona para o destino final
        logger.info(`Redirecionando para: ${target}`);
        return reply.redirect(target);
      } catch (error) {
        logger.error('Erro no redirecionamento:', error);
        return reply.status(500).send({ message: 'Erro interno no servidor' });
      }
    });

    logger.info('Servidor configurado com sucesso');
    return app;
  } catch (error) {
    logger.error('Erro ao construir servidor:', error);
    throw error;
  }
}
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';
import { processMessage } from '../services/messageProcessor';

export async function webhookRoutes(app: FastifyInstance) {
  // Verificação do Webhook
  app.get('/', async (request, reply) => {
    const challenge = request.query['hub.challenge'];
    const verifyToken = request.query['hub.verify_token'];

    if (verifyToken === env.FACEBOOK_VERIFICATION_TOKEN) {
      return reply.send(challenge);
    }

    return reply.status(400).send({ message: 'Token inválido' });
  });

  // Recebimento de mensagens
  app.post('/', async (request, reply) => {
    const body = request.body as any;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const event of entry.messaging) {
          await processMessage(event);
        }
      }
      return reply.status(200).send('EVENT_RECEIVED');
    }

    return reply.status(404).send({ message: 'Evento não suportado' });
  });
}
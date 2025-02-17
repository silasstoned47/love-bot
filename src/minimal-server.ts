import Fastify from 'fastify';

const server = Fastify({
  logger: true
});

// Rota de teste
server.get('/ping', async () => {
  return { status: 'ok' };
});

// Rota de redirecionamento
server.get('/redirect', async (request, reply) => {
  const { target } = request.query as { target?: string };
  
  if (!target) {
    return reply.status(400).send({ message: 'Target URL is required' });
  }
  
  return reply.redirect(target);
});

// Inicia o servidor
const start = async () => {
  try {
    await server.listen({ port: 80, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

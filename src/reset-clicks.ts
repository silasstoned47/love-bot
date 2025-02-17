import { redis } from './lib/redis';

async function resetClicks() {
  try {
    await redis.del('click_events');
    console.log('Lista de cliques limpa com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao limpar cliques:', error);
    process.exit(1);
  }
}

resetClicks();

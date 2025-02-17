import { redis } from './lib/redis';

async function checkClicks() {
  try {
    // Busca todos os cliques
    const clicks = await redis.lrange('click_events', 0, -1);
    
    console.log('=== Relatório de Cliques ===');
    console.log(`Total de cliques: ${clicks.length}`);
    console.log('');
    
    // Mostra os cliques
    clicks.forEach((click, index) => {
      const clickData = JSON.parse(click);
      console.log(`Clique ${index + 1}:`);
      console.log('- Usuário:', clickData.sender);
      console.log('- Botão:', clickData.button);
      console.log('- Mensagem:', clickData.msg);
      console.log('- Timestamp:', new Date(clickData.timestamp).toLocaleString());
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao buscar cliques:', error);
    process.exit(1);
  }
}

checkClicks();

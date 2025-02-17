import { redis } from './lib/redis';
import { pool } from './lib/mysql';

async function checkMetrics() {
  try {
    console.log('=== Relatório de Métricas ===\n');

    // 1. Total de Leads (MySQL)
    const [leads] = await pool.query('SELECT COUNT(*) as total FROM leads');
    console.log('Total de Leads:', leads[0].total);

    // 2. Mensagens Enviadas (MySQL)
    const [messages] = await pool.query('SELECT COUNT(*) as total FROM messages');
    console.log('Mensagens Enviadas:', messages[0].total);

    // 3. Cliques em Links (Redis)
    const clicks = await redis.lrange('click_events', 0, -1);
    console.log('Cliques em Links:', clicks.length);

    // 4. Taxa de Conversão
    const conversionRate = leads[0].total > 0 ? 
      ((leads[0].total / messages[0].total) * 100).toFixed(2) : 0;
    console.log('Taxa de Conversão:', `${conversionRate}%`);

    // Detalhes adicionais
    console.log('\n=== Detalhes ===');
    
    // Últimos leads
    const [recentLeads] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5');
    console.log('\nÚltimos Leads:');
    recentLeads.forEach((lead: any) => {
      console.log(`- ID: ${lead.id}, Data: ${new Date(lead.created_at).toLocaleString()}`);
    });

    // Últimas mensagens
    const [recentMessages] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 5');
    console.log('\nÚltimas Mensagens:');
    recentMessages.forEach((msg: any) => {
      console.log(`- ID: ${msg.id}, Tipo: ${msg.type}, Data: ${new Date(msg.created_at).toLocaleString()}`);
    });

    // Últimos cliques
    console.log('\nÚltimos Cliques:');
    clicks.slice(-5).forEach((click) => {
      const data = JSON.parse(click);
      console.log(`- Usuário: ${data.sender}, Botão: ${data.button}, Data: ${new Date(data.timestamp).toLocaleString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    process.exit(1);
  }
}

checkMetrics();

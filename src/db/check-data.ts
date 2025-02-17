import { pool } from '../lib/mysql';

async function checkData() {
  try {
    // 1. Verifica mensagens na tabela page
    console.log('\n📨 Mensagens na tabela page_540118319183094:');
    const [messages] = await pool.query(`
      SELECT COUNT(*) as total, 
             COUNT(DISTINCT sender_id) as unique_senders,
             MIN(timestamp) as first_message,
             MAX(timestamp) as last_message
      FROM page_540118319183094
    `);
    console.log(JSON.stringify(messages, null, 2));

    // 2. Verifica cliques na tabela metrics
    console.log('\n🖱️ Cliques na tabela metrics_540118319183094:');
    const [clicks] = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(DISTINCT sender_id) as unique_clickers,
             MIN(timestamp) as first_click,
             MAX(timestamp) as last_click
      FROM metrics_540118319183094
      WHERE type = 'click'
    `);
    console.log(JSON.stringify(clicks, null, 2));

    // 3. Mostra alguns exemplos de cada tabela
    console.log('\n📝 Exemplo de mensagens:');
    const [messageExamples] = await pool.query(`
      SELECT * FROM page_540118319183094 
      ORDER BY timestamp DESC LIMIT 3
    `);
    console.log(JSON.stringify(messageExamples, null, 2));

    console.log('\n🎯 Exemplo de cliques:');
    const [clickExamples] = await pool.query(`
      SELECT * FROM metrics_540118319183094 
      WHERE type = 'click'
      ORDER BY timestamp DESC LIMIT 3
    `);
    console.log(JSON.stringify(clickExamples, null, 2));

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao verificar dados:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

checkData();

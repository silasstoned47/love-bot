import { pool } from '../lib/mysql';
import { redis } from '../lib/redis';

async function migrateClicks() {
  try {
    console.log('🔄 Migrando cliques do Redis para o MariaDB...');

    // Busca todos os cliques do Redis
    const clicks = await redis.lrange('click_events', 0, -1);
    console.log(`📊 Total de cliques encontrados no Redis: ${clicks.length}`);

    // Migra cada clique
    for (const clickJson of clicks) {
      const click = JSON.parse(clickJson);
      await pool.query(`
        INSERT INTO metrics_540118319183094 
        (sender_id, type, button_text, message_text, timestamp) 
        VALUES (?, 'click', ?, ?, ?)
      `, [click.sender, click.button, click.msg, new Date(click.timestamp)]);
    }

    console.log('✅ Migração concluída com sucesso!');

    // Limpa os cliques do Redis
    if (clicks.length > 0) {
      await redis.del('click_events');
      console.log('🗑️ Dados antigos removidos do Redis');
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao migrar cliques:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

migrateClicks();

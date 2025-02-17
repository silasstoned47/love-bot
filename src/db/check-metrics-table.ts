import { pool } from '../lib/mysql';
import { logger } from '../config/logger';

const TABLE_NAME = 'metrics_540118319183094';

async function checkMetricsTable() {
  try {
    console.log('\n Verificando tabela metrics_540118319183094:');
    
    // Verifica se a tabela existe
    const [tables] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = ?
    `, [TABLE_NAME]);

    if (Array.isArray(tables) && tables.length === 0) {
      logger.info(`Criando tabela ${TABLE_NAME}...`);
      
      // Cria a tabela se não existir
      await pool.query(`
        CREATE TABLE ${TABLE_NAME} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sender_id VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          template_id VARCHAR(50),
          message_text TEXT,
          facebook_message_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      logger.info('✅ Tabela criada com sucesso!');
    } else {
      // Verifica estrutura da tabela
      const [columns] = await pool.query(`
        SHOW COLUMNS FROM ${TABLE_NAME}
      `);
      console.log('\nEstrutura da tabela:');
      console.log(columns);

      // Verifica se o campo facebook_message_id existe
      const [facebookMessageIdColumn] = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = DATABASE() 
        AND table_name = ? 
        AND column_name = 'facebook_message_id'
      `, [TABLE_NAME]);

      if (Array.isArray(facebookMessageIdColumn) && facebookMessageIdColumn.length === 0) {
        logger.info('Adicionando coluna facebook_message_id...');
        
        // Adiciona o campo se não existir
        await pool.query(`
          ALTER TABLE ${TABLE_NAME}
          ADD COLUMN facebook_message_id VARCHAR(255)
        `);
        
        logger.info('✅ Coluna adicionada com sucesso!');
      }

      // Conta registros por tipo
      const [types] = await pool.query(`
        SELECT type, COUNT(*) as count
        FROM ${TABLE_NAME}
        GROUP BY type
      `);
      console.log('\nContagem por tipo:');
      console.log(types);

      // Mostra últimos 5 registros
      const [latest] = await pool.query(`
        SELECT * FROM ${TABLE_NAME}
        ORDER BY created_at DESC
        LIMIT 5
      `);
      console.log('\nÚltimos registros:');
      console.log(latest);
    }

    logger.info('✅ Verificação da tabela de métricas concluída!');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Erro ao verificar tabela:', error);
    process.exit(1);
  }
}

checkMetricsTable();

import { pool } from '../lib/mysql';

async function createMetricsTable() {
  try {
    // Cria tabela de métricas
    console.log('Criando tabela de métricas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS metrics_540118319183094 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        type ENUM('click', 'message', 'lead') NOT NULL,
        target_url TEXT,
        button_text VARCHAR(255),
        message_text TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sender_type (sender_id, type),
        INDEX idx_timestamp (timestamp)
      )
    `);
    console.log('✅ Tabela de métricas criada com sucesso!');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao criar tabela:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

createMetricsTable();

import { pool } from '../lib/mysql';

async function setup() {
  try {
    console.log('🔧 Configurando banco de dados...');

    // Recria tabela de mensagens
    console.log('\n📱 Recriando tabela page_540118319183094...');
    await pool.query('DROP TABLE IF EXISTS page_540118319183094');
    await pool.query(`
      CREATE TABLE page_540118319183094 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sender (sender_id),
        INDEX idx_timestamp (timestamp)
      )
    `);

    // Recria tabela de métricas
    console.log('\n📈 Recriando tabela metrics_540118319183094...');
    await pool.query('DROP TABLE IF EXISTS metrics_540118319183094');
    await pool.query(`
      CREATE TABLE metrics_540118319183094 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        type ENUM('click', 'message', 'lead') NOT NULL,
        template_id VARCHAR(50),
        target_url TEXT,
        button_text VARCHAR(255),
        message_text TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sender_type (sender_id, type),
        INDEX idx_timestamp (timestamp),
        INDEX idx_template (template_id)
      )
    `);

    // Insere alguns dados de exemplo na tabela page
    console.log('\n📝 Inserindo dados de exemplo na tabela page...');
    await pool.query(`
      INSERT INTO page_540118319183094 (sender_id, timestamp)
      VALUES 
        ('user1', NOW()),
        ('user2', NOW()),
        ('user3', NOW()),
        ('user4', NOW()),
        ('user5', NOW())
    `);

    // Insere alguns dados de exemplo na tabela metrics
    console.log('\n🎯 Inserindo dados de exemplo na tabela metrics...');
    await pool.query(`
      INSERT INTO metrics_540118319183094 
        (sender_id, type, template_id, target_url, button_text, message_text, timestamp)
      VALUES 
        ('user1', 'message', 'first', NULL, NULL, 'Template First Message', NOW()),
        ('user2', 'message', 'second', NULL, NULL, 'Template Second Message', NOW()),
        ('user3', 'message', 'third', NULL, NULL, 'Template Third Message', NOW()),
        ('user1', 'click', NULL, 'https://example.com/1', 'Saiba Mais', 'Clique aqui', NOW()),
        ('user2', 'click', NULL, 'https://example.com/2', 'Ver Detalhes', 'Veja mais', NOW())
    `);

    console.log('\n✅ Banco de dados configurado com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

setup();

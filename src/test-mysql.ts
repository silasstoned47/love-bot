import mysql from 'mysql2/promise';

async function testConnection() {
  const connection = await mysql.createConnection({
    host: '34.171.147.193',
    port: 1694,
    user: 'mariadb',
    password: 'cfd527e8ff520b0cf404',
    database: 'social_db_meta'
  });

  try {
    console.log('Tentando conectar...');
    await connection.query('SELECT 1');
    console.log('✅ Conexão bem sucedida!');

    // Tenta criar as tabelas
    console.log('Criando tabela leads...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Criando tabela messages...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        recipient_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

testConnection();

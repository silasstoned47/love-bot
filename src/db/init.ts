import { pool } from '../lib/mysql';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initDatabase() {
  try {
    // Testa a conexão primeiro
    await pool.query('SELECT 1').catch(err => {
      console.error('❌ Erro ao conectar ao banco:', err);
      throw err;
    });
    console.log('✅ Conexão com o banco estabelecida');

    // Lê o arquivo SQL
    const sqlPath = join(__dirname, 'init.sql');
    console.log('📂 Lendo arquivo:', sqlPath);
    const sql = readFileSync(sqlPath, 'utf8');
    console.log('📝 Conteúdo SQL:', sql);

    // Separa as queries
    const queries = sql.split(';').filter(query => query.trim());
    console.log(`🔍 Encontradas ${queries.length} queries para executar`);

    // Executa cada query separadamente
    for (const query of queries) {
      if (query.trim()) {
        console.log('⚡ Executando query:', query.trim());
        await pool.query(query).catch(err => {
          console.error('❌ Erro ao executar query:', err);
          throw err;
        });
        console.log('✅ Query executada com sucesso');
      }
    }

    console.log('✅ Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro detalhado ao inicializar banco de dados:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

initDatabase();

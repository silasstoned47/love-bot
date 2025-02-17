import { pool } from '../lib/mysql';

async function analyzeTable() {
  try {
    // 1. Verificar estrutura da tabela
    console.log('\n📊 Estrutura da tabela:');
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM page_540118319183094
    `);
    console.log(columns);

    // 2. Mostrar primeiras 10 linhas
    console.log('\n📝 Primeiras 10 linhas:');
    const [rows] = await pool.query(`
      SELECT * FROM page_540118319183094 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    console.log(JSON.stringify(rows, null, 2));

    // 3. Contagem total de registros
    const [count] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM page_540118319183094
    `);
    console.log('\n📈 Total de registros:', (count as any)[0].total);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao analisar tabela:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

analyzeTable();

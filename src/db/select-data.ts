import { pool } from '../lib/mysql';

async function selectData() {
  try {
    // Seleciona os dados
    console.log('\n📝 Dados da tabela:');
    const [rows] = await pool.query(`
      SELECT * FROM page_540118319183094
    `);
    console.log(JSON.stringify(rows, null, 2));

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao selecionar dados:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

selectData();

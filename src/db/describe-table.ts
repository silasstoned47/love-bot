import { pool } from '../lib/mysql';

async function describeTable() {
  try {
    // Descreve a estrutura da tabela
    console.log('\n📊 Estrutura da tabela:');
    const [description] = await pool.query(`
      DESCRIBE page_540118319183094
    `);
    console.log(JSON.stringify(description, null, 2));

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao descrever tabela:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

describeTable();

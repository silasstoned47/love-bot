import { pool } from '../lib/mysql';

async function checkTables() {
  try {
    // Lista todas as tabelas
    console.log('\n📊 Tabelas no banco:');
    const [tables] = await pool.query(`SHOW TABLES`);
    console.log(tables);

    // Verifica estrutura da tabela page
    console.log('\n📱 Estrutura da tabela page_540118319183094:');
    const [pageColumns] = await pool.query(`
      SHOW COLUMNS FROM page_540118319183094
    `);
    console.log(pageColumns);

    // Verifica estrutura da tabela metrics
    console.log('\n📈 Estrutura da tabela metrics_540118319183094:');
    const [metricsColumns] = await pool.query(`
      SHOW COLUMNS FROM metrics_540118319183094
    `);
    console.log(metricsColumns);

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

checkTables();

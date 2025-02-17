import { pool } from '../lib/mysql';

async function showTables() {
  try {
    // Lista todas as tabelas
    console.log('\n📊 Tabelas no banco:');
    const [tables] = await pool.query(`SHOW TABLES`);
    console.log(tables);

    // Mostra dados da tabela page
    console.log('\n📱 Dados da tabela page_540118319183094:');
    const [pageData] = await pool.query(`SELECT * FROM page_540118319183094`);
    console.log(pageData);

    // Mostra dados da tabela metrics
    console.log('\n📈 Dados da tabela metrics_540118319183094:');
    const [metricsData] = await pool.query(`SELECT * FROM metrics_540118319183094`);
    console.log(metricsData);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

showTables();

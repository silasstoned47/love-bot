import { pool } from '../lib/mysql';

async function testMetrics() {
  try {
    // Testa query de cliques
    console.log('\n🔍 Testando query de cliques:');
    const [clicksResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM metrics_540118319183094 
      WHERE type = 'click'
    `);
    console.log('Resultado da query de cliques:', clicksResult);

    // Verifica dados na tabela
    console.log('\n📊 Dados na tabela metrics_540118319183094:');
    const [allMetrics] = await pool.query(`
      SELECT * FROM metrics_540118319183094
    `);
    console.log('Todos os registros:', allMetrics);

    // Conta por tipo
    console.log('\n📈 Contagem por tipo:');
    const [typeCount] = await pool.query(`
      SELECT type, COUNT(*) as count
      FROM metrics_540118319183094
      GROUP BY type
    `);
    console.log('Contagem por tipo:', typeCount);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

testMetrics();

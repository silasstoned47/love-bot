import { pool } from '../lib/mysql';

async function seedDatabase() {
  try {
    // Insere alguns leads de teste
    console.log('Inserindo leads...');
    await pool.query(
      'INSERT INTO leads (sender_id, name, email, phone) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
      ['123', 'João Silva', 'joao@email.com', '11999999999', '456', 'Maria Santos', 'maria@email.com', '11988888888']
    );
    console.log('✅ Leads inseridos');

    // Insere algumas mensagens de teste
    console.log('Inserindo mensagens...');
    await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, type, content) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
      [
        '123', 'page', 'text', 'Olá, gostaria de mais informações',
        '123', 'page', 'text', 'Sobre os preços',
        '456', 'page', 'text', 'Bom dia, podem me ajudar?',
        '456', 'page', 'text', 'Quero fazer um orçamento'
      ]
    );
    console.log('✅ Mensagens inseridas');

    console.log('✅ Dados de teste inseridos com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao inserir dados de teste:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    process.exit(1);
  }
}

seedDatabase();

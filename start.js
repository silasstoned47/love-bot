import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para iniciar um processo
function startProcess(name, command, args) {
  console.log(`🚀 Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  process.on('exit', (code) => {
    console.log(`❌ ${name} parou com código ${code}. Reiniciando...`);
    startProcess(name, command, args);
  });

  return process;
}

// Inicia o servidor
startProcess(
  'Servidor',
  'npx',
  ['tsx', 'src/server.ts']
);

// Inicia o worker de mensagens
startProcess(
  'Worker de Mensagens',
  'npx',
  ['tsx', 'src/workers/messageScheduler.ts']
);

console.log('✅ Sistema iniciado! Pressione Ctrl+C para parar todos os processos.');

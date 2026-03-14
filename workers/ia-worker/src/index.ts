import { processarGlicemia } from './glicemia.js';
import { processarRefeicao } from './refeicao.js';
import { encerrar } from './infra.js';

async function iniciar() {
  const [tipo, id] = process.argv.slice(2);
  if (!tipo || !id) {
    console.log('Uso: node dist/index.js <glicemia|refeicao> <id>');
    return;
  }
  if (tipo === 'glicemia') {
    await processarGlicemia(id);
    await encerrar();
    return;
  }
  if (tipo === 'refeicao') {
    await processarRefeicao(id);
    await encerrar();
    return;
  }
  console.log('Tipo inválido. Use glicemia ou refeicao.');
}

iniciar().catch((erro) => {
  console.log('Erro ao iniciar worker.', erro);
});

import { redis } from '../../../infra/redis.js';

type JobIA =
  | { tipo: 'glicemia'; id: string; criadoEm: string }
  | { tipo: 'refeicao'; id: string; criadoEm: string }
  | { tipo: 'glicemia_foto'; pacienteId: string; mediaId: string; criadoEm: string }
  | { tipo: 'classificar_imagem'; pacienteId: string; mediaId: string; criadoEm: string };

const chaveFila = 'ia_fila';

async function enfileirarJob(job: JobIA) {
  try {
    await redis.rpush(chaveFila, JSON.stringify(job));
    console.log('[GLUCO:IA_FILA]', { acao: 'job_enfileirado', tipo: job.tipo, payload: job });
    return true;
  } catch (erro) {
    console.log('[GLUCO:IA_FILA]', { acao: 'erro_enfileirar', erro: (erro as Error).message });
    return false;
  }
}

async function enfileirarAnaliseGlicemia(glicemiaId: string) {
  return enfileirarJob({ tipo: 'glicemia', id: glicemiaId, criadoEm: new Date().toISOString() });
}

async function enfileirarAnaliseRefeicao(refeicaoId: string) {
  return enfileirarJob({ tipo: 'refeicao', id: refeicaoId, criadoEm: new Date().toISOString() });
}

async function enfileirarAnaliseGlicemiaFoto(pacienteId: string, mediaId: string) {
  return enfileirarJob({
    tipo: 'glicemia_foto',
    pacienteId,
    mediaId,
    criadoEm: new Date().toISOString(),
  });
}

async function enfileirarClassificacaoImagem(pacienteId: string, mediaId: string) {
  return enfileirarJob({
    tipo: 'classificar_imagem',
    pacienteId,
    mediaId,
    criadoEm: new Date().toISOString(),
  });
}

export {
  enfileirarAnaliseGlicemia,
  enfileirarAnaliseRefeicao,
  enfileirarAnaliseGlicemiaFoto,
  enfileirarClassificacaoImagem,
};

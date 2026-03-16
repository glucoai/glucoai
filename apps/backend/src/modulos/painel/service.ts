import { redis } from '../../infra/redis.js';
import { obterAlertasCriticos, obterEstatisticasPainel, obterSerieGlicemia30Dias } from './repository.js';
import type { PainelAlerta, PainelEstatisticas, PainelSerieGlicemia } from './types.js';

const tempoCacheSegundos = 60 * 5;

function chaveCache(clinicaId: string) {
  return `painel:estatisticas:${clinicaId}`;
}

async function buscarEstatisticasPainel(clinicaId: string): Promise<PainelEstatisticas> {
  const chave = chaveCache(clinicaId);
  const cache = await redis.get(chave);
  if (cache) {
    return JSON.parse(cache) as PainelEstatisticas;
  }
  const dados = await obterEstatisticasPainel(clinicaId);
  await redis.set(chave, JSON.stringify(dados), 'EX', tempoCacheSegundos);
  return dados;
}

async function buscarAlertasCriticos(clinicaId: string): Promise<PainelAlerta[]> {
  return obterAlertasCriticos(clinicaId);
}

async function buscarSerieGlicemia(clinicaId: string): Promise<PainelSerieGlicemia[]> {
  return obterSerieGlicemia30Dias(clinicaId);
}

export { buscarAlertasCriticos, buscarEstatisticasPainel, buscarSerieGlicemia };

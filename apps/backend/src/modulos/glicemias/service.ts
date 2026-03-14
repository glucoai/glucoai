import { classificarGlicemia } from '../../utils/classificarGlicemia';
import type { GlicemiaPayload, GlicemiaQuery } from './types';
import {
  obterPacienteAtivo,
  listarGlicemias,
  criarGlicemia,
  buscarEstatisticas,
} from './repository';

async function validarPaciente(clinicaId: string, pacienteId: string) {
  return obterPacienteAtivo(clinicaId, pacienteId);
}

async function listarGlicemiasService(pacienteId: string, filtros: GlicemiaQuery) {
  const registros = await listarGlicemias(pacienteId, filtros);
  return registros.map((registro) => ({
    ...registro,
    classificacao: classificarGlicemia(registro.valor),
  }));
}

async function criarGlicemiaService(pacienteId: string, payload: GlicemiaPayload) {
  const registro = await criarGlicemia(pacienteId, payload);
  return {
    ...registro,
    classificacao: classificarGlicemia(registro.valor),
  };
}

async function obterEstatisticasService(pacienteId: string, filtros: GlicemiaQuery) {
  const { agregado, registros } = await buscarEstatisticas(pacienteId, filtros);
  const contagem = {
    BAIXA: 0,
    NORMAL: 0,
    ELEVADA: 0,
    CRITICA: 0,
  };
  registros.forEach((registro) => {
    const { status } = classificarGlicemia(registro.valor);
    contagem[status] += 1;
  });

  return {
    total: agregado._count._all,
    media: agregado._avg.valor ?? 0,
    minimo: agregado._min.valor ?? 0,
    maximo: agregado._max.valor ?? 0,
    ultima: registros[0] ?? null,
    porStatus: contagem,
  };
}

export {
  validarPaciente,
  listarGlicemiasService,
  criarGlicemiaService,
  obterEstatisticasService,
};

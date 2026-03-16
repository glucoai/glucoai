import { prisma } from '../../infra/prisma.js';
import type { GlicemiaPayload, GlicemiaQuery } from './types.js';

async function obterPacienteAtivo(clinicaId: string, pacienteId: string) {
  return prisma.paciente.findFirst({
    where: { id: pacienteId, clinicaId, ativo: true },
    select: { id: true, metaGlicemicaMin: true, metaGlicemicaMax: true },
  });
}

async function listarGlicemias(pacienteId: string, filtros: GlicemiaQuery) {
  const { de, ate, limite } = filtros;
  return prisma.glicemia.findMany({
    where: {
      pacienteId,
      ...(de || ate
        ? {
            registradoEm: {
              ...(de ? { gte: de } : {}),
              ...(ate ? { lte: ate } : {}),
            },
          }
        : {}),
    },
    orderBy: { registradoEm: 'desc' },
    take: limite,
    select: {
      id: true,
      valor: true,
      unidade: true,
      contexto: true,
      origem: true,
      notas: true,
      registradoEm: true,
    },
  });
}

async function criarGlicemia(pacienteId: string, payload: GlicemiaPayload) {
  return prisma.glicemia.create({
    data: {
      pacienteId,
      valor: payload.valor,
      unidade: payload.unidade,
      contexto: payload.contexto,
      origem: payload.origem,
      notas: payload.notas ?? undefined,
    },
  });
}

async function buscarEstatisticas(pacienteId: string, filtros: GlicemiaQuery) {
  const { de, ate } = filtros;
  const where = {
    pacienteId,
    ...(de || ate
      ? {
          registradoEm: {
            ...(de ? { gte: de } : {}),
            ...(ate ? { lte: ate } : {}),
          },
        }
      : {}),
  };

  const [agregado, registros] = await Promise.all([
    prisma.glicemia.aggregate({
      where,
      _avg: { valor: true },
      _min: { valor: true },
      _max: { valor: true },
      _count: { _all: true },
    }),
    prisma.glicemia.findMany({
      where,
      orderBy: { registradoEm: 'desc' },
      take: 30,
      select: { valor: true, registradoEm: true },
    }),
  ]);

  return { agregado, registros };
}

export { obterPacienteAtivo, listarGlicemias, criarGlicemia, buscarEstatisticas };

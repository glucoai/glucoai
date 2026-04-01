import { Prisma } from '@prisma/client';
import { prisma } from '../../infra/prisma.js';
import type { PacientePayload, PacienteQuery } from './types.js';

async function listarPacientes(clinicaId: string, filtros: PacienteQuery) {
  const { busca, tipo, pagina, limite } = filtros;
  const where = {
    clinicaId,
    ativo: true,
    ...(tipo ? { tipoDiabetes: tipo } : {}),
    ...(busca
      ? {
          OR: [
            { nome: { contains: busca, mode: Prisma.QueryMode.insensitive } },
            { telefone: { contains: busca } },
          ],
        }
      : {}),
  };

  const selectPacientes = {
    id: true,
    nome: true,
    telefone: true,
    tipoDiabetes: true,
    ativo: true,
    criadoEm: true,
    metaGlicemicaMin: true,
    metaGlicemicaMax: true,
    scoreTotal: true,
    scoreNivel: true,
    scoreAtualizadoEm: true,
    glicemias: {
      orderBy: { registradoEm: 'desc' },
      take: 7,
      select: {
        valor: true,
        registradoEm: true,
      },
    },
  } as unknown as Prisma.PacienteSelect;

  const [total, dados] = await Promise.all([
    prisma.paciente.count({ where }),
    prisma.paciente.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      skip: (pagina - 1) * limite,
      take: limite,
      select: selectPacientes,
    }),
  ]);

  return { total, dados };
}

async function buscarPacienteDetalhe(clinicaId: string, id: string) {
  return prisma.paciente.findFirst({
    where: { id, clinicaId, ativo: true },
    include: {
      glicemias: { orderBy: { registradoEm: 'desc' }, take: 1 },
      refeicoes: { orderBy: { criadoEm: 'desc' }, take: 1 },
    },
  });
}

async function criarPaciente(clinicaId: string, payload: PacientePayload) {
  return prisma.paciente.create({
    data: {
      clinicaId,
      ...payload,
      dataNascimento: payload.dataNascimento ?? undefined,
    },
  });
}

async function atualizarPaciente(clinicaId: string, id: string, payload: Partial<PacientePayload>) {
  const existente = await prisma.paciente.findFirst({
    where: { id, clinicaId, ativo: true },
    select: { id: true },
  });
  if (!existente) {
    return null;
  }
  return prisma.paciente.update({
    where: { id },
    data: {
      ...payload,
      dataNascimento: payload.dataNascimento ?? undefined,
    },
  });
}

async function desativarPaciente(clinicaId: string, id: string) {
  const existente = await prisma.paciente.findFirst({
    where: { id, clinicaId, ativo: true },
    select: { id: true },
  });
  if (!existente) {
    return null;
  }
  return prisma.paciente.update({
    where: { id },
    data: { ativo: false },
  });
}

async function obterPacienteAtivoComClinica(clinicaId: string, pacienteId: string) {
  return prisma.paciente.findFirst({
    where: { id: pacienteId, clinicaId, ativo: true },
    select: {
      id: true,
      nome: true,
      telefone: true,
      tipoDiabetes: true,
      metaGlicemicaMin: true,
      metaGlicemicaMax: true,
      clinica: { select: { nome: true } },
    },
  });
}

async function listarMensagens(pacienteId: string, pagina: number, limite: number) {
  const [total, dados] = await Promise.all([
    prisma.mensagem.count({ where: { pacienteId } }),
    prisma.mensagem.findMany({
      where: { pacienteId },
      orderBy: { criadoEm: 'desc' },
      skip: (pagina - 1) * limite,
      take: limite,
      select: {
        id: true,
        conteudo: true,
        remetente: true,
        tipo: true,
        criadoEm: true,
      },
    }),
  ]);
  return { total, dados };
}

async function criarMensagemProfissional(pacienteId: string, conteudo: string) {
  return prisma.mensagem.create({
    data: {
      pacienteId,
      conteudo,
      remetente: 'PROFISSIONAL',
      tipo: 'TEXTO',
    },
  });
}

async function listarGlicemiasPeriodo(pacienteId: string, inicio: Date, fim: Date) {
  return prisma.glicemia.findMany({
    where: { pacienteId, registradoEm: { gte: inicio, lte: fim } },
    orderBy: { registradoEm: 'asc' },
    select: {
      valor: true,
      registradoEm: true,
    },
  });
}

export {
  listarPacientes,
  buscarPacienteDetalhe,
  criarPaciente,
  atualizarPaciente,
  desativarPaciente,
  obterPacienteAtivoComClinica,
  listarMensagens,
  criarMensagemProfissional,
  listarGlicemiasPeriodo,
};

import { Prisma } from '@prisma/client';
import { prisma } from '../../infra/prisma.js';

const prismaExtendido = prisma as typeof prisma & {
  configuracaoWhatsapp: {
    create: (args: { data: ConfiguracaoCriar }) => Promise<unknown>;
    findFirst: (args: {
      where: { clinicaId?: string; idNumero?: string };
      orderBy: { criadoEm: 'desc' };
    }) => Promise<unknown>;
    deleteMany: (args: { where: { clinicaId: string; id: string } }) => Promise<{ count: number }>;
  };
};

type MensagemCriar = {
  pacienteId: string;
  conteudo: string;
  remetente: 'PACIENTE' | 'SISTEMA' | 'IA' | 'PROFISSIONAL';
  tipo: 'TEXTO' | 'IMAGEM' | 'TEMPLATE';
};

type ConfiguracaoCriar = {
  clinicaId: string;
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  tokenVerificacao: string;
  webhookUrl: string;
  ativo: boolean;
};

type ConfiguracaoWhatsapp = {
  id: string;
  clinicaId: string;
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  tokenVerificacao: string;
  webhookUrl: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
};

type CriarPacienteWhatsapp = {
  clinicaId: string;
  telefone: string;
  nome: string;
  tipoDiabetes: 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL' | 'PRE';
};

async function buscarPacientePorTelefone(telefone: string) {
  const normalizado = telefone.replace(/\D/g, '');
  const candidatos = new Set<string>();
  if (normalizado) {
    candidatos.add(normalizado);
    if (normalizado.startsWith('55') && normalizado.length > 10) {
      candidatos.add(normalizado.slice(2));
    }
    if (normalizado.length >= 10) {
      candidatos.add(normalizado.slice(-10));
    }
    if (normalizado.length >= 9) {
      candidatos.add(normalizado.slice(-9));
    }
    if (normalizado.length >= 8) {
      candidatos.add(normalizado.slice(-8));
    }
  }
  const filtros = Array.from(candidatos).map((valor) => ({
    telefone: { contains: valor },
  }));
  return prisma.paciente.findFirst({
    where: {
      ativo: true,
      ...(filtros.length ? { OR: filtros } : { telefone: { contains: telefone } }),
    },
  });
}

async function salvarMensagem(payload: MensagemCriar) {
  return prisma.mensagem.create({ data: payload });
}

async function criarGlicemia(pacienteId: string, valor: number) {
  return prisma.glicemia.create({
    data: {
      pacienteId,
      valor,
      unidade: 'MG_DL',
      contexto: 'OUTRO',
      origem: 'WHATSAPP',
    },
  });
}

async function buscarUltimasGlicemias(pacienteId: string, limite: number) {
  return prisma.glicemia.findMany({
    where: { pacienteId },
    orderBy: { registradoEm: 'desc' },
    take: limite,
  });
}

async function criarConfiguracaoWhatsapp(payload: ConfiguracaoCriar) {
  return prismaExtendido.configuracaoWhatsapp.create({ data: payload }) as Promise<ConfiguracaoWhatsapp>;
}

async function buscarConfiguracaoWhatsappPorClinica(clinicaId: string) {
  return prismaExtendido.configuracaoWhatsapp.findFirst({
    where: { clinicaId },
    orderBy: { criadoEm: 'desc' },
  }) as Promise<ConfiguracaoWhatsapp | null>;
}

async function buscarConfiguracaoWhatsappPorIdNumero(idNumero: string) {
  return prismaExtendido.configuracaoWhatsapp.findFirst({
    where: { idNumero },
    orderBy: { criadoEm: 'desc' },
  }) as Promise<ConfiguracaoWhatsapp | null>;
}

async function excluirConfiguracaoWhatsapp(clinicaId: string, id: string) {
  return prismaExtendido.configuracaoWhatsapp.deleteMany({
    where: { clinicaId, id },
  });
}

async function buscarPacientePorId(pacienteId: string) {
  return prisma.paciente.findUnique({
    where: { id: pacienteId },
  }) as Promise<{ onboardingDados?: unknown } | null>;
}

async function desativarPacienteWhatsapp(pacienteId: string) {
  return prisma.paciente.update({
    where: { id: pacienteId },
    data: { ativo: false },
  });
}

async function atualizarPacienteOnboarding(
  pacienteId: string,
  dados: {
    nome?: string;
    email?: string | null;
    genero?: string | null;
    tipoDiabetes?: 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL' | 'PRE';
    dataNascimento?: Date | null;
    idade?: number | null;
    alturaCm?: number | null;
    pesoKg?: number | null;
    ultimaGlicemia?: number | null;
    sintomasComplicacoes?: boolean | null;
    termosAceitos?: boolean;
    onboardingStatus?: string | null;
    onboardingEtapa?: string | null;
    onboardingDados?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    riscoEscala?: string | null;
    macrosDiarios?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    pais?: string | null;
    anosdiagnostico?: number | null;
  },
) {
  return prisma.paciente.update({
    where: { id: pacienteId },
    data: dados,
  });
}

async function criarPacienteWhatsapp(payload: CriarPacienteWhatsapp) {
  return prisma.paciente.create({
    data: {
      clinicaId: payload.clinicaId,
      telefone: payload.telefone,
      nome: payload.nome,
      tipoDiabetes: payload.tipoDiabetes,
    },
  });
}

export {
  buscarPacientePorTelefone,
  buscarPacientePorId,
  desativarPacienteWhatsapp,
  salvarMensagem,
  criarGlicemia,
  buscarUltimasGlicemias,
  criarConfiguracaoWhatsapp,
  buscarConfiguracaoWhatsappPorClinica,
  buscarConfiguracaoWhatsappPorIdNumero,
  excluirConfiguracaoWhatsapp,
  atualizarPacienteOnboarding,
  criarPacienteWhatsapp,
};

import type { ConfiguracaoWhatsapp } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '../../infra/prisma.js';

const prismaExtendido = prisma as typeof prisma & {
  configuracaoWhatsapp: {
    create: (args: { data: ConfiguracaoCriar }) => Promise<unknown>;
    findFirst: (args: {
      where: { clinicaId?: string; idNumero?: string };
      orderBy: { criadoEm: 'desc' };
    }) => Promise<unknown>;
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

async function buscarPacientePorTelefone(telefone: string) {
  return prisma.paciente.findFirst({
    where: { ativo: true, telefone: { contains: telefone } },
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

async function atualizarPacienteOnboarding(
  pacienteId: string,
  dados: {
    nome?: string;
    email?: string | null;
    genero?: string | null;
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
  },
) {
  return prisma.paciente.update({
    where: { id: pacienteId },
    data: dados,
  });
}

export {
  buscarPacientePorTelefone,
  salvarMensagem,
  criarGlicemia,
  buscarUltimasGlicemias,
  criarConfiguracaoWhatsapp,
  buscarConfiguracaoWhatsappPorClinica,
  buscarConfiguracaoWhatsappPorIdNumero,
  atualizarPacienteOnboarding,
};

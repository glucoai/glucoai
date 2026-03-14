import { prisma } from '../../infra/prisma';

type MensagemCriar = {
  pacienteId: string;
  conteudo: string;
  remetente: 'PACIENTE' | 'SISTEMA' | 'IA' | 'PROFISSIONAL';
  tipo: 'TEXTO' | 'IMAGEM' | 'TEMPLATE';
};

async function buscarPacientePorTelefone(telefone: string) {
  return prisma.paciente.findFirst({
    where: { ativo: true, telefone: { contains: telefone } },
    select: {
      id: true,
      nome: true,
      telefone: true,
      tipoDiabetes: true,
      metaGlicemicaMin: true,
      metaGlicemicaMax: true,
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

export { buscarPacientePorTelefone, salvarMensagem, criarGlicemia, buscarUltimasGlicemias };

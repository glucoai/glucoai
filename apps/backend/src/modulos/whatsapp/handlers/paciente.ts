import { Prisma } from '@prisma/client';
import {
  buscarConfiguracaoWhatsappPorIdNumero,
  buscarPacientePorTelefone,
  criarPacienteWhatsapp,
  salvarMensagem,
  atualizarPacienteOnboarding,
} from '../repository.js';
import type { MensagemEntrada } from '../types.js';

type ConfiguracaoWhatsappMin = {
  clinicaId: string;
  idNumero: string;
};

function detectarConflitoPrisma(erro: unknown) {
  const codigo = (erro as { code?: string })?.code;
  return codigo === 'P2002';
}

async function obterConfiguracaoWhatsapp(idNumero?: string) {
  if (!idNumero) {
    return null;
  }
  const configuracao = (await buscarConfiguracaoWhatsappPorIdNumero(
    idNumero,
  )) as ConfiguracaoWhatsappMin | null;
  return configuracao;
}

async function registrarMensagemPaciente(pacienteId: string, mensagem: MensagemEntrada) {
  try {
    if (mensagem.tipo === 'image') {
      await salvarMensagem({
        pacienteId,
        conteudo: mensagem.imagemId ? `imagem:${mensagem.imagemId}` : 'imagem',
        remetente: 'PACIENTE',
        tipo: 'IMAGEM',
      });
      return;
    }
    const texto = mensagem.texto ?? '';
    await salvarMensagem({
      pacienteId,
      conteudo: texto,
      remetente: 'PACIENTE',
      tipo: 'TEXTO',
    });
  } catch {
    return;
  }
}

async function garantirPaciente(
  telefone: string,
  idNumero: string | undefined,
  configuracao?: ConfiguracaoWhatsappMin | null,
) {
  const clinicaId = configuracao?.clinicaId ?? (await obterConfiguracaoWhatsapp(idNumero))?.clinicaId;
  if (!clinicaId) {
    return null;
  }
  const pacienteExistente = await buscarPacientePorTelefone(telefone);
  if (pacienteExistente) {
    return pacienteExistente;
  }
  try {
    const paciente = await criarPacienteWhatsapp({
      clinicaId,
      telefone,
      nome: 'Paciente WhatsApp',
      tipoDiabetes: 'TIPO_2',
    });
    return paciente;
  } catch (erro) {
    if (!detectarConflitoPrisma(erro)) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'erro_criar_paciente', telefone, erro });
      return null;
    }
    const existente = await buscarPacientePorTelefone(telefone);
    if (existente) {
      await atualizarPacienteOnboarding(existente.id, {
        onboardingDados: (existente.onboardingDados ?? {}) as Prisma.InputJsonValue,
      });
      return existente;
    }
    return null;
  }
}

export { registrarMensagemPaciente, garantirPaciente, obterConfiguracaoWhatsapp };

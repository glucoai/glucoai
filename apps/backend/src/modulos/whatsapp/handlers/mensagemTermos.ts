import { Prisma } from '@prisma/client';
import { atualizarPacienteOnboarding, desativarPacienteWhatsapp } from '../repository.js';
import {
  botoesRecuperacaoTermos,
  botoesTermosAnalise,
  mensagemAceiteObrigatorio,
  mensagemNaoCompartilhar,
  mensagemRecusa,
} from '../messages/index.js';
import { enviarBotoesComRegistro, enviarTextoComRegistro } from '../client/index.js';
import { enviarAnalisePosFlow } from './analise.js';

type PacienteTermos = {
  id: string;
  nome?: string | null;
  onboardingDados?: unknown | null;
};

function obterPrimeiroNome(nome?: string | null) {
  if (!nome) return 'Paciente';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'Paciente';
}

async function tratarTermos(
  telefone: string,
  paciente: PacienteTermos,
  respostaNormalizada: string,
  respostaTermoChave: string,
  phoneNumberId?: string,
) {
  if (
    ['termo_concordar', 'concordar', 'concordar termos', 'termo_concordar_retorno'].includes(respostaNormalizada) ||
    ['simconcordar', 'concordar', 'termocontinuar'].includes(respostaTermoChave)
  ) {
    const dadosExistentes =
      paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
        ? (paciente.onboardingDados as Record<string, unknown>)
        : null;
    const analiseEnviada = dadosExistentes?._analisePosFlowEnviada === true;
    await atualizarPacienteOnboarding(paciente.id, {
      termosAceitos: true,
      onboardingStatus: 'CONCLUIDO',
      onboardingEtapa: 'FLOW_CONCLUIDO',
      onboardingDados: {
        ...(dadosExistentes ?? {}),
        _analisePosFlowEnviada: true,
        _analisePosFlowEmAndamento: !analiseEnviada,
      } as Prisma.InputJsonValue,
    });
    if (!analiseEnviada) {
      try {
        await enviarAnalisePosFlow(telefone, paciente as PacienteTermos & { nome: string }, phoneNumberId);
      } finally {
        const dadosAtualizados =
          paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
            ? (paciente.onboardingDados as Record<string, unknown>)
            : null;
        await atualizarPacienteOnboarding(paciente.id, {
          onboardingDados: {
            ...(dadosAtualizados ?? {}),
            _analisePosFlowEnviada: true,
            _analisePosFlowEmAndamento: false,
          } as Prisma.InputJsonValue,
        });
      }
    }
    return true;
  }
  if (
    ['termo_discordar', 'discordar', 'termo_nao_compartilhar'].includes(respostaNormalizada) ||
    ['naoconcordo', 'termonaocompartilhar'].includes(respostaTermoChave)
  ) {
    await atualizarPacienteOnboarding(paciente.id, {
      termosAceitos: false,
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'TERMO_ANALISE_RECUSADO',
    });
    const textoRecusa = mensagemRecusa(obterPrimeiroNome(paciente.nome ?? undefined));
    await enviarBotoesComRegistro(
      telefone,
      paciente.id,
      textoRecusa,
      botoesRecuperacaoTermos,
      phoneNumberId,
    );
    return true;
  }
  if (['termo_continuar', 'vamos continuar', 'vamos continuar!'].includes(respostaNormalizada)) {
    await atualizarPacienteOnboarding(paciente.id, {
      termosAceitos: true,
      onboardingStatus: 'CONCLUIDO',
      onboardingEtapa: 'FLOW_CONCLUIDO',
      onboardingDados: {
        ...(paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
          ? (paciente.onboardingDados as Record<string, unknown>)
          : {}),
        _analisePosFlowEnviada: true,
        _analisePosFlowEmAndamento: true,
      } as Prisma.InputJsonValue,
    });
    try {
      await enviarAnalisePosFlow(telefone, paciente as PacienteTermos & { nome: string }, phoneNumberId);
    } finally {
      const dadosAtualizados =
        paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
          ? (paciente.onboardingDados as Record<string, unknown>)
          : null;
      await atualizarPacienteOnboarding(paciente.id, {
        onboardingDados: {
          ...(dadosAtualizados ?? {}),
          _analisePosFlowEnviada: true,
          _analisePosFlowEmAndamento: false,
        } as Prisma.InputJsonValue,
      });
    }
    return true;
  }
  if (['termo_nao_compartilhar', 'não compartilhar', 'nao compartilhar'].includes(respostaNormalizada)) {
    await desativarPacienteWhatsapp(paciente.id);
    await enviarTextoComRegistro(
      telefone,
      paciente.id,
      mensagemNaoCompartilhar(obterPrimeiroNome(paciente.nome ?? undefined)),
      phoneNumberId,
    );
    return true;
  }
  await enviarBotoesComRegistro(
    telefone,
    paciente.id,
    mensagemAceiteObrigatorio,
    botoesTermosAnalise,
    phoneNumberId,
  );
  return true;
}

export { tratarTermos };

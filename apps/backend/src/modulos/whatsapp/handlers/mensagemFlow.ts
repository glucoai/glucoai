import { Prisma } from '@prisma/client';
import { env } from '../../../config/env.js';
import { atualizarPacienteOnboarding } from '../repository.js';
import {
  botoesBreakPattern,
  botoesComecarFlow,
  botoesConviteFlow,
  ctaFlowBreak,
  mensagemComoFunciona,
  textoBreakPattern,
  textoConviteFlow,
  textoMotivacaoControlado,
  textoMotivacaoDescuidado,
} from '../messages/index.js';
import { enviarBotoesComRegistro, enviarFlowDireto } from '../client/index.js';

async function enviarConviteFlowComBotoes(
  telefone: string,
  pacienteId: string,
  phoneNumberId?: string,
) {
  await enviarBotoesComRegistro(telefone, pacienteId, textoConviteFlow, botoesConviteFlow, phoneNumberId);
}

async function enviarComoFuncionaComBotao(
  telefone: string,
  pacienteId: string,
  phoneNumberId?: string,
) {
  const texto = mensagemComoFunciona();
  await enviarBotoesComRegistro(telefone, pacienteId, texto, botoesComecarFlow, phoneNumberId);
}

async function tratarInteracoesFlow(
  telefone: string,
  pacienteId: string,
  respostaNormalizada: string,
  respostaChave: string,
  onboardingDados: Record<string, unknown> | null,
  phoneNumberId?: string,
) {
  if (['flow_como_funciona', 'como funciona', 'como funciona?'].includes(respostaNormalizada)) {
    await enviarComoFuncionaComBotao(telefone, pacienteId, phoneNumberId);
    return true;
  }
  if (['flow_controlar_agora', 'controlar agora'].includes(respostaNormalizada)) {
    await enviarBotoesComRegistro(telefone, pacienteId, textoBreakPattern, botoesBreakPattern, phoneNumberId);
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'BREAK_PATTERN_ENVIADO',
    });
    return true;
  }
  if (['flow_comecar', 'sim, quero começar', 'sim, quero começar!', 'sim quero começar'].includes(respostaNormalizada)) {
    await enviarBotoesComRegistro(telefone, pacienteId, textoBreakPattern, botoesBreakPattern, phoneNumberId);
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'BREAK_PATTERN_ENVIADO',
    });
    return true;
  }
  if (
    [
      'breakcontrolado',
      'breakdescuidado',
      'controldireitinho',
      'controlodireitinho',
      'naolembrodireito',
    ].includes(respostaChave)
  ) {
    const controleGlicemia =
      respostaChave === 'breakcontrolado' ||
      respostaChave === 'controldireitinho' ||
      respostaChave === 'controlodireitinho'
        ? 'controlado'
        : 'descuidado';
    const mensagemMotivacao =
      controleGlicemia === 'controlado' ? textoMotivacaoControlado : textoMotivacaoDescuidado;
    const onboardingDadosAtualizados = onboardingDados
      ? { ...onboardingDados, controle_glicemia: controleGlicemia }
      : { controle_glicemia: controleGlicemia };
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'BREAK_PATTERN_RESPONDIDO',
      onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
    });
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      mensagemMotivacao,
      ctaFlowBreak,
      env.FLOW01_ID,
      'MISSION_START',
    );
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'FLOW01_ENVIADO',
    });
    return true;
  }
  return false;
}

export { enviarConviteFlowComBotoes, tratarInteracoesFlow };

import { Prisma } from '@prisma/client';
import { env } from '../../../config/env.js';
import { atualizarPacienteOnboarding, buscarPacientePorId } from '../repository.js';
import {
  ctaFlowContinuar,
  textoContinuarFlow02,
  botoesGestacional,
  mensagemContinuar,
  mensagemGestacional,
  mensagemNaoSei,
} from '../messages/index.js';
import {
  extrairTextoResposta,
  mapearGeneroFlow,
  mapearTipoDiabetesFlow,
  obterValorPorChaves,
  normalizarResposta,
  parsearDataNascimento,
  calcularIdade,
} from '../parsing/index.js';
import { enviarBotoesComRegistro, enviarFlowDireto } from '../client/index.js';
import { montarDadosFlow02Inicial } from './utils.js';
import { obterPrimeiroNome } from './helpers.js';

type PacienteOnboarding = {
  id: string;
  nome?: string | null;
  onboardingDados?: unknown | null;
};

async function processarRespostaFlow01(
  telefone: string,
  pacienteId: string,
  dadosFlow: Record<string, unknown>,
  phoneNumberId?: string,
) {
  const existente = (await buscarPacientePorId(pacienteId)) as PacienteOnboarding | null;
  const onboardingDadosBruto =
    existente && typeof existente === 'object' && 'onboardingDados' in existente
      ? (existente as { onboardingDados?: unknown }).onboardingDados
      : undefined;
  const dadosExistentes =
    onboardingDadosBruto && typeof onboardingDadosBruto === 'object'
      ? (onboardingDadosBruto as Record<string, unknown>)
      : null;
  const nome = obterValorPorChaves(dadosFlow, ['nome', 'name', 'nome_completo', 'nomeCompleto']);
  const generoBruto = obterValorPorChaves(dadosFlow, ['sexo', 'genero', 'gênero']);
  const genero = mapearGeneroFlow(generoBruto);
  const dataNascimentoValor = obterValorPorChaves(dadosFlow, [
    'data_nascimento',
    'dataNascimento',
    'nascimento',
  ]);
  const paisValor = obterValorPorChaves(dadosFlow, ['pais', 'país', 'country']);
  const tipoDiabetesValor = obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']);
  const tipoDiabetesFlow = mapearTipoDiabetesFlow(tipoDiabetesValor);
  const tipoDiabetesTexto = normalizarResposta(extrairTextoResposta(tipoDiabetesValor));
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'flow01_tipo_diabetes',
    tipoDiabetesValor,
    tipoDiabetesFlow,
    tipoDiabetesTexto,
  });
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const idadeCalculada = dataNascimento ? calcularIdade(dataNascimento) : null;
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  await atualizarPacienteOnboarding(pacienteId, {
    nome: typeof nome === 'string' ? nome.trim() : undefined,
    genero: typeof genero === 'string' ? genero : undefined,
    tipoDiabetes: tipoDiabetesFlow ?? undefined,
    dataNascimento: dataNascimento ?? undefined,
    idade: typeof idadeCalculada === 'number' ? Math.round(idadeCalculada) : undefined,
    pais: typeof paisValor === 'string' ? paisValor : undefined,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'FLOW01_RESPONDIDO',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  const dadosFlow02Inicial = montarDadosFlow02Inicial(onboardingDadosAtualizados);
  const pacienteAtualizado = (await buscarPacientePorId(pacienteId)) as PacienteOnboarding | null;
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
  if (tipoDiabetesFlow === 'GESTACIONAL' || tipoDiabetesTexto.includes('gestacional')) {
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'GESTACIONAL_AVISO',
      tipoDiabetes: 'GESTACIONAL',
    });
    const textoGestacional = mensagemGestacional(primeiroNome);
    await enviarBotoesComRegistro(
      telefone,
      pacienteId,
      textoGestacional,
      botoesGestacional,
      phoneNumberId,
    );
    return;
  }
  if (
    tipoDiabetesTexto.includes('nao_sei') ||
    tipoDiabetesTexto.includes('naosei') ||
    tipoDiabetesTexto.includes('não sei')
  ) {
    const textoNaoSei = mensagemNaoSei(primeiroNome);
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      textoNaoSei,
      ctaFlowContinuar,
      env.FLOW02_ID,
      'DIABETES_TYPE_CHECK',
      dadosFlow02Inicial,
    );
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'FLOW02_ENVIADO',
    });
    return;
  }
  if (tipoDiabetesFlow === 'TIPO_1' || tipoDiabetesFlow === 'TIPO_2') {
    const textoContinuar = mensagemContinuar(primeiroNome);
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      textoContinuar,
      ctaFlowContinuar,
      env.FLOW02_ID,
      'DIABETES_TYPE_CHECK',
      dadosFlow02Inicial,
    );
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'FLOW02_ENVIADO',
    });
    return;
  }
  await enviarFlowDireto(
    telefone,
    phoneNumberId,
    textoContinuarFlow02,
    ctaFlowContinuar,
    env.FLOW02_ID,
    'DIABETES_TYPE_CHECK',
    dadosFlow02Inicial,
  );
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingEtapa: 'FLOW02_ENVIADO',
  });
}

export { processarRespostaFlow01 };

import { Prisma } from '@prisma/client';
import { env } from '../../../config/env.js';
import { atualizarPacienteOnboarding, buscarPacientePorId } from '../repository.js';
import { mensagemComAparelho, mensagemSemAparelho } from '../messages/index.js';
import {
  calcularEscalaRisco,
  calcularIdade,
  calcularMacrosDiarios,
  extrairAlturaCm,
  extrairPesoKg,
  extrairTextoResposta,
  mapearGeneroFlow,
  mapearTipoDiabetesFlow,
  normalizarResposta,
  obterValorPorChaves,
  parsearAnosDiagnostico,
  parsearBooleano,
  parsearDataNascimento,
  parsearNumero,
} from '../parsing/index.js';
import { enviarFlowDireto } from '../client/index.js';
import { montarDadosFlow03Inicial } from './utils.js';
import { obterPrimeiroNome } from './helpers.js';

type PacienteOnboarding = {
  id: string;
  nome?: string | null;
  onboardingDados?: unknown | null;
};

async function processarRespostaFlow02(
  telefone: string,
  pacienteId: string,
  dadosFlow: Record<string, unknown>,
  phoneNumberId?: string,
) {
  console.log('[GLUCO:WHATSAPP]', { acao: 'flow02_inicio', telefone, pacienteId });
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
  const email = obterValorPorChaves(dadosFlow, ['email', 'e-mail']);
  const tipoDiabetesFlow = mapearTipoDiabetesFlow(
    obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']),
  );
  const dataNascimentoValor = obterValorPorChaves(dadosFlow, [
    'data_nascimento',
    'dataNascimento',
    'nascimento',
  ]);
  const paisValor = obterValorPorChaves(dadosFlow, ['pais', 'país', 'country']);
  const anosDiagnosticoValor = obterValorPorChaves(dadosFlow, [
    'anos_diabetes',
    'anosDiagnostico',
    'anos_diagnostico',
  ]);
  const medicamentosValor = obterValorPorChaves(dadosFlow, ['medicamentos']);
  const idadeValor = obterValorPorChaves(dadosFlow, ['idade', 'age']);
  const alturaValor = obterValorPorChaves(dadosFlow, ['altura', 'altura_cm', 'alturaCm']);
  const pesoValor = obterValorPorChaves(dadosFlow, ['peso', 'peso_kg', 'pesoKg']);
  const glicemiaValor = obterValorPorChaves(dadosFlow, [
    'ultima_glicemia',
    'ultimaglicemia',
    'glicemia',
    'pico_glicemia',
    'maior_glicemia',
  ]);
  const sintomasValor = obterValorPorChaves(dadosFlow, [
    'sintomas',
    'complicacoes',
    'sintomasComplicacoes',
  ]);
  const emergenciaValor = obterValorPorChaves(dadosFlow, ['emergencia', 'emergência']);
  const aparelhoValor = obterValorPorChaves(dadosFlow, ['aparelho_glicemia']);
  const idade = parsearNumero(idadeValor);
  const alturaCm = alturaValor ? extrairAlturaCm(String(alturaValor)) : null;
  const pesoKg = pesoValor ? extrairPesoKg(String(pesoValor)) : null;
  const glicemiaTexto = typeof glicemiaValor === 'string' ? glicemiaValor : '';
  const glicemiaNumeros = glicemiaTexto.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  const ultimaGlicemia =
    glicemiaNumeros.length > 0 ? Math.max(...glicemiaNumeros) : parsearNumero(glicemiaValor);
  const sintomasArray = Array.isArray(sintomasValor)
    ? sintomasValor
    : typeof sintomasValor === 'string'
      ? sintomasValor.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  const sintomasTemNenhum = sintomasArray.some(
    (item) => normalizarResposta(String(item)) === 'nenhum',
  );
  const sintomasComplicacoes =
    sintomasArray.length > 0
      ? !sintomasTemNenhum
      : parsearBooleano(sintomasValor) ?? parsearBooleano(emergenciaValor);
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const anosDiagnostico = parsearAnosDiagnostico(anosDiagnosticoValor);
  const idadeCalculada =
    !idade && dataNascimento ? calcularIdade(dataNascimento) : (idade ?? null);
  const risco =
    typeof ultimaGlicemia === 'number' && typeof sintomasComplicacoes === 'boolean'
      ? calcularEscalaRisco(ultimaGlicemia, sintomasComplicacoes)
      : null;
  const macros = typeof pesoKg === 'number' ? calcularMacrosDiarios(pesoKg) : null;
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  const aparelhoTexto = normalizarResposta(extrairTextoResposta(aparelhoValor));
  const temAparelho = aparelhoTexto === 'sim' || aparelhoTexto.includes('sim');
  const semGlicosimetro = !temAparelho;
  try {
    await atualizarPacienteOnboarding(pacienteId, {
      nome: typeof nome === 'string' ? nome.trim() : undefined,
      genero: typeof genero === 'string' ? genero : undefined,
      email: typeof email === 'string' ? email : undefined,
      tipoDiabetes: tipoDiabetesFlow ?? undefined,
      dataNascimento: dataNascimento ?? undefined,
      idade: typeof idadeCalculada === 'number' ? Math.round(idadeCalculada) : undefined,
      alturaCm: typeof alturaCm === 'number' ? alturaCm : undefined,
      pesoKg: typeof pesoKg === 'number' ? pesoKg : undefined,
      ultimaGlicemia: typeof ultimaGlicemia === 'number' ? Math.round(ultimaGlicemia) : undefined,
      sintomasComplicacoes: typeof sintomasComplicacoes === 'boolean' ? sintomasComplicacoes : undefined,
      riscoEscala: risco ?? undefined,
      macrosDiarios: macros ?? undefined,
      pais: typeof paisValor === 'string' ? paisValor : undefined,
      anosdiagnostico: typeof anosDiagnostico === 'number' ? anosDiagnostico : undefined,
      medicamentos: typeof medicamentosValor === 'string' ? medicamentosValor : undefined,
      semGlicosimetro,
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'FLOW02_RESPONDIDO',
      onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
    });
  } catch (erro) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'flow02_erro_atualizar',
      telefone,
      erro: (erro as Error).message,
    });
  }
  const pacienteAtualizado = (await buscarPacientePorId(pacienteId)) as PacienteOnboarding | null;
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
  const dadosFlow03Inicial = montarDadosFlow03Inicial(onboardingDadosAtualizados);
  if (temAparelho) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'flow02_aparelho',
      telefone,
      temAparelho,
      dadosFlow03: dadosFlow03Inicial,
    });
    const textoComAparelho = mensagemComAparelho(primeiroNome);
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      textoComAparelho,
      'Continuar Cadastro',
      env.FLOW03_ID,
      'STEP_SINTOMAS',
      dadosFlow03Inicial,
    );
  } else {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'flow02_aparelho',
      telefone,
      temAparelho,
      dadosFlow03: dadosFlow03Inicial,
    });
    const textoSemAparelho = mensagemSemAparelho(primeiroNome);
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      textoSemAparelho,
      'Continuar Cadastro',
      env.FLOW03_ID,
      'STEP_SINTOMAS',
      dadosFlow03Inicial,
    );
  }
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingEtapa: 'FLOW03_ENVIADO',
  });
}

export { processarRespostaFlow02 };

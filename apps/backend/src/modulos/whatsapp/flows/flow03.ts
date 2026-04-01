import { Prisma } from '@prisma/client';
import { atualizarPacienteOnboarding, buscarPacientePorId } from '../repository.js';
import { mensagemTermos, botoesTermosAnalise } from '../messages/index.js';
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
import { enviarBotoesComRegistro } from '../client/index.js';
import { calcularScoreMetabolico } from './score.js';
import { obterPrimeiroNome } from './helpers.js';
type PacienteOnboarding = {
  id: string;
  nome?: string | null;
  tipoDiabetes?: string | null;
  onboardingDados?: unknown | null;
};
async function processarRespostaFlow03(
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
  const termosJaEnviados = dadosExistentes?._termoAnaliseEnviado === true;
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
  const controleDiabetesValor = obterValorPorChaves(dadosFlow, ['controle_diabetes', 'controle_glicemia']);
  const medicamentosValor = obterValorPorChaves(dadosFlow, ['medicamentos']);
  const alimentacaoValor = obterValorPorChaves(dadosFlow, ['alimentacao', 'alimentação']);
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
  const termosValor = obterValorPorChaves(dadosFlow, ['termos', 'termos_aceitos', 'aceite_termos']);
  const idade = parsearNumero(idadeValor);
  const alturaCm = alturaValor ? extrairAlturaCm(String(alturaValor)) : null;
  const pesoKg = pesoValor ? extrairPesoKg(String(pesoValor)) : null;
  const glicemiaTexto = typeof glicemiaValor === 'string' ? glicemiaValor : '';
  const glicemiaNumeros = glicemiaTexto.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  const ultimaGlicemia =
    glicemiaNumeros.length > 0 ? Math.max(...glicemiaNumeros) : parsearNumero(glicemiaValor);
  const sintomasArray = Array.isArray(sintomasValor) ? sintomasValor : typeof sintomasValor === 'string' ? sintomasValor.split(',').map((item) => item.trim()).filter(Boolean) : [];
  const sintomasFiltrados = sintomasArray.filter((item) => normalizarResposta(String(item)) !== 'nenhum');
  const sintomasTemNenhum = sintomasArray.length > 0 && sintomasFiltrados.length === 0;
  const sintomasComplicacoes =
    sintomasArray.length > 0
      ? !sintomasTemNenhum
      : parsearBooleano(sintomasValor) ?? parsearBooleano(emergenciaValor);
  const quantidadeSintomas = sintomasArray.length > 0 ? sintomasFiltrados.length : sintomasComplicacoes ? 1 : 0;
  const termosAceitos = parsearBooleano(termosValor);
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const anosDiagnostico = parsearAnosDiagnostico(anosDiagnosticoValor);
  const idadeCalculada =
    !idade && dataNascimento ? calcularIdade(dataNascimento) : (idade ?? null);
  const imcCalculado =
    typeof pesoKg === 'number' && typeof alturaCm === 'number'
      ? Number((pesoKg / Math.pow(alturaCm / 100, 2)).toFixed(1))
      : null;
  const risco =
    typeof ultimaGlicemia === 'number' && typeof sintomasComplicacoes === 'boolean'
      ? calcularEscalaRisco(ultimaGlicemia, sintomasComplicacoes)
      : null;
  const macros = typeof pesoKg === 'number' ? calcularMacrosDiarios(pesoKg) : null;
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  const tipoDiabetesScore =
    tipoDiabetesFlow ??
    mapearTipoDiabetesFlow(
      obterValorPorChaves(onboardingDadosAtualizados, ['tipo_diabetes', 'tipoDiabetes']),
    ) ??
    (existente?.tipoDiabetes ?? null);
  const controleDiabetesTexto =
    extrairTextoResposta(
      controleDiabetesValor ??
        obterValorPorChaves(onboardingDadosAtualizados, ['controle_diabetes', 'controle_glicemia']),
    ) || null;
  const alimentacaoTexto =
    extrairTextoResposta(
      alimentacaoValor ??
        obterValorPorChaves(onboardingDadosAtualizados, ['alimentacao', 'alimentação']),
    ) || null;
  const medicamentosTexto =
    extrairTextoResposta(
      medicamentosValor ?? obterValorPorChaves(onboardingDadosAtualizados, ['medicamentos']),
    ) || null;
  const picoGlicemia =
    glicemiaNumeros.length > 0 ? Math.max(...glicemiaNumeros) : parsearNumero(glicemiaValor);
  const scoreResultado = calcularScoreMetabolico({
    tipoDiabetes: tipoDiabetesScore,
    anosDiagnostico,
    controleDiabetes: controleDiabetesTexto,
    emergencia: parsearBooleano(emergenciaValor),
    picoGlicemia,
    quantidadeSintomas,
    imc: imcCalculado,
    alimentacao: alimentacaoTexto,
    medicamentos: medicamentosTexto,
  });
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
    termosAceitos: typeof termosAceitos === 'boolean' ? termosAceitos : undefined,
    riscoEscala: risco ?? undefined,
    scoreTotal: scoreResultado?.total ?? undefined,
    scoreNivel: scoreResultado?.nivel ?? undefined,
    scoreMensagem: scoreResultado?.mensagem ?? undefined,
    scoreFrequencia: scoreResultado?.frequencia ?? undefined,
    scoreAtualizadoEm: scoreResultado ? new Date() : undefined,
    macrosDiarios: macros ?? undefined,
    pais: typeof paisValor === 'string' ? paisValor : undefined,
    anosdiagnostico: typeof anosDiagnostico === 'number' ? anosDiagnostico : undefined,
    medicamentos: typeof medicamentosValor === 'string' ? medicamentosValor : undefined,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'TERMO_ANALISE_PENDENTE',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  const pacienteAtualizado = (await buscarPacientePorId(pacienteId)) as PacienteOnboarding | null;
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
  console.log('[GLUCO:WHATSAPP]', { acao: 'flow_processado', telefone, pacienteId });
  if (termosJaEnviados) {
    return;
  }
  const textoTermos = mensagemTermos(primeiroNome);
  await enviarBotoesComRegistro(telefone, pacienteId, textoTermos, botoesTermosAnalise, phoneNumberId);
  const dadosComFlag = {
    ...(onboardingDadosAtualizados ?? {}),
    _termoAnaliseEnviado: true,
  };
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingDados: dadosComFlag as Prisma.InputJsonValue,
  });
}

export { processarRespostaFlow03 };

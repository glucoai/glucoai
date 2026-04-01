import { prisma } from '../src/infra/prisma.js';
import {
  calcularQuantidadeSintomas,
  calcularScoreMetabolico,
  extrairTextoResposta,
  obterValorPorChaves,
  parsearAnosDiagnostico,
  parsearBooleano,
  parsearNumero,
} from '../src/utils/scoreMetabolico.js';

type PacienteRegistro = {
  id: string;
  tipoDiabetes: string;
  anosdiagnostico: number | null;
  alturaCm: number | null;
  pesoKg: number | null;
  onboardingDados: unknown | null;
};

function obterOnboarding(paciente: PacienteRegistro) {
  if (!paciente.onboardingDados || typeof paciente.onboardingDados !== 'object') {
    return null;
  }
  return paciente.onboardingDados as Record<string, unknown>;
}

function obterControleDiabetes(onboarding: Record<string, unknown> | null) {
  return extrairTextoResposta(
    obterValorPorChaves(onboarding, ['controle_diabetes', 'controle_glicemia']),
  );
}

function obterEmergencia(onboarding: Record<string, unknown> | null) {
  return parsearBooleano(
    obterValorPorChaves(onboarding, ['pronto_socorro', 'emergencia', 'emergência']),
  );
}

function obterQuantidadeSintomas(onboarding: Record<string, unknown> | null) {
  const sintomasValor = obterValorPorChaves(onboarding, [
    'sintomas',
    'complicacoes',
    'sintomasComplicacoes',
  ]);
  return calcularQuantidadeSintomas(sintomasValor);
}

function obterAlimentacao(onboarding: Record<string, unknown> | null) {
  return extrairTextoResposta(obterValorPorChaves(onboarding, ['alimentacao', 'alimentação']));
}

function obterMedicamentos(onboarding: Record<string, unknown> | null) {
  return extrairTextoResposta(obterValorPorChaves(onboarding, ['medicamentos']));
}

function obterAnosDiagnostico(paciente: PacienteRegistro, onboarding: Record<string, unknown> | null) {
  return (
    paciente.anosdiagnostico ??
    parsearAnosDiagnostico(obterValorPorChaves(onboarding, ['anos_diabetes', 'anos_diagnostico']))
  );
}

function obterPicoGlicemia(onboarding: Record<string, unknown> | null) {
  const picoValor = obterValorPorChaves(onboarding, [
    'maior_glicemia',
    'pico_glicemia',
    'glicemia',
    'ultima_glicemia',
  ]);
  const glicemiasTexto = typeof picoValor === 'string' ? picoValor : '';
  const glicemiasNumeros = glicemiasTexto.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  if (glicemiasNumeros.length > 0) {
    return Math.max(...glicemiasNumeros);
  }
  return parsearNumero(picoValor);
}

function calcularImc(paciente: PacienteRegistro) {
  if (typeof paciente.pesoKg !== 'number' || typeof paciente.alturaCm !== 'number') {
    return null;
  }
  return Number((paciente.pesoKg / Math.pow(paciente.alturaCm / 100, 2)).toFixed(1));
}

function calcularScorePaciente(paciente: PacienteRegistro) {
  const onboarding = obterOnboarding(paciente);
  const controleDiabetes = obterControleDiabetes(onboarding);
  const emergencia = obterEmergencia(onboarding);
  const quantidadeSintomas = obterQuantidadeSintomas(onboarding);
  const alimentacao = obterAlimentacao(onboarding);
  const medicamentos = obterMedicamentos(onboarding);
  const anosDiagnostico = obterAnosDiagnostico(paciente, onboarding);
  const picoGlicemia = obterPicoGlicemia(onboarding);
  const imc = calcularImc(paciente);
  return calcularScoreMetabolico({
    tipoDiabetes: paciente.tipoDiabetes,
    anosDiagnostico,
    controleDiabetes: controleDiabetes || null,
    emergencia,
    picoGlicemia,
    quantidadeSintomas,
    imc,
    alimentacao: alimentacao || null,
    medicamentos: medicamentos || null,
  });
}

async function executar() {
  const pacientes = await prisma.paciente.findMany({
    where: { ativo: true },
    select: {
      id: true,
      tipoDiabetes: true,
      anosdiagnostico: true,
      alturaCm: true,
      pesoKg: true,
      onboardingDados: true,
    },
  });
  let atualizados = 0;
  let pulados = 0;
  let falhas = 0;
  const erros: { id: string; erro: string }[] = [];
  for (const paciente of pacientes) {
    try {
      const scoreResultado = calcularScorePaciente(paciente);
      if (!scoreResultado) {
        pulados += 1;
        continue;
      }
      await prisma.paciente.update({
        where: { id: paciente.id },
        data: {
          scoreTotal: scoreResultado.total,
          scoreNivel: scoreResultado.nivel,
          scoreMensagem: scoreResultado.mensagem,
          scoreFrequencia: scoreResultado.frequencia,
          scoreAtualizadoEm: new Date(),
        },
      });
      atualizados += 1;
    } catch (erro) {
      falhas += 1;
      erros.push({
        id: paciente.id,
        erro: (erro as Error).message,
      });
    }
  }
  console.log(
    JSON.stringify(
      {
        pacientes: pacientes.length,
        atualizados,
        pulados,
        falhas,
        erros,
      },
      null,
      2,
    ),
  );
}

executar()
  .catch((erro) => {
    console.error('Falha ao atualizar score', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

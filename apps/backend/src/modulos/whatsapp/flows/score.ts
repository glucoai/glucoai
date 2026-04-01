import { obterMensagemScore, type ScoreNivel } from '../messages/index.js';
import { normalizarResposta } from '../parsing/normalizacao.js';

type ScoreResultado = {
  total: number;
  nivel: ScoreNivel;
  mensagem: string;
  frequencia: string;
};

function formatarNivelScore(nivel?: string | null) {
  if (!nivel) return 'Não calculado';
  if (nivel === 'BAIXO') return 'Baixo';
  if (nivel === 'MODERADO') return 'Moderado';
  if (nivel === 'ALTO') return 'Alto';
  if (nivel === 'CRITICO') return 'Crítico';
  return nivel;
}

function determinarNivelScore(total: number): ScoreNivel {
  if (total <= 6) return 'BAIXO';
  if (total <= 12) return 'MODERADO';
  if (total <= 18) return 'ALTO';
  return 'CRITICO';
}

function calcularScoreMetabolico(dados: {
  tipoDiabetes?: string | null;
  anosDiagnostico?: number | null;
  controleDiabetes?: string | null;
  emergencia?: boolean | null;
  picoGlicemia?: number | null;
  quantidadeSintomas?: number | null;
  imc?: number | null;
  alimentacao?: string | null;
  medicamentos?: string | null;
}) {
  let total = 0;
  let temDados = false;

  if (dados.tipoDiabetes) {
    temDados = true;
    if (dados.tipoDiabetes === 'TIPO_1') total += 3;
    if (dados.tipoDiabetes === 'TIPO_2') total += 2;
  }

  if (typeof dados.anosDiagnostico === 'number') {
    temDados = true;
    if (dados.anosDiagnostico < 2) total += 1;
    if (dados.anosDiagnostico >= 2 && dados.anosDiagnostico <= 10) total += 2;
    if (dados.anosDiagnostico > 10) total += 3;
  }

  if (dados.controleDiabetes) {
    temDados = true;
    const controle = normalizarResposta(dados.controleDiabetes);
    if (controle.includes('descontrolado')) total += 3;
    if (controle.includes('nao sei') || controle.includes('não sei')) total += 2;
  }

  if (typeof dados.emergencia === 'boolean') {
    temDados = true;
    if (dados.emergencia) total += 3;
  }

  if (typeof dados.picoGlicemia === 'number') {
    temDados = true;
    if (dados.picoGlicemia >= 400) total += 3;
    else if (dados.picoGlicemia >= 300) total += 2;
    else if (dados.picoGlicemia >= 200) total += 1;
  }

  if (typeof dados.quantidadeSintomas === 'number') {
    temDados = true;
    if (dados.quantidadeSintomas >= 3) total += 3;
    else if (dados.quantidadeSintomas >= 1) total += 2;
  }

  if (typeof dados.imc === 'number') {
    temDados = true;
    if (dados.imc >= 30) total += 2;
    if (dados.imc >= 25 && dados.imc < 30) total += 1;
  }

  if (dados.alimentacao) {
    temDados = true;
    const alimentacao = normalizarResposta(dados.alimentacao);
    if (alimentacao.includes('muito desorganizada')) total += 2;
  }

  if (dados.medicamentos) {
    temDados = true;
    const medicamentos = normalizarResposta(dados.medicamentos);
    if (medicamentos.includes('insulina')) total += 1;
  }

  if (!temDados) {
    return null;
  }

  const nivel = determinarNivelScore(total);
  const { mensagem, frequencia } = obterMensagemScore(nivel);
  return { total, nivel, mensagem, frequencia } as ScoreResultado;
}

export { calcularScoreMetabolico, formatarNivelScore };

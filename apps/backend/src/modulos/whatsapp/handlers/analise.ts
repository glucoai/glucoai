import { montarMensagemAnalise, montarMensagemMetas, montarMensagemPosicionamento, montarMensagemProximoPasso } from '../messages/index.js';
import { calcularMacrosDiarios, normalizarResposta } from '../parsing/index.js';
import { formatarNivelScore } from '../flows/score.js';
import { enviarTextoComRegistro } from '../client/index.js';

type PacienteOnboarding = {
  id: string;
  nome: string;
  pesoKg?: number | null;
  alturaCm?: number | null;
  genero?: string | null;
  riscoEscala?: string | null;
  scoreTotal?: number | null;
  scoreNivel?: string | null;
  scoreMensagem?: string | null;
  scoreFrequencia?: string | null;
  macrosDiarios?: unknown | null;
};

function classificarImc(imc: number) {
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}

function formatarRiscoTexto(risco?: string | null) {
  if (!risco) return 'médio';
  const texto = risco.toLowerCase();
  if (texto.includes('alto')) return 'alto';
  if (texto.includes('baixo')) return 'baixo';
  return 'médio';
}

function montarFraseRisco(risco: string) {
  if (risco === 'alto') {
    return 'Se continuar assim, sua glicemia pode se desregular com mais facilidade.';
  }
  if (risco === 'baixo') {
    return 'Você ainda está em uma zona de segurança, mas precisa manter constância.';
  }
  return 'Você já mostra sinais de alerta e precisa ajustar a rotina para evitar piora.';
}

function determinarSozinhoA(genero?: string | null) {
  const texto = normalizarResposta(genero ?? '');
  if (texto.includes('feminino')) return 'sozinha';
  if (texto.includes('masculino')) return 'sozinho';
  return 'sozinho(a)';
}

function obterPrimeiroNome(nome?: string) {
  if (!nome) return 'Paciente';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'Paciente';
}

function montarDadosAnalise(paciente: PacienteOnboarding) {
  const primeiroNome = obterPrimeiroNome(paciente.nome);
  const imc =
    typeof paciente.pesoKg === 'number' && typeof paciente.alturaCm === 'number'
      ? Number((paciente.pesoKg / Math.pow(paciente.alturaCm / 100, 2)).toFixed(1))
      : null;
  const classificacaoImc = imc ? classificarImc(imc) : 'Não informado';
  const riscoTexto = formatarRiscoTexto(paciente.riscoEscala);
  const fraseRisco = montarFraseRisco(riscoTexto);
  const scoreNivelTexto = formatarNivelScore(paciente.scoreNivel);
  const macros =
    paciente.macrosDiarios && typeof paciente.macrosDiarios === 'object'
      ? (paciente.macrosDiarios as { proteina?: number; carboidratos?: number; gorduras?: number })
      : null;
  const macrosCalculados =
    macros ||
    (typeof paciente.pesoKg === 'number' ? calcularMacrosDiarios(paciente.pesoKg) : null);
  const kcal =
    macrosCalculados &&
    typeof macrosCalculados.proteina === 'number' &&
    typeof macrosCalculados.carboidratos === 'number' &&
    typeof macrosCalculados.gorduras === 'number'
      ? macrosCalculados.proteina * 4 + macrosCalculados.carboidratos * 4 + macrosCalculados.gorduras * 9
      : null;
  return {
    primeiroNome,
    imc,
    classificacaoImc,
    riscoTexto,
    fraseRisco,
    scoreTotal: paciente.scoreTotal,
    scoreNivelTexto,
    scoreMensagem: paciente.scoreMensagem,
    scoreFrequencia: paciente.scoreFrequencia,
    macros: macrosCalculados,
    kcal,
  };
}

async function enviarAnalisePosFlow(
  telefone: string,
  paciente: PacienteOnboarding,
  phoneNumberId?: string,
) {
  const {
    primeiroNome,
    imc,
    classificacaoImc,
    riscoTexto,
    fraseRisco,
    scoreTotal,
    scoreNivelTexto,
    scoreMensagem,
    scoreFrequencia,
    macros,
    kcal,
  } = montarDadosAnalise(paciente);
  await new Promise((resolve) => setTimeout(resolve, 16000));
  const mensagemValor = montarMensagemAnalise({
    primeiroNome,
    imc,
    classificacaoImc,
    riscoTexto,
    fraseRisco,
    scoreTotal,
    scoreNivelTexto,
    scoreMensagem,
  });
  await enviarTextoComRegistro(telefone, paciente.id, mensagemValor, phoneNumberId);
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const mensagemMetas = montarMensagemMetas({ kcal, macros, scoreFrequencia });
  await enviarTextoComRegistro(telefone, paciente.id, mensagemMetas, phoneNumberId);
  await new Promise((resolve) => setTimeout(resolve, 3500));
  const mensagemPosicionamento = montarMensagemPosicionamento(primeiroNome);
  await enviarTextoComRegistro(telefone, paciente.id, mensagemPosicionamento, phoneNumberId);
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const sozinhoA = determinarSozinhoA(paciente.genero);
  const mensagemProximoPasso = montarMensagemProximoPasso(primeiroNome, sozinhoA);
  await enviarTextoComRegistro(telefone, paciente.id, mensagemProximoPasso, phoneNumberId);
}

export { enviarAnalisePosFlow };

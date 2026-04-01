import { buscarPacientePorId, buscarUltimasGlicemias } from '../repository.js';
import {
  mensagemEscoreNaoCalculado,
  montarMensagemHistoricoResumo,
  montarMensagemHistoricoSemRegistros,
  montarMensagemResumoScore,
} from '../messages/index.js';
import { formatarNivelScore } from '../flows/score.js';

type PacienteOnboarding = {
  scoreTotal?: number | null;
  scoreNivel?: string | null;
  scoreMensagem?: string | null;
  scoreFrequencia?: string | null;
};

function montarResumoScorePaciente(paciente: PacienteOnboarding | null) {
  if (paciente?.scoreTotal == null || !paciente.scoreNivel) {
    return mensagemEscoreNaoCalculado;
  }
  const nivel = formatarNivelScore(paciente.scoreNivel);
  return montarMensagemResumoScore(
    paciente.scoreTotal,
    nivel,
    paciente.scoreMensagem,
    paciente.scoreFrequencia,
  );
}

async function montarHistoricoMensagem(pacienteId: string) {
  const registros = await buscarUltimasGlicemias(pacienteId, 7);
  const paciente = (await buscarPacientePorId(pacienteId)) as PacienteOnboarding | null;
  const resumoScore = montarResumoScorePaciente(paciente);
  if (!registros.length) {
    return montarMensagemHistoricoSemRegistros(resumoScore);
  }
  const total = registros.reduce((soma, item) => soma + item.valor, 0);
  const media = Math.round(total / registros.length);
  const ultimo = registros[0];
  if (!ultimo) {
    return montarMensagemHistoricoSemRegistros(resumoScore);
  }
  return montarMensagemHistoricoResumo({
    total: registros.length,
    media,
    ultima: ultimo.valor,
    resumoScore,
  });
}

export { montarHistoricoMensagem, montarResumoScorePaciente };

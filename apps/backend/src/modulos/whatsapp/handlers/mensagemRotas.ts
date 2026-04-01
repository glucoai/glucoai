import { montarMensagemPerfil, mensagemFallback, menuMensagem } from '../messages/index.js';
import { rotearMensagem } from '../routing/roteadorMensagem.js';
import { montarHistoricoMensagem, montarResumoScorePaciente } from './historico.js';
import { tratarLeituraGlicemia } from './mensagemGlicemia.js';
import { tratarImagemWhatsApp } from './mensagemImagem.js';
import { enviarTextoComRegistro } from '../client/index.js';
import type { MensagemEntrada } from '../types.js';

type PacienteRota = {
  id: string;
  nome: string;
  tipoDiabetes: string;
  metaGlicemicaMin: number | null;
  metaGlicemicaMax: number | null;
  scoreTotal?: number | null;
  scoreNivel?: string | null;
  scoreMensagem?: string | null;
  scoreFrequencia?: string | null;
};

function formatarTipoDiabetes(tipo: string) {
  if (tipo === 'TIPO_1') return 'Tipo 1';
  if (tipo === 'TIPO_2') return 'Tipo 2';
  if (tipo === 'GESTACIONAL') return 'Gestacional';
  if (tipo === 'PRE') return 'Pré-diabetes';
  return 'Não informado';
}

async function tratarRotas(
  mensagem: MensagemEntrada,
  paciente: PacienteRota,
  telefone: string,
  phoneNumberId?: string,
) {
  const rota = rotearMensagem(mensagem.texto, mensagem.tipo);
  if (rota === 'MENU') {
    await enviarTextoComRegistro(telefone, paciente.id, menuMensagem, phoneNumberId);
    return true;
  }
  if (rota === 'HISTORICO') {
    const historico = await montarHistoricoMensagem(paciente.id);
    await enviarTextoComRegistro(telefone, paciente.id, historico, phoneNumberId);
    return true;
  }
  if (rota === 'ESCORE') {
    const resumoScore = montarResumoScorePaciente(paciente);
    await enviarTextoComRegistro(telefone, paciente.id, resumoScore, phoneNumberId);
    return true;
  }
  if (rota === 'PERFIL') {
    const metaMin = paciente.metaGlicemicaMin ?? 70;
    const metaMax = paciente.metaGlicemicaMax ?? 140;
    const perfil = montarMensagemPerfil(
      paciente.nome,
      formatarTipoDiabetes(paciente.tipoDiabetes),
      metaMin,
      metaMax,
    );
    await enviarTextoComRegistro(telefone, paciente.id, perfil, phoneNumberId);
    return true;
  }
  if (rota === 'LEITURA_GLICEMIA' && mensagem.texto) {
    const resultado = await tratarLeituraGlicemia(paciente.id, mensagem.texto);
    await enviarTextoComRegistro(telefone, paciente.id, resultado.mensagem, phoneNumberId);
    return true;
  }
  if (rota === 'FOTO_REFEICAO') {
    const resultado = await tratarImagemWhatsApp(
      paciente.id,
      mensagem.imagemId,
      mensagem.texto,
    );
    await enviarTextoComRegistro(telefone, paciente.id, resultado.mensagem, phoneNumberId);
    return true;
  }
  await enviarTextoComRegistro(telefone, paciente.id, mensagemFallback, phoneNumberId);
  return true;
}

export { tratarRotas };

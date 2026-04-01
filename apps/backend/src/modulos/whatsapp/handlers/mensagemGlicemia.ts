import { criarGlicemia } from '../repository.js';
import { enfileirarAnaliseGlicemia } from '../services/filaIA.js';
import {
  mensagemGlicemiaErro,
  mensagemGlicemiaInvalida,
  montarMensagemGlicemiaRegistrada,
} from '../messages/respostas.js';

type ResultadoHandler = { ok: boolean; mensagem: string };

function extrairValorNumerico(texto: string) {
  const apenasDigitos = texto.replace(/\D/g, '');
  const valor = Number(apenasDigitos);
  if (!Number.isFinite(valor) || valor <= 0) {
    return null;
  }
  return valor;
}

async function tratarLeituraGlicemia(pacienteId: string, texto: string): Promise<ResultadoHandler> {
  const valor = extrairValorNumerico(texto);
  if (!valor) {
    return {
      ok: false,
      mensagem: mensagemGlicemiaInvalida,
    };
  }
  try {
    const registro = await criarGlicemia(pacienteId, valor);
    await enfileirarAnaliseGlicemia(registro.id);
    return {
      ok: true,
      mensagem: montarMensagemGlicemiaRegistrada(valor),
    };
  } catch {
    return {
      ok: false,
      mensagem: mensagemGlicemiaErro,
    };
  }
}

export { tratarLeituraGlicemia };

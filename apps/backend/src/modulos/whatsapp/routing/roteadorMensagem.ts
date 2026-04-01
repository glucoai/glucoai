import type { MensagemEntrada, RotaMensagem } from '../types.js';
import { normalizarResposta } from '../parsing/normalizacao.js';

function isNumero(texto: string) {
  const apenasDigitos = texto.replace(/\D/g, '');
  if (!apenasDigitos) {
    return false;
  }
  const valor = Number(apenasDigitos);
  return Number.isFinite(valor) && valor >= 30 && valor <= 600;
}

function rotearMensagem(texto: string | undefined, tipo: MensagemEntrada['tipo']): RotaMensagem {
  if (tipo === 'image') {
    return 'FOTO_REFEICAO';
  }
  if (!texto) {
    return 'DESCONHECIDO';
  }
  const textoLimpo = normalizarResposta(texto);
  if (isNumero(textoLimpo)) {
    return 'LEITURA_GLICEMIA';
  }
  if (['oi', 'olá', 'ola', 'menu'].includes(textoLimpo)) {
    return 'MENU';
  }
  if (textoLimpo === 'histórico' || textoLimpo === 'historico') {
    return 'HISTORICO';
  }
  if (textoLimpo === 'escore' || textoLimpo === 'score') {
    return 'ESCORE';
  }
  if (textoLimpo === 'perfil') {
    return 'PERFIL';
  }
  return 'DESCONHECIDO';
}

export { rotearMensagem };

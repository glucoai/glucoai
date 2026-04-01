import { normalizarChave } from './normalizacao.js';

function extrairTextoResposta(valor: unknown) {
  if (typeof valor === 'string') return valor;
  if (valor && typeof valor === 'object') {
    const possivelId = (valor as { id?: unknown }).id;
    if (typeof possivelId === 'string') return possivelId;
    const possivelTitle = (valor as { title?: unknown }).title;
    if (typeof possivelTitle === 'string') return possivelTitle;
  }
  return '';
}

function obterValorPorChaves(dados: Record<string, unknown>, chaves: string[]) {
  const alvos = new Set(chaves.map(normalizarChave));
  for (const [chave, valor] of Object.entries(dados)) {
    if (alvos.has(normalizarChave(chave))) {
      return valor;
    }
  }
  return undefined;
}

function extrairNumeroDecimal(texto: string) {
  const normalizado = texto.replace(',', '.');
  const match = normalizado.match(/[\d.]+/);
  if (!match) {
    return null;
  }
  const valor = Number(match[0]);
  if (!Number.isFinite(valor)) {
    return null;
  }
  return valor;
}

function extrairAlturaCm(texto: string) {
  const valor = extrairNumeroDecimal(texto);
  if (!valor) {
    return null;
  }
  if (valor <= 3) {
    return Math.round(valor * 100);
  }
  return Math.round(valor);
}

function extrairPesoKg(texto: string) {
  const valor = extrairNumeroDecimal(texto);
  if (!valor) {
    return null;
  }
  return Math.round(valor * 10) / 10;
}

export {
  extrairTextoResposta,
  obterValorPorChaves,
  extrairNumeroDecimal,
  extrairAlturaCm,
  extrairPesoKg,
};

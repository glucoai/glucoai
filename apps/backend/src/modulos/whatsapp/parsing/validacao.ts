import { extrairNumeroDecimal } from './extracao.js';
import { normalizarResposta } from './normalizacao.js';

function parsearBooleano(valor: unknown) {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor === 'number') return valor === 1;
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['sim', 's', 'true', '1'].includes(texto)) return true;
  if (['nao', 'não', 'n', 'false', '0'].includes(texto)) return false;
  return null;
}

function parsearNumero(valor: unknown) {
  if (typeof valor === 'number') return valor;
  if (typeof valor !== 'string') return null;
  return extrairNumeroDecimal(valor);
}

function parsearAnosDiagnostico(valor: unknown) {
  if (typeof valor === 'number') return Math.round(valor);
  if (typeof valor !== 'string') return null;
  const numeros = valor.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  if (!numeros.length) return null;
  return Math.max(...numeros);
}

function parsearDataNascimento(valor: unknown) {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : valor;
  }
  if (typeof valor !== 'string') return null;
  const texto = valor.trim();
  if (!texto) return null;
  const br = texto.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (br) {
    const dia = Number(br[1]);
    const mes = Number(br[2]);
    const ano = Number(br[3]);
    const data = new Date(ano, mes - 1, dia);
    if (!Number.isNaN(data.getTime())) return data;
  }
  const dataIso = new Date(texto);
  if (!Number.isNaN(dataIso.getTime())) return dataIso;
  return null;
}

export { parsearBooleano, parsearNumero, parsearAnosDiagnostico, parsearDataNascimento };

export { normalizarTexto, normalizarResposta, normalizarChave, normalizarTelefone } from './normalizacao.js';
export {
  extrairTextoResposta,
  obterValorPorChaves,
  extrairNumeroDecimal,
  extrairAlturaCm,
  extrairPesoKg,
} from './extracao.js';
export { parsearBooleano, parsearNumero, parsearAnosDiagnostico, parsearDataNascimento } from './validacao.js';
export { mapearGeneroFlow, mapearTipoDiabetesFlow } from './flow.js';
export { calcularIdade, calcularMacrosDiarios, calcularEscalaRisco } from './calculos.js';

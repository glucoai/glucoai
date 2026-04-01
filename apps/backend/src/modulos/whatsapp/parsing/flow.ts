import { normalizarResposta } from './normalizacao.js';

function mapearGeneroFlow(valor: unknown) {
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['masculino', 'm'].includes(texto)) return 'Masculino';
  if (['feminino', 'f'].includes(texto)) return 'Feminino';
  if (['outro'].includes(texto)) return 'Outro';
  if (
    ['nao_informar', 'nao informar', 'prefiro nao informar', 'prefiro não informar'].includes(
      texto,
    )
  ) {
    return 'Prefiro não informar';
  }
  return valor;
}

function mapearTipoDiabetesFlow(valor: unknown) {
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['tipo1', 'tipo_1', 'tipo 1'].includes(texto)) return 'TIPO_1';
  if (['tipo2', 'tipo_2', 'tipo 2'].includes(texto)) return 'TIPO_2';
  if (['gestacional'].includes(texto)) return 'GESTACIONAL';
  if (['pre', 'pré', 'pre_diabetes', 'pre diabetes', 'pré-diabetes'].includes(texto)) return 'PRE';
  return null;
}

export { mapearGeneroFlow, mapearTipoDiabetesFlow };

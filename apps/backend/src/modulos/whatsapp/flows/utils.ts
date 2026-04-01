import { obterValorPorChaves } from '../parsing/extracao.js';

function identificarFlowResposta(dadosFlow: Record<string, unknown>) {
  const chavesFlow03 = ['sintomas', 'alimentacao', 'peso', 'altura', 'email'];
  const encontrouFlow03 = chavesFlow03.some(
    (chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined,
  );
  if (encontrouFlow03) {
    return 'FLOW03';
  }
  const chavesFlow02 = [
    'medicamentos',
    'anos_diabetes',
    'controle_diabetes',
    'pronto_socorro',
    'maior_glicemia',
    'aparelho_glicemia',
  ];
  const encontrou = chavesFlow02.some((chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined);
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'identificar_flow_resposta',
    chavesEncontradas: chavesFlow02.filter((chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined),
  });
  return encontrou ? 'FLOW02' : 'FLOW01';
}

function montarDadosFlow02Inicial(dadosFlow: Record<string, unknown>) {
  return {
    controle_glicemia: obterValorPorChaves(dadosFlow, ['controle_glicemia']),
    nome_completo: obterValorPorChaves(dadosFlow, ['nome_completo', 'nomeCompleto', 'nome']),
    data_nascimento: obterValorPorChaves(dadosFlow, ['data_nascimento', 'dataNascimento']),
    sexo: obterValorPorChaves(dadosFlow, ['sexo']),
    pais: obterValorPorChaves(dadosFlow, ['pais']),
    tipo_diabetes: obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']),
  };
}

function montarDadosFlow03Inicial(dadosFlow: Record<string, unknown>) {
  return {
    ...montarDadosFlow02Inicial(dadosFlow),
    medicamentos: obterValorPorChaves(dadosFlow, ['medicamentos']),
    anos_diabetes: obterValorPorChaves(dadosFlow, ['anos_diabetes', 'anosDiagnostico', 'anos_diagnostico']),
    controle_diabetes: obterValorPorChaves(dadosFlow, ['controle_diabetes']),
    pronto_socorro: obterValorPorChaves(dadosFlow, ['pronto_socorro']),
    maior_glicemia: obterValorPorChaves(dadosFlow, ['maior_glicemia']),
    aparelho_glicemia: obterValorPorChaves(dadosFlow, ['aparelho_glicemia']),
  };
}

export { identificarFlowResposta, montarDadosFlow02Inicial, montarDadosFlow03Inicial };

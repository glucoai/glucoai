import { identificarFlowResposta, processarRespostaFlow01, processarRespostaFlow02, processarRespostaFlow03 } from '../flows/index.js';

async function processarRespostaFlow(
  telefone: string,
  pacienteId: string,
  responseJson: string,
  phoneNumberId?: string,
) {
  let dadosFlow: Record<string, unknown> | null = null;
  try {
    dadosFlow = JSON.parse(responseJson) as Record<string, unknown>;
  } catch {
    console.log('[GLUCO:WHATSAPP]', { acao: 'flow_json_invalido', telefone });
    return;
  }
  const payloadBase =
    dadosFlow.data && typeof dadosFlow.data === 'object'
      ? (dadosFlow.data as Record<string, unknown>)
      : dadosFlow;
  const chavesUteis = Object.keys(payloadBase).filter(
    (chave) => !['flow_token', 'version', 'screen', 'action', 'flow_id'].includes(chave),
  );
  if (chavesUteis.length === 0) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'flow_sem_dados',
      telefone,
      chaves: Object.keys(payloadBase),
    });
    return;
  }
  const tipo = identificarFlowResposta(payloadBase);
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'flow_recebido',
    telefone,
    tipo,
    chaves: Object.keys(payloadBase),
  });
  if (tipo === 'FLOW02') {
    await processarRespostaFlow02(telefone, pacienteId, payloadBase, phoneNumberId);
    return;
  }
  if (tipo === 'FLOW03') {
    await processarRespostaFlow03(telefone, pacienteId, payloadBase, phoneNumberId);
    return;
  }
  await processarRespostaFlow01(telefone, pacienteId, payloadBase, phoneNumberId);
}

export { processarRespostaFlow };

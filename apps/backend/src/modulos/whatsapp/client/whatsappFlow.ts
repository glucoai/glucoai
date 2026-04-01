import { env } from '../../../config/env.js';
import { ctaFlowPadrao, textoCabecalhoFlow, textoConviteFlow, textoRodapeFlow } from '../messages/index.js';

function criarFlowToken(numero: string) {
  const data = Date.now();
  return `onboarding_${numero}_${data}`;
}

async function enviarFlowDireto(
  telefone: string,
  phoneNumberId?: string,
  texto?: string,
  flowCta?: string,
  flowId?: string,
  telaInicial?: string,
  dadosInicial?: Record<string, unknown>,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  const idFlow =
    env.TESTEFLOW && env.FLOWTESTE_ID
      ? env.FLOWTESTE_ID
      : flowId ?? env.FLOW01_ID ?? env.FLOW_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId || !idFlow) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  const tela =
    telaInicial ??
    (env.TESTEFLOW && env.FLOWTESTE_ID
      ? 'TESTE'
      : idFlow === env.FLOW03_ID
        ? 'STEP_SINTOMAS'
        : idFlow === env.FLOW02_ID
          ? 'DIABETES_TYPE_CHECK'
          : 'MISSION_START');
  console.log('[GLUCO:WHATSAPP]', { acao: 'enviar_flow', telefone, flowId: idFlow, phoneNumberId: numeroId });
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: telefone,
    type: 'interactive',
    interactive: {
      type: 'flow',
      header: { type: 'text', text: textoCabecalhoFlow },
      body: {
        text: texto ?? textoConviteFlow,
      },
      footer: { text: textoRodapeFlow },
      action: {
        name: 'flow',
        parameters: {
          flow_message_version: '3',
          flow_token: criarFlowToken(telefone),
          flow_id: idFlow,
          flow_cta: flowCta ?? ctaFlowPadrao,
          flow_action: 'navigate',
          flow_action_payload: {
            screen: tela,
            ...(dadosInicial ? { data: dadosInicial } : {}),
          },
        },
      },
    },
  };
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_flow',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'flow_enviado', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_flow',
        telefone,
        tentativa,
        erro: (erro as Error).message,
      });
      if (tentativa === 3) {
        throw erro;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
    }
  }
  return false;
}

export { enviarFlowDireto };

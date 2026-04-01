import type { MensagemEntrada, WebhookPayload } from '../types.js';
import { processarMensagem } from './processarMensagem.js';

function extrairMensagens(payload: WebhookPayload): MensagemEntrada[] {
  const mensagens: MensagemEntrada[] = [];
  const entradas = payload.entry ?? [];
  for (const entry of entradas) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      const lista = change.value?.messages ?? [];
      for (const message of lista) {
        const tipo =
          message.type === 'text'
            ? 'text'
            : message.type === 'image'
              ? 'image'
              : message.type === 'interactive'
                ? 'interactive'
                : 'unknown';
        const textoInterativo =
          message.interactive?.button_reply?.title ??
          message.interactive?.button_reply?.id ??
          message.interactive?.list_reply?.title ??
          message.interactive?.list_reply?.id;
        const flowJson = message.interactive?.nfm_reply?.response_json;
        const flowBody = message.interactive?.nfm_reply?.body;
        const flowJsonString =
          typeof flowJson === 'string'
            ? flowJson
            : flowJson && typeof flowJson === 'object'
              ? JSON.stringify(flowJson)
              : undefined;
        const flowBodyString =
          flowBody && typeof flowBody === 'object' ? JSON.stringify(flowBody) : undefined;
        if (!message.from) {
          continue;
        }
        if (message.interactive?.nfm_reply) {
          console.log('[GLUCO:WHATSAPP]', {
            acao: 'flow_webhook_raw',
            telefone: message.from,
            interactiveTipo: message.interactive?.type,
            responseJson: flowJsonString ?? flowJson,
            responseBody: flowBodyString ?? flowBody,
            nfmKeys: Object.keys(message.interactive?.nfm_reply ?? {}),
          });
        }
        mensagens.push({
          id: message.id ?? crypto.randomUUID(),
          tipo,
          texto: message.text?.body ?? textoInterativo ?? flowJsonString ?? flowBodyString,
          telefone: message.from,
          imagemId: message.image?.id,
          flowResponseJson: flowJsonString,
        });
      }
    }
  }
  return mensagens;
}

async function processarWebhook(payload: WebhookPayload) {
  const mensagens = extrairMensagens(payload);
  console.log('[GLUCO:WHATSAPP]', { acao: 'webhook_recebido', mensagens: mensagens.length });
  for (const mensagem of mensagens) {
    try {
      await processarMensagem(mensagem);
    } catch {
      continue;
    }
  }
}

async function processarWebhookComNumero(payload: WebhookPayload, idNumero?: string) {
  const mensagens = extrairMensagens(payload);
  console.log('[GLUCO:WHATSAPP]', { acao: 'webhook_recebido', mensagens: mensagens.length, idNumero });
  for (const mensagem of mensagens) {
    try {
      await processarMensagem(mensagem, idNumero);
    } catch {
      continue;
    }
  }
}

export { processarWebhook, processarWebhookComNumero };

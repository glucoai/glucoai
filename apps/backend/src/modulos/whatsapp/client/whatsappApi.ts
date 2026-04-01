import { env } from '../../../config/env.js';

async function enviarBotoesWhatsApp(
  telefone: string,
  texto: string,
  botoes: { id: string; titulo: string }[],
  phoneNumberId?: string,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'enviar_botoes',
    telefone,
    botoes: botoes.map((botao) => botao.id),
    phoneNumberId: numeroId,
  });
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: texto },
            action: {
              buttons: botoes.map((botao) => ({
                type: 'reply',
                reply: { id: botao.id, title: botao.titulo },
              })),
            },
          },
        }),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_botoes',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'botoes_enviados', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_botoes',
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

async function enviarTextoWhatsApp(
  telefone: string,
  texto: string,
  phoneNumberId?: string,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'enviar_texto',
    telefone,
    tamanho: texto.length,
    phoneNumberId: numeroId,
  });
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'text',
          text: { body: texto },
        }),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_texto',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'texto_enviado', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_texto',
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

export { enviarBotoesWhatsApp, enviarTextoWhatsApp };

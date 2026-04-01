import { randomUUID } from 'crypto';
import { env } from '../../config/env.js';
import type {
  CheckoutPixAutomaticoPayload,
  WooviAssinaturaResposta,
  WooviAssinaturaRespostaLista,
} from './types.js';

function normalizarBaseUrl(url: string) {
  if (url.endsWith('/')) return url.slice(0, -1);
  return url;
}

function obterHeadersWoovi() {
  if (!env.WOOVI_API_KEY) {
    throw new Error('Chave da Woovi não configurada.');
  }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: env.WOOVI_API_KEY,
  };
}

function montarPayloadWoovi(payload: CheckoutPixAutomaticoPayload) {
  const endereco = payload.endereco
    ? {
        zipcode: payload.endereco.cep,
        street: payload.endereco.rua,
        number: payload.endereco.numero,
        neighborhood: payload.endereco.bairro,
        city: payload.endereco.cidade,
        state: payload.endereco.estado,
        complement: payload.endereco.complemento ?? undefined,
      }
    : undefined;
  return {
    name: 'Pix Automático',
    value: payload.valor,
    customer: {
      name: payload.nome,
      taxID: payload.cpf,
      email: payload.email,
      phone: payload.telefone,
      address: endereco,
    },
    correlationID: payload.correlationId ?? randomUUID(),
    comment: payload.comentario ?? undefined,
    frequency: 'MONTHLY',
    type: 'PIX_RECURRING',
    pixRecurringOptions: {
      journey: 'PAYMENT_ON_APPROVAL',
      retryPolicy: 'NON_PERMITED',
    },
    dayGenerateCharge: payload.diaGeracao,
    dayDue: payload.diaVencimento,
  };
}

async function criarAssinaturaWoovi(payload: CheckoutPixAutomaticoPayload) {
  try {
    if (!env.WOOVI_API_URL) {
      throw new Error('URL da Woovi não configurada.');
    }
    const baseUrl = normalizarBaseUrl(env.WOOVI_API_URL);
    const payloadWoovi = montarPayloadWoovi(payload);
    console.log('[GLUCO:WOOVI]', { acao: 'assinatura_payload', payload: payloadWoovi });
    const retorno = await requisitarWoovi(baseUrl, payloadWoovi);
    if (retorno.tipo === 'json') return retorno.payload;
    const baseAlternativo = obterBaseAlternativo(baseUrl);
    if (!baseAlternativo) {
      throw new Error(retorno.mensagem);
    }
    const retornoAlternativo = await requisitarWoovi(baseAlternativo, payloadWoovi, true);
    if (retornoAlternativo.tipo === 'json') return retornoAlternativo.payload;
    throw new Error(retornoAlternativo.mensagem);
  } catch (erro) {
    const mensagem = (erro as Error).message || 'Erro ao criar assinatura Woovi.';
    console.log('[GLUCO:WOOVI]', { acao: 'assinatura_exception', erro: mensagem });
    throw new Error(mensagem);
  }
}

type RetornoWoovi =
  | { tipo: 'json'; payload: WooviAssinaturaResposta | WooviAssinaturaRespostaLista }
  | { tipo: 'erro'; mensagem: string };

async function interpretarRespostaWoovi(resposta: Response): Promise<RetornoWoovi> {
  const contentType = resposta.headers.get('content-type') ?? '';
  const texto = await resposta.text();
  if (!resposta.ok) {
    console.log('[GLUCO:WOOVI]', {
      acao: 'assinatura_erro',
      status: resposta.status,
      erro: texto,
    });
    return { tipo: 'erro', mensagem: texto || 'Erro ao criar assinatura Woovi.' };
  }
  if (!contentType.includes('application/json')) {
    console.log('[GLUCO:WOOVI]', {
      acao: 'assinatura_resposta_invalida',
      status: resposta.status,
      contentType,
      erro: texto,
    });
    return { tipo: 'erro', mensagem: 'Resposta inválida da Woovi ao criar assinatura.' };
  }
  try {
    const payload = JSON.parse(texto) as WooviAssinaturaResposta | WooviAssinaturaRespostaLista;
    console.log('[GLUCO:WOOVI]', { acao: 'assinatura_resposta', payload });
    return { tipo: 'json', payload };
  } catch {
    return { tipo: 'erro', mensagem: 'Resposta inválida da Woovi ao criar assinatura.' };
  }
}

function obterBaseAlternativo(baseUrl: string) {
  if (!baseUrl.includes('api.woovi.com.br')) return null;
  const alternativo = baseUrl.replace('api.woovi.com.br', 'api.woovi.com');
  return alternativo === baseUrl ? null : alternativo;
}

async function requisitarWoovi(
  baseUrl: string,
  payloadWoovi: ReturnType<typeof montarPayloadWoovi>,
  retry = false,
): Promise<RetornoWoovi> {
  const url = `${baseUrl}/subscriptions`;
  console.log('[GLUCO:WOOVI]', { acao: retry ? 'assinatura_retry_url' : 'assinatura_url', url });
  const resposta = await fetch(url, {
    method: 'POST',
    headers: obterHeadersWoovi(),
    body: JSON.stringify(payloadWoovi),
  });
  return interpretarRespostaWoovi(resposta);
}

export { criarAssinaturaWoovi };

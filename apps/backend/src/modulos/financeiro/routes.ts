import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { checkoutPixAutomaticoSchema, webhookWooviSchema } from './schema.js';
import { criarAssinaturaWoovi } from './service.js';
import type { WebhookWooviPayload } from './types.js';

type JwtPayload = { clinicaId?: string };

function respostaValidacao(reply: FastifyReply, message: string, field?: unknown) {
  return reply.code(400).send({ error: 'VALIDATION_ERROR', message, field });
}

function respostaNaoAutorizado(reply: FastifyReply, message: string) {
  return reply.code(401).send({ error: 'AUTH_ERROR', message });
}

function respostaErro(reply: FastifyReply, message: string) {
  return reply.code(500).send({ error: 'INTERNAL_ERROR', message });
}

async function obterClinicaId(request: FastifyRequest) {
  const payload = (await request.jwtVerify()) as JwtPayload;
  return payload?.clinicaId ?? null;
}

const preHandlerPadrao = (app: FastifyInstance) => [
  app.autenticarJWT,
  app.exigirPerfil(['ADMINISTRADOR', 'PROFISSIONAL']),
];

async function financeiroRoutes(app: FastifyInstance) {
  app.post(
    '/financeiro/checkout/pix-automatico',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          console.log('[GLUCO:FINANCEIRO]', { acao: 'checkout_pix_automatico_token_invalido' });
          return respostaNaoAutorizado(reply, 'Token inválido.');
        }
        const resultado = checkoutPixAutomaticoSchema.safeParse(request.body);
        if (!resultado.success) {
          console.log('[GLUCO:FINANCEIRO]', {
            acao: 'checkout_pix_automatico_payload_invalido',
            issues: resultado.error.issues,
            payload: request.body,
          });
          return respostaValidacao(reply, 'Payload inválido.', resultado.error.issues[0]?.path[0]);
        }
        const payloadNormalizado = {
          ...resultado.data,
          endereco: resultado.data.endereco ?? undefined,
        };
        const assinatura = await criarAssinaturaWoovi(payloadNormalizado);
        return reply.send(assinatura);
      } catch (erro) {
        return respostaErro(reply, (erro as Error).message || 'Erro ao criar assinatura Woovi.');
      }
    },
  );

  app.post('/financeiro/checkout/pix-automatico-publico', async (request, reply) => {
    try {
      const resultado = checkoutPixAutomaticoSchema.safeParse(request.body);
      if (!resultado.success) {
        console.log('[GLUCO:FINANCEIRO]', {
          acao: 'checkout_pix_automatico_publico_payload_invalido',
          issues: resultado.error.issues,
          payload: request.body,
        });
        return respostaValidacao(reply, 'Payload inválido.', resultado.error.issues[0]?.path[0]);
      }
      console.log('[GLUCO:FINANCEIRO]', { acao: 'checkout_pix_automatico_publico' });
      const payloadNormalizado = {
        ...resultado.data,
        endereco: resultado.data.endereco ?? undefined,
      };
      const assinatura = await criarAssinaturaWoovi(payloadNormalizado);
      return reply.send(assinatura);
    } catch (erro) {
      return respostaErro(reply, (erro as Error).message || 'Erro ao criar assinatura Woovi.');
    }
  });

  app.post('/financeiro/webhook/woovi', async (request, reply) => {
    try {
      const resultado = webhookWooviSchema.safeParse(request.body);
      if (!resultado.success) {
        console.log('[GLUCO:FINANCEIRO]', {
          acao: 'webhook_woovi_payload_invalido',
          issues: resultado.error.issues,
          payload: request.body,
        });
        return respostaValidacao(reply, 'Payload inválido.', resultado.error.issues[0]?.path[0]);
      }
      const payload = resultado.data as WebhookWooviPayload;
      const evento = payload.event;
      console.log('[GLUCO:WOOVI]', {
        acao: 'webhook_recebido',
        evento,
        correlationID: payload.correlationID,
        paymentSubscriptionGlobalID: payload.paymentSubscriptionGlobalID,
      });
      return reply.send({ ok: true });
    } catch (erro) {
      return respostaErro(reply, (erro as Error).message || 'Erro ao processar webhook Woovi.');
    }
  });
}

export { financeiroRoutes };

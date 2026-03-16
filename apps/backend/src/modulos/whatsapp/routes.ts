import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../config/env.js';
import { webhookBodySchema, webhookQuerySchema } from './schema.js';
import { processarWebhook, verificarAssinatura } from './service.js';

type RawBodyRequest = FastifyRequest & { rawBody?: string };

function respostaValidacao(reply: FastifyReply, message: string, field?: unknown) {
  return reply.code(400).send({ error: 'VALIDATION_ERROR', message, field });
}

function respostaNaoAutorizado(reply: FastifyReply, message: string) {
  return reply.code(401).send({ error: 'AUTH_ERROR', message });
}

function respostaErro(reply: FastifyReply, message: string) {
  return reply.code(500).send({ error: 'INTERNAL_ERROR', message });
}

async function whatsappRoutes(app: FastifyInstance) {
  app.get('/whatsapp/webhook', async (request, reply) => {
    try {
      if (!env.WHATSAPP_VERIFY_TOKEN) {
        return respostaErro(reply, 'Configuração do WhatsApp ausente.');
      }
      const resultado = webhookQuerySchema.safeParse(request.query);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Parâmetros inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const modo = resultado.data['hub.mode'];
      const token = resultado.data['hub.verify_token'];
      const desafio = resultado.data['hub.challenge'];
      if (modo === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN && desafio) {
        return reply.code(200).send(desafio);
      }
      return respostaNaoAutorizado(reply, 'Verificação inválida.');
    } catch {
      return respostaErro(reply, 'Erro ao validar webhook.');
    }
  });

  app.post('/whatsapp/webhook', async (request, reply) => {
    try {
      if (!env.WHATSAPP_APP_SECRET) {
        return respostaErro(reply, 'Configuração do WhatsApp ausente.');
      }
      const rawBody = (request as RawBodyRequest).rawBody ?? '';
      const assinatura = request.headers['x-hub-signature-256'] as string | undefined;
      if (!verificarAssinatura(rawBody, assinatura)) {
        return respostaNaoAutorizado(reply, 'Assinatura inválida.');
      }
      const resultado = webhookBodySchema.safeParse(request.body);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Payload inválido.', resultado.error.issues[0]?.path[0]);
      }
      await processarWebhook(request.body as object);
      return reply.send({ ok: true });
    } catch {
      return respostaErro(reply, 'Erro ao processar webhook.');
    }
  });
}

export { whatsappRoutes };

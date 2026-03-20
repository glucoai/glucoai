import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../config/env.js';
import { configuracaoWhatsappSchema, webhookBodySchema, webhookQuerySchema } from './schema.js';
import {
  processarWebhook,
  verificarAssinatura,
  criarConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappPorNumeroService,
} from './service.js';

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

function respostaConflito(reply: FastifyReply, message: string) {
  return reply.code(409).send({ error: 'CONFLICT', message });
}

type JwtPayload = { clinicaId?: string };

async function obterClinicaId(request: FastifyRequest) {
  const payload = (await request.jwtVerify()) as JwtPayload;
  return payload?.clinicaId ?? null;
}

const preHandlerPadrao = (app: FastifyInstance) => [
  app.autenticarJWT,
  app.exigirPerfil(['ADMINISTRADOR', 'PROFISSIONAL']),
];

function detectarConflitoConfiguracao(erro: unknown) {
  const codigo = (erro as { code?: string })?.code;
  return codigo === 'P2002';
}

async function whatsappRoutes(app: FastifyInstance) {
  const verificarWebhookGet = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const resultado = webhookQuerySchema.safeParse(request.query);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Parâmetros inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const params = request.params as { idNumero?: string };
      const configuracao =
        params?.idNumero ? await obterConfiguracaoWhatsappPorNumeroService(params.idNumero) : null;
      const tokenEsperado = configuracao?.tokenVerificacao ?? env.WHATSAPP_VERIFY_TOKEN;
      if (!tokenEsperado) {
        return respostaErro(reply, 'Configuração do WhatsApp ausente.');
      }
      const modo = resultado.data['hub.mode'];
      const token = resultado.data['hub.verify_token'];
      const desafio = resultado.data['hub.challenge'];
      if (modo === 'subscribe' && token === tokenEsperado && desafio) {
        return reply.code(200).send(desafio);
      }
      return respostaNaoAutorizado(reply, 'Verificação inválida.');
    } catch {
      return respostaErro(reply, 'Erro ao validar webhook.');
    }
  };

  const processarWebhookPost = async (request: FastifyRequest, reply: FastifyReply) => {
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
  };

  app.get('/whatsapp/webhook', verificarWebhookGet);
  app.get('/whatsapp/webhook/:idNumero', verificarWebhookGet);

  app.post('/whatsapp/webhook', processarWebhookPost);
  app.post('/whatsapp/webhook/:idNumero', processarWebhookPost);

  app.get('/whatsapp/configuracoes', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const configuracao = await obterConfiguracaoWhatsappService(clinicaId);
      return reply.send({ configuracao });
    } catch {
      return respostaErro(reply, 'Erro ao buscar configuração do WhatsApp.');
    }
  });

  app.post('/whatsapp/configuracoes', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const resultado = configuracaoWhatsappSchema.safeParse(request.body);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Dados inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const configuracao = await criarConfiguracaoWhatsappService(clinicaId, resultado.data);
      return reply.code(201).send({ configuracao });
    } catch (erro) {
      if (detectarConflitoConfiguracao(erro)) {
        return respostaConflito(reply, 'Número já configurado para esta clínica.');
      }
      return respostaErro(reply, 'Erro ao criar configuração do WhatsApp.');
    }
  });
}

export { whatsappRoutes };

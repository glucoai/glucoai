import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import { autenticacaoRoutes } from './modulos/autenticacao/routes.js';
import { pacientesRoutes } from './modulos/pacientes/routes.js';
import { glicemiasRoutes } from './modulos/glicemias/routes.js';
import { painelRoutes } from './modulos/painel/routes.js';
import { whatsappRoutes } from './modulos/whatsapp/routes.js';
import { financeiroRoutes } from './modulos/financeiro/routes.js';
import { authPlugin } from './plugins/auth.js';
import { Sentry, enabled as sentryEnabled } from './infra/sentry.js';

async function buildApp() {
  const app = Fastify({ logger: true });

  app.addContentTypeParser('application/json', { parseAs: 'string' }, (request, body, done) => {
    try {
      const raw = typeof body === 'string' ? body : body.toString();
      (request as { rawBody?: string }).rawBody = raw;
      const data = raw ? JSON.parse(raw) : {};
      done(null, data);
    } catch (erro) {
      done(erro as Error, undefined);
    }
  });

  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.register(jwt, { secret: env.JWT_SEGREDO });
  app.register(autenticacaoRoutes);
  app.register(pacientesRoutes);
  app.register(glicemiasRoutes);
  app.register(painelRoutes);
  app.register(whatsappRoutes);
  app.register(financeiroRoutes);
  authPlugin(app);

  app.get('/saude', async () => {
    return { status: 'ok', versao: '1.0.0' };
  });

  if (sentryEnabled) {
    app.setErrorHandler((error, request, reply) => {
      Sentry.captureException(error);
      if (reply.sent) return;
      const statusCode = error.statusCode ?? 500;
      const payload =
        statusCode >= 500
          ? { error: 'INTERNAL_ERROR', message: 'Ocorreu um erro inesperado' }
          : { error: 'REQUEST_ERROR', message: error.message || 'Requisição inválida' };
      reply.status(statusCode).send(payload);
    });
  }

  return app;
}

export { buildApp };

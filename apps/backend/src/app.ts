import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './config/env';
import { autenticacaoRoutes } from './modulos/autenticacao/routes';
import { pacientesRoutes } from './modulos/pacientes/routes';
import { glicemiasRoutes } from './modulos/glicemias/routes';
import { painelRoutes } from './modulos/painel/routes';
import { whatsappRoutes } from './modulos/whatsapp/routes.js';
import { authPlugin } from './plugins/auth';

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
  authPlugin(app);

  app.get('/saude', async () => {
    return { status: 'ok', versao: '1.0.0' };
  });

  return app;
}

export { buildApp };

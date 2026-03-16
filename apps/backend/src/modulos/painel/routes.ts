import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { buscarAlertasCriticos, buscarEstatisticasPainel, buscarSerieGlicemia } from './service.js';

type JwtPayload = { clinicaId?: string };

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

async function painelRoutes(app: FastifyInstance) {
  app.get('/painel/estatisticas', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const dados = await buscarEstatisticasPainel(clinicaId);
      return reply.send(dados);
    } catch {
      return respostaErro(reply, 'Erro ao carregar estatísticas.');
    }
  });

  app.get('/painel/alertas', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const dados = await buscarAlertasCriticos(clinicaId);
      return reply.send({ alertas: dados });
    } catch {
      return respostaErro(reply, 'Erro ao carregar alertas.');
    }
  });

  app.get(
    '/painel/graficos/glicemia',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const serie = await buscarSerieGlicemia(clinicaId);
        return reply.send({ serie });
      } catch {
        return respostaErro(reply, 'Erro ao carregar gráfico de glicemia.');
      }
    },
  );
}

export { painelRoutes };

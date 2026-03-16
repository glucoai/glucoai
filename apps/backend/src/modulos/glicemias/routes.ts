import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { glicemiaCriarSchema, glicemiaParamsSchema, glicemiaQuerySchema } from './schema.js';
import {
  validarPaciente,
  listarGlicemiasService,
  criarGlicemiaService,
  obterEstatisticasService,
} from './service.js';

type JwtPayload = { clinicaId?: string };

function respostaValidacao(reply: FastifyReply, message: string, field?: unknown) {
  return reply.code(400).send({ error: 'VALIDATION_ERROR', message, field });
}

function respostaNaoEncontrado(reply: FastifyReply, message: string) {
  return reply.code(404).send({ error: 'NOT_FOUND', message });
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

async function glicemiasRoutes(app: FastifyInstance) {
  app.get(
    '/pacientes/:id/glicemias',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = glicemiaParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const query = glicemiaQuerySchema.safeParse(request.query);
        if (!query.success) {
          return respostaValidacao(reply, 'Filtros inválidos.', query.error.issues[0]?.path[0]);
        }
        const paciente = await validarPaciente(clinicaId, params.data.id);
        if (!paciente) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        const registros = await listarGlicemiasService(params.data.id, query.data);
        return reply.send({ registros, limite: query.data.limite });
      } catch {
        return respostaErro(reply, 'Erro ao listar glicemias.');
      }
    },
  );

  app.get(
    '/pacientes/:id/glicemias/estatisticas',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = glicemiaParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const query = glicemiaQuerySchema.safeParse(request.query);
        if (!query.success) {
          return respostaValidacao(reply, 'Filtros inválidos.', query.error.issues[0]?.path[0]);
        }
        const paciente = await validarPaciente(clinicaId, params.data.id);
        if (!paciente) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        const estatisticas = await obterEstatisticasService(params.data.id, query.data);
        return reply.send(estatisticas);
      } catch {
        return respostaErro(reply, 'Erro ao buscar estatísticas.');
      }
    },
  );

  app.post(
    '/pacientes/:id/glicemias',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = glicemiaParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const resultado = glicemiaCriarSchema.safeParse(request.body);
        if (!resultado.success) {
          return respostaValidacao(reply, 'Dados inválidos.', resultado.error.issues[0]?.path[0]);
        }
        const paciente = await validarPaciente(clinicaId, params.data.id);
        if (!paciente) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        const payload = {
          ...resultado.data,
          origem: resultado.data.origem ?? 'DASHBOARD',
        };
        const registro = await criarGlicemiaService(params.data.id, payload);
        return reply.code(201).send(registro);
      } catch {
        return respostaErro(reply, 'Erro ao registrar glicemia.');
      }
    },
  );
}

export { glicemiasRoutes };

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  pacienteAtualizarSchema,
  pacienteCriarSchema,
  pacienteParamsSchema,
  pacienteQuerySchema,
  mensagensQuerySchema,
  mensagemCriarSchema,
  heatmapQuerySchema,
  relatorioQuerySchema,
} from './schema.js';
import {
  listarPacientesService,
  obterPacienteDetalheService,
  criarPacienteService,
  atualizarPacienteService,
  desativarPacienteService,
  listarMensagensService,
  criarMensagemProfissionalService,
  obterHeatmapService,
  gerarRelatorioService,
} from './service.js';
import { enviarTextoWhatsApp } from '../whatsapp/service.js';

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

function respostaConflito(reply: FastifyReply, message: string) {
  return reply.code(409).send({ error: 'CONFLICT', message });
}

async function obterClinicaId(request: FastifyRequest) {
  const payload = (await request.jwtVerify()) as JwtPayload;
  return payload?.clinicaId ?? null;
}

function detectarConflitoTelefone(erro: unknown) {
  const codigo = (erro as { code?: string })?.code;
  return codigo === 'P2002';
}

const preHandlerPadrao = (app: FastifyInstance) => [
  app.autenticarJWT,
  app.exigirPerfil(['ADMINISTRADOR', 'PROFISSIONAL']),
];

async function pacientesRoutes(app: FastifyInstance) {
  app.get('/pacientes', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const resultado = pacienteQuerySchema.safeParse(request.query);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Filtros inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const dados = await listarPacientesService(clinicaId, resultado.data);
      return reply.send({ ...dados, pagina: resultado.data.pagina, limite: resultado.data.limite });
    } catch {
      return respostaErro(reply, 'Erro ao listar pacientes.');
    }
  });

  app.get('/pacientes/:id', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const params = pacienteParamsSchema.safeParse(request.params);
      if (!params.success) {
        return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
      }
      const paciente = await obterPacienteDetalheService(clinicaId, params.data.id);
      if (!paciente) {
        return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
      }
      return reply.send(paciente);
    } catch {
      return respostaErro(reply, 'Erro ao buscar paciente.');
    }
  });

  app.post('/pacientes', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const resultado = pacienteCriarSchema.safeParse(request.body);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Dados inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const paciente = await criarPacienteService(clinicaId, resultado.data);
      return reply.code(201).send(paciente);
    } catch (erro) {
      if (detectarConflitoTelefone(erro)) {
        return respostaConflito(reply, 'Telefone já cadastrado para esta clínica.');
      }
      return respostaErro(reply, 'Erro ao criar paciente.');
    }
  });

  app.put('/pacientes/:id', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const params = pacienteParamsSchema.safeParse(request.params);
      if (!params.success) {
        return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
      }
      const resultado = pacienteAtualizarSchema.safeParse(request.body);
      if (!resultado.success) {
        return respostaValidacao(reply, 'Dados inválidos.', resultado.error.issues[0]?.path[0]);
      }
      const paciente = await atualizarPacienteService(clinicaId, params.data.id, resultado.data);
      if (!paciente) {
        return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
      }
      return reply.send(paciente);
    } catch (erro) {
      if (detectarConflitoTelefone(erro)) {
        return respostaConflito(reply, 'Telefone já cadastrado para esta clínica.');
      }
      return respostaErro(reply, 'Erro ao atualizar paciente.');
    }
  });

  app.delete('/pacientes/:id', { preHandler: preHandlerPadrao(app) }, async (request, reply) => {
    try {
      const clinicaId = await obterClinicaId(request);
      if (!clinicaId) {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      const params = pacienteParamsSchema.safeParse(request.params);
      if (!params.success) {
        return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
      }
      const paciente = await desativarPacienteService(clinicaId, params.data.id);
      if (!paciente) {
        return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
      }
      return reply.send({ ok: true });
    } catch {
      return respostaErro(reply, 'Erro ao remover paciente.');
    }
  });

  app.get(
    '/pacientes/:id/mensagens',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = pacienteParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const query = mensagensQuerySchema.safeParse(request.query);
        if (!query.success) {
          return respostaValidacao(reply, 'Filtros inválidos.', query.error.issues[0]?.path[0]);
        }
        const dados = await listarMensagensService(
          clinicaId,
          params.data.id,
          query.data.pagina,
          query.data.limite,
        );
        if (!dados) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        return reply.send({
          ...dados,
          pagina: query.data.pagina,
          limite: query.data.limite,
        });
      } catch {
        return respostaErro(reply, 'Erro ao listar mensagens.');
      }
    },
  );

  app.post(
    '/pacientes/:id/mensagens',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = pacienteParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const body = mensagemCriarSchema.safeParse(request.body);
        if (!body.success) {
          return respostaValidacao(reply, 'Mensagem inválida.', body.error.issues[0]?.path[0]);
        }
        const resultado = await criarMensagemProfissionalService(
          clinicaId,
          params.data.id,
          body.data.conteudo,
        );
        if (!resultado) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        if (resultado.paciente.telefone) {
          await enviarTextoWhatsApp(resultado.paciente.telefone, body.data.conteudo);
        }
        return reply.code(201).send({ ok: true, mensagem: resultado.mensagem });
      } catch {
        return respostaErro(reply, 'Erro ao enviar mensagem.');
      }
    },
  );

  app.get(
    '/pacientes/:id/heatmap',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = pacienteParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const query = heatmapQuerySchema.safeParse(request.query);
        if (!query.success) {
          return respostaValidacao(reply, 'Filtros inválidos.', query.error.issues[0]?.path[0]);
        }
        const dias = await obterHeatmapService(clinicaId, params.data.id, query.data.meses);
        if (!dias) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        return reply.send({ dias });
      } catch {
        return respostaErro(reply, 'Erro ao carregar heatmap.');
      }
    },
  );

  app.get(
    '/pacientes/:id/relatorio',
    { preHandler: preHandlerPadrao(app) },
    async (request, reply) => {
      try {
        const clinicaId = await obterClinicaId(request);
        if (!clinicaId) {
          return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
        }
        const params = pacienteParamsSchema.safeParse(request.params);
        if (!params.success) {
          return respostaValidacao(reply, 'Paciente inválido.', params.error.issues[0]?.path[0]);
        }
        const query = relatorioQuerySchema.safeParse(request.query);
        if (!query.success) {
          return respostaValidacao(reply, 'Filtros inválidos.', query.error.issues[0]?.path[0]);
        }
        const relatorio = await gerarRelatorioService(
          clinicaId,
          params.data.id,
          query.data.de,
          query.data.ate,
        );
        if (!relatorio) {
          return respostaNaoEncontrado(reply, 'Paciente não encontrado.');
        }
        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', 'inline; filename="relatorio-paciente.pdf"');
        return reply.send(relatorio.pdf);
      } catch {
        return respostaErro(reply, 'Erro ao gerar relatório.');
      }
    },
  );
}

export { pacientesRoutes };

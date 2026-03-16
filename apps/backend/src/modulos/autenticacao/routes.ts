import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { entrarSchema, renovarSchema, sairSchema } from './schema.js';
import {
  buscarUsuarioPorEmail,
  validarSenha,
  gerarRefreshToken,
  salvarRefreshToken,
  removerRefreshToken,
  buscarUsuarioPorRefreshToken,
  registrarTentativa,
  limparTentativas,
} from './service.js';

type IpRequest = FastifyRequest & { ip: string };

type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMINISTRADOR' | 'PROFISSIONAL';
  clinicaId: string;
  senhaHash: string;
  ativo: boolean;
};

function respostaValidacao(reply: FastifyReply, message: string, field?: unknown) {
  return reply.code(400).send({
    error: 'VALIDATION_ERROR',
    message,
    field,
  });
}

function respostaNaoAutorizado(reply: FastifyReply, message: string) {
  return reply.code(401).send({
    error: 'AUTH_ERROR',
    message,
  });
}

async function criarToken(app: FastifyInstance, usuario: Usuario) {
  return app.jwt.sign(
    {
      usuarioId: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
      clinicaId: usuario.clinicaId,
    },
    { expiresIn: '15m' },
  );
}

function obterIp(request: FastifyRequest) {
  return (request as IpRequest).ip || 'desconhecido';
}

async function verificarLimite(ip: string, reply: FastifyReply) {
  const tentativas = await registrarTentativa(ip);
  if (tentativas > 10) {
    reply.code(429).send({
      error: 'RATE_LIMIT',
      message: 'Muitas tentativas. Tente novamente em 15 minutos.',
    });
    return false;
  }
  return true;
}

function validarEntradaLogin(request: FastifyRequest, reply: FastifyReply) {
  const resultado = entrarSchema.safeParse(request.body);
  if (!resultado.success) {
    respostaValidacao(
      reply,
      'Dados inválidos para login.',
      resultado.error.issues[0]?.path[0],
    );
    return null;
  }
  return resultado.data;
}

async function validarUsuarioLogin(email: string, senha: string, reply: FastifyReply) {
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario || !usuario.ativo) {
    respostaNaoAutorizado(reply, 'E-mail ou senha inválidos.');
    return null;
  }
  const senhaOk = await validarSenha(senha, usuario.senhaHash);
  if (!senhaOk) {
    respostaNaoAutorizado(reply, 'E-mail ou senha inválidos.');
    return null;
  }
  return usuario;
}

function montarRespostaLogin(usuario: Usuario, token: string, refreshToken: string) {
  return {
    token,
    refreshToken,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      clinicaId: usuario.clinicaId,
    },
  };
}

async function processarLogin(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const ip = obterIp(request);
  const liberado = await verificarLimite(ip, reply);
  if (!liberado) {
    return reply;
  }

  const dados = validarEntradaLogin(request, reply);
  if (!dados) {
    return reply;
  }

  const usuario = await validarUsuarioLogin(dados.email, dados.senha, reply);
  if (!usuario) {
    return reply;
  }

  await limparTentativas(ip);
  const token = await criarToken(app, usuario);
  const refreshToken = gerarRefreshToken();
  await salvarRefreshToken(refreshToken, usuario.id);

  return reply.send(montarRespostaLogin(usuario, token, refreshToken));
}

async function processarRenovacao(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resultado = renovarSchema.safeParse(request.body);
  if (!resultado.success) {
    return respostaValidacao(
      reply,
      'Refresh token inválido.',
      resultado.error.issues[0]?.path[0],
    );
  }

  const usuario = await buscarUsuarioPorRefreshToken(resultado.data.refreshToken);
  if (!usuario || !usuario.ativo) {
    return respostaNaoAutorizado(reply, 'Refresh token inválido.');
  }

  await removerRefreshToken(resultado.data.refreshToken);
  const novoRefreshToken = gerarRefreshToken();
  await salvarRefreshToken(novoRefreshToken, usuario.id);
  const token = await criarToken(app, usuario);

  return reply.send({ token, refreshToken: novoRefreshToken });
}

async function processarSaida(request: FastifyRequest, reply: FastifyReply) {
  const resultado = sairSchema.safeParse(request.body);
  if (!resultado.success) {
    return respostaValidacao(
      reply,
      'Refresh token inválido.',
      resultado.error.issues[0]?.path[0],
    );
  }

  await removerRefreshToken(resultado.data.refreshToken);
  return reply.send({ ok: true });
}

async function autenticacaoRoutes(app: FastifyInstance) {
  app.post('/autenticacao/entrar', async (request, reply) => {
    return processarLogin(app, request, reply);
  });

  app.post('/autenticacao/renovar', async (request, reply) => {
    return processarRenovacao(app, request, reply);
  });

  app.post('/autenticacao/sair', async (request, reply) => {
    return processarSaida(request, reply);
  });
}

export { autenticacaoRoutes };

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { entrarSchema, renovarSchema, sairSchema, esqueciSenhaSchema, redefinirSenhaSchema } from './schema.js';
import {
  buscarUsuarioPorEmail,
  validarSenha,
  gerarRefreshToken,
  salvarRefreshToken,
  removerRefreshToken,
  buscarUsuarioPorRefreshToken,
  registrarTentativa,
  limparTentativas,
  gerarTokenReset,
  salvarTokenReset,
  buscarUsuarioPorResetToken,
  removerTokenReset,
  atualizarSenha,
} from './service.js';
import { env } from '../../config/env.js';
import nodemailer from 'nodemailer';

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

async function enviarEmailRecuperacao(destinatario: string, link: string) {
  if (!env.SMTP_HOST || !env.SMTP_FROM) return;
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: env.SMTP_SECURE ?? false,
    tls: env.SMTP_IGNORE_TLS ? { rejectUnauthorized: false } : undefined,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
  });
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: destinatario,
    subject: 'Recuperação de senha — Gluco IA',
    text: [
      'Gluco IA',
      'Olá! Recebemos uma solicitação para redefinir sua senha.',
      `Link de recuperação: ${link}`,
      'Se você não solicitou, ignore este e-mail.',
    ].join('\n'),
    html: `
      <div style="background:#F5F7FA;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#4F4F4F;">
        <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E0E6ED;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(47,128,237,0.08);">
          <div style="padding:24px 28px;background:linear-gradient(135deg,#2F80ED 0%,#1A5CB8 100%);color:#FFFFFF;">
            <div style="font-size:18px;font-weight:700;letter-spacing:0.4px;">GLUCO IA</div>
            <div style="font-size:14px;opacity:0.9;margin-top:6px;">Tecnologia cuidando da sua glicemia</div>
          </div>
          <div style="padding:28px;">
            <div style="font-size:18px;font-weight:600;margin-bottom:8px;color:#1A5CB8;">Redefinição de senha</div>
            <div style="font-size:14px;line-height:1.6;margin-bottom:18px;">
              Recebemos uma solicitação para redefinir sua senha. Para continuar, clique no botão abaixo:
            </div>
            <div style="text-align:center;margin:20px 0;">
              <a href="${link}" style="display:inline-block;background:#2F80ED;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;">
                Redefinir senha
              </a>
            </div>
            <div style="font-size:13px;line-height:1.6;color:#4F4F4F;background:#F5F7FA;padding:12px 16px;border-radius:10px;border:1px solid #E0E6ED;">
              Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.
            </div>
            <div style="font-size:12px;color:#8A94A6;margin-top:16px;">
              Este link é válido por 1 hora.
            </div>
          </div>
          <div style="padding:18px 28px;border-top:1px solid #E0E6ED;font-size:12px;color:#8A94A6;background:#FFFFFF;">
            Gluco IA • Plataforma clínica com IA para acompanhamento de diabetes
          </div>
        </div>
      </div>
    `,
  });
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

async function processarEsqueciSenha(request: FastifyRequest, reply: FastifyReply) {
  const resultado = esqueciSenhaSchema.safeParse(request.body);
  if (!resultado.success) {
    return respostaValidacao(
      reply,
      'E-mail inválido.',
      resultado.error.issues[0]?.path[0],
    );
  }

  try {
    const usuario = await buscarUsuarioPorEmail(resultado.data.email);
    let resetLink: string | undefined;
    if (usuario && usuario.ativo) {
      const token = gerarTokenReset();
      await salvarTokenReset(token, usuario.id);
      if (env.FRONTEND_URL) {
        resetLink = `${env.FRONTEND_URL}/redefinir-senha?token=${token}`;
      }
      if (resetLink) {
        try {
          await enviarEmailRecuperacao(usuario.email, resetLink);
        } catch {
          return reply.send({
            ok: true,
            message: 'Se o e-mail estiver cadastrado, enviaremos um link de recuperação.',
          });
        }
      }
    }
    const payload = {
      ok: true,
      message: 'Se o e-mail estiver cadastrado, enviaremos um link de recuperação.',
      resetLink: env.RECUPERACAO_EXIBIR_LINK ? resetLink : undefined,
    };
    return reply.send(resetLink ? payload : { ok: payload.ok, message: payload.message });
  } catch {
    return reply.code(500).send({
      error: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro inesperado',
    });
  }
}

async function processarRedefinirSenha(request: FastifyRequest, reply: FastifyReply) {
  const resultado = redefinirSenhaSchema.safeParse(request.body);
  if (!resultado.success) {
    return respostaValidacao(
      reply,
      'Dados inválidos para redefinir senha.',
      resultado.error.issues[0]?.path[0],
    );
  }

  try {
    const usuario = await buscarUsuarioPorResetToken(resultado.data.token);
    if (!usuario || !usuario.ativo) {
      return respostaValidacao(reply, 'Token inválido ou expirado.', 'token');
    }
    await atualizarSenha(usuario.id, resultado.data.novaSenha);
    await removerTokenReset(resultado.data.token);
    return reply.send({ ok: true, message: 'Senha redefinida com sucesso.' });
  } catch {
    return reply.code(500).send({
      error: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro inesperado',
    });
  }
}

async function processarTesteEmail(request: FastifyRequest, reply: FastifyReply) {
  if (!env.SMTP_TESTE_HABILITADO) {
    return reply.code(403).send({
      error: 'FORBIDDEN',
      message: 'Teste de SMTP desabilitado.',
    });
  }
  const resultado = esqueciSenhaSchema.safeParse(request.body);
  if (!resultado.success) {
    return respostaValidacao(reply, 'E-mail inválido.', resultado.error.issues[0]?.path[0]);
  }
  if (!env.FRONTEND_URL) {
    return reply.code(400).send({
      error: 'VALIDATION_ERROR',
      message: 'FRONTEND_URL não configurado.',
      field: 'FRONTEND_URL',
    });
  }
  try {
    const tokenFake = 'teste-token-recuperacao';
    const link = `${env.FRONTEND_URL}/redefinir-senha?token=${tokenFake}`;
    await enviarEmailRecuperacao(resultado.data.email, link);
    return reply.send({
      ok: true,
      message: 'E-mail de teste enviado com sucesso.',
    });
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : 'Erro desconhecido';
    return reply.code(500).send({
      error: 'INTERNAL_ERROR',
      message: 'Falha ao enviar e-mail de teste.',
      detail: detalhe,
    });
  }
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

  app.post('/autenticacao/esqueci-senha', async (request, reply) => {
    return processarEsqueciSenha(request, reply);
  });

  app.post('/autenticacao/redefinir-senha', async (request, reply) => {
    return processarRedefinirSenha(request, reply);
  });

  app.post('/autenticacao/teste-email', async (request, reply) => {
    return processarTesteEmail(request, reply);
  });
}

export { autenticacaoRoutes };

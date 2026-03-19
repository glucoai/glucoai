import argon2 from 'argon2';
import { randomBytes, randomUUID } from 'crypto';
import { prisma } from '../../infra/prisma.js';
import { redis } from '../../infra/redis.js';

type UsuarioAuth = {
  id: string;
  email: string;
  perfil: 'ADMINISTRADOR' | 'PROFISSIONAL';
  clinicaId: string;
  nome: string;
  senhaHash: string;
  ativo: boolean;
};

async function buscarUsuarioPorEmail(email: string): Promise<UsuarioAuth | null> {
  return prisma.usuario.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      perfil: true,
      clinicaId: true,
      nome: true,
      senhaHash: true,
      ativo: true,
    },
  });
}

async function validarSenha(senha: string, senhaHash: string) {
  return argon2.verify(senhaHash, senha);
}

function gerarRefreshToken() {
  return randomUUID();
}

async function salvarRefreshToken(refreshToken: string, usuarioId: string) {
  const chave = `refresh:${refreshToken}`;
  await redis.set(chave, usuarioId, 'EX', 60 * 60 * 24 * 7);
}

async function removerRefreshToken(refreshToken: string) {
  const chave = `refresh:${refreshToken}`;
  await redis.del(chave);
}

async function buscarUsuarioPorRefreshToken(refreshToken: string) {
  const chave = `refresh:${refreshToken}`;
  const usuarioId = await redis.get(chave);
  if (!usuarioId) {
    return null;
  }
  return prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      email: true,
      perfil: true,
      clinicaId: true,
      nome: true,
      senhaHash: true,
      ativo: true,
    },
  });
}

async function registrarTentativa(ip: string) {
  const chave = `login_tentativas:${ip}`;
  const total = await redis.incr(chave);
  if (total === 1) {
    await redis.expire(chave, 60 * 15);
  }
  return total;
}

async function limparTentativas(ip: string) {
  const chave = `login_tentativas:${ip}`;
  await redis.del(chave);
}

function gerarTokenReset() {
  return randomBytes(32).toString('hex');
}

async function salvarTokenReset(token: string, usuarioId: string) {
  const chave = `reset:${token}`;
  await redis.set(chave, usuarioId, 'EX', 60 * 60);
}

async function buscarUsuarioPorResetToken(token: string) {
  const chave = `reset:${token}`;
  const usuarioId = await redis.get(chave);
  if (!usuarioId) {
    return null;
  }
  return prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      email: true,
      perfil: true,
      clinicaId: true,
      nome: true,
      senhaHash: true,
      ativo: true,
    },
  });
}

async function removerTokenReset(token: string) {
  const chave = `reset:${token}`;
  await redis.del(chave);
}

async function atualizarSenha(usuarioId: string, novaSenha: string) {
  const senhaHash = await argon2.hash(novaSenha);
  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { senhaHash },
  });
}

export {
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
};

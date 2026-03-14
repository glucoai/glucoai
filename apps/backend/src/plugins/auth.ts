import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type Perfil = 'ADMINISTRADOR' | 'PROFISSIONAL';

declare module 'fastify' {
  interface FastifyInstance {
    autenticarJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    exigirPerfil: (
      perfil: Perfil | Perfil[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

function authPlugin(app: FastifyInstance) {
  app.decorate('autenticarJWT', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
    }
  });

  app.decorate('exigirPerfil', (perfil: Perfil | Perfil[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const perfis = Array.isArray(perfil) ? perfil : [perfil];
      let payload: { perfil?: Perfil } | null = null;
      try {
        payload = (await request.jwtVerify()) as { perfil?: Perfil } | null;
      } catch {
        return reply.code(401).send({ error: 'AUTH_ERROR', message: 'Token inválido.' });
      }
      if (!payload?.perfil || !perfis.includes(payload.perfil)) {
        return reply.code(403).send({ error: 'FORBIDDEN', message: 'Acesso não autorizado.' });
      }
    };
  });
}

export { authPlugin };

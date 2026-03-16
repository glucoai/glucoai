import { buildApp } from './app.js';
import { env } from './config/env.js';

const iniciar = async () => {
  const app = await buildApp();
  try {
    await app.listen({ port: env.PORT ?? 3000, host: '0.0.0.0' });
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
};

iniciar();

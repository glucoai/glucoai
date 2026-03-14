import { z } from 'zod';

const entrarSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

const renovarSchema = z.object({
  refreshToken: z.string().min(10),
});

const sairSchema = z.object({
  refreshToken: z.string().min(10),
});

export { entrarSchema, renovarSchema, sairSchema };

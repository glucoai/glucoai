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

const esqueciSenhaSchema = z.object({
  email: z.string().email(),
});

const redefinirSenhaSchema = z
  .object({
    token: z.string().min(32),
    novaSenha: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Senha deve ter ao menos 1 letra maiúscula.')
      .regex(/[0-9]/, 'Senha deve ter ao menos 1 número.'),
    confirmarSenha: z.string().min(8),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarSenha'],
  });

export { entrarSchema, renovarSchema, sairSchema, esqueciSenhaSchema, redefinirSenhaSchema };

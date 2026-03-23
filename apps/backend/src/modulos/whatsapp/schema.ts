import { z } from 'zod';

const webhookQuerySchema = z
  .object({
    'hub.mode': z.string().optional(),
    'hub.verify_token': z.string().optional(),
    'hub.challenge': z.string().optional(),
  })
  .passthrough();

const webhookBodySchema = z
  .object({
    entry: z.array(z.unknown()).optional(),
  })
  .passthrough();

const configuracaoWhatsappSchema = z.object({
  idNumero: z.string().min(1),
  numeroExibicao: z.string().min(1),
  businessId: z.string().min(1),
  webhookUrl: z.string().url().refine((valor) => valor.includes('/whatsapp/webhook'), {
    message: 'Webhook inválido.',
  }),
  ativo: z.boolean().optional().default(true),
});

const configuracaoWhatsappParamsSchema = z.object({
  id: z.string().min(1),
});

export {
  webhookQuerySchema,
  webhookBodySchema,
  configuracaoWhatsappSchema,
  configuracaoWhatsappParamsSchema,
};

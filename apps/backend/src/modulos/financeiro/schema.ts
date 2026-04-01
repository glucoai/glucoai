import { z } from 'zod';

const enderecoCheckoutSchema = z.object({
  cep: z.string().min(8),
  rua: z.string().min(1),
  numero: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().min(2),
  complemento: z.string().optional().nullable(),
});

const checkoutPixAutomaticoSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(8),
  cpf: z.string().min(11),
  valor: z.coerce.number().positive(),
  comentario: z.string().optional().nullable(),
  diaGeracao: z.coerce.number().int().min(1).max(31),
  diaVencimento: z.coerce.number().int().min(1).max(31),
  endereco: enderecoCheckoutSchema.optional().nullable(),
  correlationId: z.string().optional().nullable(),
});

const webhookWooviSchema = z.object({
  event: z.string().min(1),
  correlationID: z.string().optional().nullable(),
  paymentSubscriptionGlobalID: z.string().optional().nullable(),
  globalID: z.string().optional().nullable(),
  pixRecurring: z
    .object({
      recurrencyId: z.string().optional().nullable(),
      status: z.string().optional().nullable(),
      journey: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export { checkoutPixAutomaticoSchema, webhookWooviSchema };

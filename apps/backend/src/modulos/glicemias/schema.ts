import { z } from 'zod';

const unidadeGlicemiaSchema = z.enum(['MG_DL', 'MMOL_L']);
const contextoGlicemiaSchema = z.enum([
  'JEJUM',
  'APOS_CAFE',
  'APOS_ALMOCO',
  'APOS_JANTA',
  'DORMIR',
  'OUTRO',
]);
const origemRegistroSchema = z.enum(['WHATSAPP', 'DASHBOARD', 'API']);

const glicemiaCriarSchema = z.object({
  valor: z.coerce.number().positive(),
  unidade: unidadeGlicemiaSchema.default('MG_DL'),
  contexto: contextoGlicemiaSchema,
  origem: origemRegistroSchema.optional(),
  notas: z.string().optional(),
});

const glicemiaQuerySchema = z.object({
  de: z.coerce.date().optional(),
  ate: z.coerce.date().optional(),
  limite: z.coerce.number().int().min(1).max(200).default(30),
});

const glicemiaParamsSchema = z.object({
  id: z.string().min(1),
});

export {
  glicemiaCriarSchema,
  glicemiaQuerySchema,
  glicemiaParamsSchema,
  unidadeGlicemiaSchema,
  contextoGlicemiaSchema,
  origemRegistroSchema,
};

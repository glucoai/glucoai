import { z } from 'zod';

const tipoDiabetesSchema = z.enum(['TIPO_1', 'TIPO_2', 'GESTACIONAL', 'PRE']);

const pacienteBaseSchema = z.object({
  nome: z.string().min(2),
  telefone: z.string().min(8),
  tipoDiabetes: tipoDiabetesSchema,
  dataNascimento: z.coerce.date().optional(),
  genero: z.string().optional(),
  cidade: z.string().optional(),
  pais: z.string().optional(),
  anosdiagnostico: z.coerce.number().int().optional(),
  medicamentos: z.string().optional(),
  metaGlicemicaMin: z.coerce.number().int().optional(),
  metaGlicemicaMax: z.coerce.number().int().optional(),
});

const pacienteCriarSchema = pacienteBaseSchema;
const pacienteAtualizarSchema = pacienteBaseSchema.partial();

const pacienteQuerySchema = z.object({
  busca: z.string().optional(),
  tipo: tipoDiabetesSchema.optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
});

const pacienteParamsSchema = z.object({
  id: z.string().min(1),
});

const mensagensQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
});

const mensagemCriarSchema = z.object({
  conteudo: z.string().min(1),
});

const heatmapQuerySchema = z.object({
  meses: z.coerce.number().int().min(1).max(12).default(3),
});

const relatorioQuerySchema = z.object({
  de: z.coerce.date().optional(),
  ate: z.coerce.date().optional(),
});

export {
  pacienteCriarSchema,
  pacienteAtualizarSchema,
  pacienteQuerySchema,
  pacienteParamsSchema,
  mensagensQuerySchema,
  mensagemCriarSchema,
  heatmapQuerySchema,
  relatorioQuerySchema,
  tipoDiabetesSchema,
};

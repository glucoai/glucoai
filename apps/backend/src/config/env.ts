import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

const caminhos = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/backend/.env'),
  path.resolve(process.cwd(), '../../.env'),
];

caminhos.forEach((caminho) => dotenv.config({ path: caminho }));

const optionalString = z.preprocess(
  (valor) => {
    if (typeof valor !== 'string') return undefined;
    const limpo = valor.trim();
    return limpo.length ? limpo : undefined;
  },
  z.string().min(1).optional(),
);

const optionalBoolean = z.preprocess((valor) => {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor !== 'string') return undefined;
  const limpo = valor.trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'sim'].includes(limpo)) return true;
  if (['false', '0', 'no', 'n', 'nao', 'não'].includes(limpo)) return false;
  return undefined;
}, z.boolean().optional());

const schema = z.object({
  PORT: z.coerce.number().int().positive().optional(),
  SENTRY_DSN: optionalString,
  SENTRY_ENVIRONMENT: optionalString,
  SENTRY_RELEASE: optionalString,
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).optional(),
  FRONTEND_URL: optionalString,
  RECUPERACAO_EXIBIR_LINK: z.coerce.boolean().optional(),
  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
  SMTP_FROM: optionalString,
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_TESTE_HABILITADO: z.coerce.boolean().optional(),
  SMTP_IGNORE_TLS: z.coerce.boolean().optional(),
  URL_BANCO: z.string().min(1),
  URL_REDIS: z.string().min(1),
  JWT_SEGREDO: z.string().min(32),
  WHATSAPP_TOKEN: optionalString,
  WHATSAPP_VERIFY_TOKEN: optionalString,
  WHATSAPP_APP_SECRET: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
  FLOW_ID: optionalString,
  FLOW01_ID: optionalString,
  FLOW02_ID: optionalString,
  FLOW03_ID: optionalString,
  FLOWTESTE_ID: optionalString,
  TESTEFLOW: optionalBoolean,
  WOOVI_API_URL: optionalString,
  WOOVI_API_KEY: optionalString,
});

const env = schema.parse({
  PORT: process.env.PORT,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  SENTRY_RELEASE: process.env.SENTRY_RELEASE,
  SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
  FRONTEND_URL: process.env.FRONTEND_URL,
  RECUPERACAO_EXIBIR_LINK: process.env.RECUPERACAO_EXIBIR_LINK,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_TESTE_HABILITADO: process.env.SMTP_TESTE_HABILITADO,
  SMTP_IGNORE_TLS: process.env.SMTP_IGNORE_TLS,
  URL_BANCO: process.env.URL_BANCO,
  URL_REDIS: process.env.URL_REDIS,
  JWT_SEGREDO: process.env.JWT_SEGREDO,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  FLOW_ID: process.env.FLOW_ID,
  FLOW01_ID: process.env.FLOW01_ID,
  FLOW02_ID: process.env.FLOW02_ID,
  FLOW03_ID: process.env.FLOW03_ID,
  FLOWTESTE_ID: process.env.FLOWTESTE_ID,
  TESTEFLOW: process.env.TESTEFLOW,
  WOOVI_API_URL: process.env.WOOVI_API_URL,
  WOOVI_API_KEY: process.env.WOOVI_API_KEY,
});

export { env };

import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

const caminhos = [
  path.resolve(process.cwd(), '.env'),
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

const schema = z.object({
  PORT: z.coerce.number().int().positive().optional(),
  URL_BANCO: z.string().min(1),
  URL_REDIS: z.string().min(1),
  JWT_SEGREDO: z.string().min(32),
  WHATSAPP_TOKEN: optionalString,
  WHATSAPP_VERIFY_TOKEN: optionalString,
  WHATSAPP_APP_SECRET: optionalString,
  WHATSAPP_PHONE_NUMBER_ID: optionalString,
});

const env = schema.parse({
  PORT: process.env.PORT,
  URL_BANCO: process.env.URL_BANCO,
  URL_REDIS: process.env.URL_REDIS,
  JWT_SEGREDO: process.env.JWT_SEGREDO,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
});

export { env };

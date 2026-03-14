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

export { webhookQuerySchema, webhookBodySchema };

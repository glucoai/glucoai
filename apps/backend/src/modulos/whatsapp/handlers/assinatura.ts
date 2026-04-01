import crypto from 'crypto';
import { env } from '../../../config/env.js';

function verificarAssinatura(rawBody: string, assinatura: string | undefined) {
  if (!assinatura || !env.WHATSAPP_APP_SECRET) {
    return false;
  }
  const hash = crypto
    .createHmac('sha256', env.WHATSAPP_APP_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');
  return assinatura === `sha256=${hash}`;
}

export { verificarAssinatura };

export { enviarTextoWhatsApp } from './client/index.js';
export { processarWebhook, processarWebhookComNumero } from './handlers/webhook.js';
export { verificarAssinatura } from './handlers/assinatura.js';
export {
  criarConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappPorNumeroService,
  excluirConfiguracaoWhatsappService,
} from './handlers/configuracao.js';

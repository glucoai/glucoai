import { salvarMensagem } from '../repository.js';
import { enviarBotoesWhatsApp, enviarTextoWhatsApp } from './whatsappApi.js';

async function enviarBotoesComRegistro(
  telefone: string,
  pacienteId: string,
  texto: string,
  botoes: { id: string; titulo: string }[],
  phoneNumberId?: string,
) {
  try {
    await enviarBotoesWhatsApp(telefone, texto, botoes, phoneNumberId);
  } catch (erro) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'falha_envio_botoes',
      telefone,
      pacienteId,
      erro: (erro as Error).message,
    });
    return;
  }
  try {
    await salvarMensagem({
      pacienteId,
      conteudo: texto,
      remetente: 'SISTEMA',
      tipo: 'TEMPLATE',
    });
  } catch (erro) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'falha_salvar_botoes',
      telefone,
      pacienteId,
      erro: (erro as Error).message,
    });
  }
}

async function enviarTextoComRegistro(
  telefone: string,
  pacienteId: string,
  texto: string,
  phoneNumberId?: string,
) {
  try {
    await enviarTextoWhatsApp(telefone, texto, phoneNumberId);
    await salvarMensagem({
      pacienteId,
      conteudo: texto,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
  } catch {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'falha_salvar_texto',
      telefone,
      pacienteId,
    });
    return;
  }
}

export { enviarBotoesComRegistro, enviarTextoComRegistro };

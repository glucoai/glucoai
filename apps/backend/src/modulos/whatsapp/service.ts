import crypto from 'crypto';
import { env } from '../../config/env';
import {
  buscarPacientePorTelefone,
  salvarMensagem,
  criarGlicemia,
  buscarUltimasGlicemias,
} from './repository';
import type { MensagemEntrada, RotaMensagem, WebhookPayload } from './types';

const menuMensagem =
  'Olá! Sou o assistente Gluco IA 🤖\n' +
  'Você pode:\n' +
  '📊 Enviar sua glicemia (ex: 120)\n' +
  '🍽️ Enviar foto da sua refeição para análise\n' +
  '📈 Digitar "histórico" para ver os últimos 7 dias\n' +
  '💊 Digitar "perfil" para ver suas informações';

function normalizarTelefone(telefone: string) {
  return telefone.replace(/\D/g, '');
}

function isNumero(texto: string) {
  const apenasDigitos = texto.replace(/\D/g, '');
  if (!apenasDigitos) {
    return false;
  }
  const valor = Number(apenasDigitos);
  return Number.isFinite(valor) && valor >= 30 && valor <= 600;
}

function extrairValorNumerico(texto: string) {
  const apenasDigitos = texto.replace(/\D/g, '');
  const valor = Number(apenasDigitos);
  if (!Number.isFinite(valor) || valor <= 0) {
    return null;
  }
  return valor;
}

function rotearMensagem(texto: string | undefined, tipo: MensagemEntrada['tipo']): RotaMensagem {
  if (tipo === 'image') {
    return 'FOTO_REFEICAO';
  }
  if (!texto) {
    return 'DESCONHECIDO';
  }
  const textoLimpo = texto.trim().toLowerCase();
  if (isNumero(textoLimpo)) {
    return 'LEITURA_GLICEMIA';
  }
  if (['oi', 'olá', 'ola', 'menu'].includes(textoLimpo)) {
    return 'MENU';
  }
  if (textoLimpo === 'histórico' || textoLimpo === 'historico') {
    return 'HISTORICO';
  }
  if (textoLimpo === 'perfil') {
    return 'PERFIL';
  }
  return 'DESCONHECIDO';
}

function extrairMensagens(payload: WebhookPayload): MensagemEntrada[] {
  const mensagens: MensagemEntrada[] = [];
  const entradas = payload.entry ?? [];
  for (const entry of entradas) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      const lista = change.value?.messages ?? [];
      for (const message of lista) {
        const tipo = message.type === 'text' ? 'text' : message.type === 'image' ? 'image' : 'unknown';
        if (!message.from) {
          continue;
        }
        mensagens.push({
          id: message.id ?? crypto.randomUUID(),
          telefone: message.from,
          tipo,
          texto: message.text?.body,
          imagemId: message.image?.id,
        });
      }
    }
  }
  return mensagens;
}

function verificarAssinatura(rawBody: string, assinatura: string | undefined) {
  if (!assinatura || !env.WHATSAPP_APP_SECRET) {
    return false;
  }
  const esperado = crypto
    .createHmac('sha256', env.WHATSAPP_APP_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');
  const assinaturaLimpa = assinatura.replace('sha256=', '');
  const esperadoBuffer = Buffer.from(esperado);
  const recebidoBuffer = Buffer.from(assinaturaLimpa);
  if (esperadoBuffer.length !== recebidoBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(esperadoBuffer, recebidoBuffer);
}

async function enviarTextoWhatsApp(telefone: string, texto: string) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  const url = `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'text',
          text: { body: texto },
        }),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        throw new Error(erroTexto);
      }
      return true;
    } catch (erro) {
      if (tentativa === 3) {
        throw erro;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
    }
  }
  return false;
}

function formatarTipoDiabetes(tipo: string) {
  if (tipo === 'TIPO_1') return 'Tipo 1';
  if (tipo === 'TIPO_2') return 'Tipo 2';
  if (tipo === 'GESTACIONAL') return 'Gestacional';
  if (tipo === 'PRE') return 'Pré-diabetes';
  return 'Não informado';
}

async function montarHistoricoMensagem(pacienteId: string) {
  const registros = await buscarUltimasGlicemias(pacienteId, 7);
  if (!registros.length) {
    return 'Ainda não encontrei registros de glicemia nos últimos 7 dias.';
  }
  const total = registros.reduce((soma, item) => soma + item.valor, 0);
  const media = Math.round(total / registros.length);
  const ultimo = registros[0];
  if (!ultimo) {
    return 'Ainda não encontrei registros de glicemia nos últimos 7 dias.';
  }
  return `Resumo dos últimos 7 dias:\n${registros.length} registros\nMédia: ${media} mg/dL\nÚltima: ${Math.round(ultimo.valor)} mg/dL`;
}

async function processarMensagem(mensagem: MensagemEntrada) {
  const telefone = normalizarTelefone(mensagem.telefone);
  const paciente = await buscarPacientePorTelefone(telefone);
  if (!paciente) {
    await enviarTextoWhatsApp(telefone, 'Não encontramos seu cadastro. Fale com sua clínica.');
    return;
  }

  if (mensagem.tipo === 'text' && mensagem.texto) {
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: mensagem.texto,
      remetente: 'PACIENTE',
      tipo: 'TEXTO',
    });
  }

  if (mensagem.tipo === 'image') {
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: mensagem.imagemId ? `imagem:${mensagem.imagemId}` : 'imagem',
      remetente: 'PACIENTE',
      tipo: 'IMAGEM',
    });
  }

  const rota = rotearMensagem(mensagem.texto, mensagem.tipo);
  if (rota === 'MENU') {
    await enviarTextoWhatsApp(telefone, menuMensagem);
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: menuMensagem,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
    return;
  }

  if (rota === 'HISTORICO') {
    const historico = await montarHistoricoMensagem(paciente.id);
    await enviarTextoWhatsApp(telefone, historico);
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: historico,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
    return;
  }

  if (rota === 'PERFIL') {
    const metaMin = paciente.metaGlicemicaMin ?? 70;
    const metaMax = paciente.metaGlicemicaMax ?? 140;
    const perfil = `Seu perfil:\n${paciente.nome}\nTipo: ${formatarTipoDiabetes(
      paciente.tipoDiabetes,
    )}\nMeta: ${metaMin}-${metaMax} mg/dL`;
    await enviarTextoWhatsApp(telefone, perfil);
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: perfil,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
    return;
  }

  if (rota === 'LEITURA_GLICEMIA' && mensagem.texto) {
    const valor = extrairValorNumerico(mensagem.texto);
    if (!valor) {
      await enviarTextoWhatsApp(telefone, 'Não consegui entender o valor da glicemia. Tente enviar apenas o número.');
      await salvarMensagem({
        pacienteId: paciente.id,
        conteudo: 'Não consegui entender o valor da glicemia. Tente enviar apenas o número.',
        remetente: 'SISTEMA',
        tipo: 'TEXTO',
      });
      return;
    }
    await criarGlicemia(paciente.id, valor);
    const resposta = `Glicemia de ${Math.round(valor)} mg/dL registrada! 📊\nAnalisando e em breve envio sua orientação... 🧠`;
    await enviarTextoWhatsApp(telefone, resposta);
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: resposta,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
    return;
  }

  if (rota === 'FOTO_REFEICAO') {
    const resposta = 'Foto recebida! 🍽️ Vou analisar e já te retorno com a orientação.';
    await enviarTextoWhatsApp(telefone, resposta);
    await salvarMensagem({
      pacienteId: paciente.id,
      conteudo: resposta,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
    return;
  }

  const fallback = 'Não entendi sua mensagem. Digite "menu" para ver as opções disponíveis.';
  await enviarTextoWhatsApp(telefone, fallback);
  await salvarMensagem({
    pacienteId: paciente.id,
    conteudo: fallback,
    remetente: 'SISTEMA',
    tipo: 'TEXTO',
  });
}

async function processarWebhook(payload: WebhookPayload) {
  const mensagens = extrairMensagens(payload);
  for (const mensagem of mensagens) {
    try {
      await processarMensagem(mensagem);
    } catch {
      continue;
    }
  }
}

export { processarWebhook, verificarAssinatura, enviarTextoWhatsApp };

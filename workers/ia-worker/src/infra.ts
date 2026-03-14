import path from 'path';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';

type Env = {
  URL_BANCO: string;
  URL_REDIS: string;
  OPENAI_CHAVE: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_ALERTA_NUMERO?: string;
};

const env = carregarEnv();
const prisma = new PrismaClient();
const redis = new Redis(env.URL_REDIS);
const limiteDiario = 20;

async function validarLimiteDiario(pacienteId: string) {
  try {
    const chave = `ia_diaria:${pacienteId}:${dataChave()}`;
    const total = await redis.incr(chave);
    if (total === 1) {
      await redis.expire(chave, 60 * 60 * 48);
    }
    return total <= limiteDiario;
  } catch (erro) {
    console.log('Erro ao validar limite diário.', erro);
    return true;
  }
}

async function criarMensagemIA(pacienteId: string, conteudo: string) {
  try {
    await prisma.mensagem.create({
      data: {
        pacienteId,
        conteudo,
        remetente: 'IA',
        tipo: 'TEXTO',
      },
    });
  } catch (erro) {
    console.log('Erro ao criar mensagem IA.', erro);
  }
}

async function criarMensagemSistema(pacienteId: string, conteudo: string) {
  try {
    await prisma.mensagem.create({
      data: {
        pacienteId,
        conteudo,
        remetente: 'SISTEMA',
        tipo: 'TEXTO',
      },
    });
  } catch (erro) {
    console.log('Erro ao criar mensagem do sistema.', erro);
  }
}

async function criarMensagemLimite(pacienteId: string) {
  try {
    await criarMensagemSistema(pacienteId, 'Limite diário atingido. Tente amanhã! 😊');
  } catch (erro) {
    console.log('Erro ao criar mensagem de limite.', erro);
  }
}

async function registrarAlertaCritico(pacienteId: string, glicemiaId: string, valor: number) {
  try {
    await redis.lpush(
      'alertas_criticos',
      JSON.stringify({ pacienteId, glicemiaId, valor, criadoEm: new Date().toISOString() }),
    );
  } catch (erro) {
    console.log('Erro ao registrar alerta crítico.', erro);
  }
}

async function baixarImagemBase64(url: string) {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error('Falha ao baixar imagem.');
    }
    const buffer = Buffer.from(await resposta.arrayBuffer());
    return buffer.toString('base64');
  } catch (erro) {
    console.log('Erro ao baixar imagem.', erro);
    return '';
  }
}

async function enviarTextoWhatsApp(telefone: string, texto: string) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    return false;
  }
  const url = `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
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
    console.log('Erro ao enviar WhatsApp.', erro);
    return false;
  }
}

async function enviarAlertaProfissional(texto: string) {
  if (!env.WHATSAPP_ALERTA_NUMERO) {
    return false;
  }
  return enviarTextoWhatsApp(env.WHATSAPP_ALERTA_NUMERO, texto);
}

function formatarData(data: Date) {
  return new Date(data).toLocaleString('pt-BR');
}

function normalizarLista(alimentos?: string[]) {
  return (alimentos ?? []).filter((item) => Boolean(item));
}

function dataChave() {
  return new Date().toISOString().slice(0, 10);
}

function carregarEnv(): Env {
  const caminhos = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../../.env'),
  ];
  caminhos.forEach((caminho) => dotenv.config({ path: caminho }));
  return {
    URL_BANCO: garantirEnv(process.env.URL_BANCO, 'URL_BANCO'),
    URL_REDIS: garantirEnv(process.env.URL_REDIS, 'URL_REDIS'),
    OPENAI_CHAVE: garantirEnv(process.env.OPENAI_CHAVE, 'OPENAI_CHAVE'),
    WHATSAPP_TOKEN: garantirEnvOpcional(process.env.WHATSAPP_TOKEN),
    WHATSAPP_PHONE_NUMBER_ID: garantirEnvOpcional(process.env.WHATSAPP_PHONE_NUMBER_ID),
    WHATSAPP_ALERTA_NUMERO: garantirEnvOpcional(process.env.WHATSAPP_ALERTA_NUMERO),
  };
}

function garantirEnv(valor: string | undefined, campo: string) {
  if (!valor) {
    throw new Error(`Variável de ambiente ausente: ${campo}`);
  }
  return valor;
}

function garantirEnvOpcional(valor: string | undefined) {
  if (!valor) {
    return undefined;
  }
  const limpo = valor.trim();
  return limpo.length ? limpo : undefined;
}

async function encerrar() {
  try {
    await prisma.$disconnect();
    redis.disconnect();
  } catch (erro) {
    console.log('Erro ao encerrar conexões.', erro);
  }
}

export {
  env,
  prisma,
  redis,
  limiteDiario,
  validarLimiteDiario,
  criarMensagemIA,
  criarMensagemSistema,
  criarMensagemLimite,
  registrarAlertaCritico,
  baixarImagemBase64,
  enviarTextoWhatsApp,
  enviarAlertaProfissional,
  normalizarLista,
  formatarData,
  encerrar,
};

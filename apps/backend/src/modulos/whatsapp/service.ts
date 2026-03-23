import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { env } from '../../config/env.js';
import {
  desativarPacienteWhatsapp,
  buscarPacientePorId,
  buscarPacientePorTelefone,
  salvarMensagem,
  criarGlicemia,
  buscarUltimasGlicemias,
  criarConfiguracaoWhatsapp,
  buscarConfiguracaoWhatsappPorClinica,
  buscarConfiguracaoWhatsappPorIdNumero,
  excluirConfiguracaoWhatsapp,
  atualizarPacienteOnboarding,
  criarPacienteWhatsapp,
} from './repository.js';
import type { MensagemEntrada, RotaMensagem, WebhookPayload } from './types.js';

const menuMensagem =
  'Olá! Sou o assistente Gluco IA 🤖\n' +
  'Você pode:\n' +
  '📊 Enviar sua glicemia (ex: 120)\n' +
  '🍽️ Enviar foto da sua refeição para análise\n' +
  '📈 Digitar "histórico" para ver os últimos 7 dias\n' +
  '💊 Digitar "perfil" para ver suas informações';

type PacienteOnboarding = {
  id: string;
  nome: string;
  telefone: string;
  tipoDiabetes: string;
  metaGlicemicaMin: number | null;
  metaGlicemicaMax: number | null;
  ultimaGlicemia?: number | null;
  pesoKg?: number | null;
  alturaCm?: number | null;
  onboardingStatus?: string | null;
  onboardingEtapa?: string | null;
  onboardingDados?: unknown | null;
  riscoEscala?: string | null;
};

type ConfiguracaoWhatsappMin = {
  clinicaId: string;
  idNumero: string;
};

const gatilhosFlow = [
  'oi',
  'olá',
  'ola',
  'oii',
  'hello',
  'hi',
  'começar',
  'comecar',
  'start',
  'quero',
  'cadastro',
  'cadastrar',
];

const botoesTermosAnalise = [
  { id: 'TERMO_CONCORDAR', titulo: 'Concordar' },
  { id: 'TERMO_DISCORDAR', titulo: 'Discordar' },
];

const botoesRecuperacaoTermos = [
  { id: 'TERMO_CONCORDAR_RETORNO', titulo: 'Concordar Termos' },
  { id: 'TERMO_EXCLUIR_CADASTRO', titulo: 'Excluir Cadastro' },
];

function normalizarTelefone(telefone: string) {
  return telefone.replace(/\D/g, '');
}

function detectarConflitoPrisma(erro: unknown) {
  const codigo = (erro as { code?: string })?.code;
  return codigo === 'P2002';
}

async function obterConfiguracaoWhatsapp(idNumero?: string) {
  if (!idNumero) {
    return null;
  }
  const configuracao = (await buscarConfiguracaoWhatsappPorIdNumero(
    idNumero,
  )) as ConfiguracaoWhatsappMin | null;
  return configuracao;
}

function mapearGeneroFlow(valor: unknown) {
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['masculino', 'm'].includes(texto)) return 'Masculino';
  if (['feminino', 'f'].includes(texto)) return 'Feminino';
  if (['outro'].includes(texto)) return 'Outro';
  if (['nao_informar', 'nao informar', 'prefiro nao informar', 'prefiro não informar'].includes(texto)) {
    return 'Prefiro não informar';
  }
  return valor;
}

function mapearTipoDiabetesFlow(valor: unknown) {
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['tipo1', 'tipo_1', 'tipo 1'].includes(texto)) return 'TIPO_1';
  if (['tipo2', 'tipo_2', 'tipo 2'].includes(texto)) return 'TIPO_2';
  if (['gestacional'].includes(texto)) return 'GESTACIONAL';
  if (['pre', 'pré', 'pre_diabetes', 'pre diabetes', 'pré-diabetes'].includes(texto)) return 'PRE';
  return null;
}

function obterPrimeiroNome(nome?: string) {
  if (!nome) return 'por aqui';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'por aqui';
}

function classificarImc(imc: number) {
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}

function formatarRiscoTexto(risco?: string | null) {
  if (!risco) return 'médio';
  const texto = risco.toLowerCase();
  if (texto.includes('alto')) return 'alto';
  if (texto.includes('baixo')) return 'baixo';
  return 'médio';
}

function montarFraseRisco(risco: string) {
  if (risco === 'alto') {
    return 'Se continuar assim, sua glicemia pode se desregular com mais facilidade.';
  }
  if (risco === 'baixo') {
    return 'Você ainda está em uma zona de segurança, mas precisa manter constância.';
  }
  return 'Você já mostra sinais de alerta e precisa ajustar a rotina para evitar piora.';
}

function montarDadosAnalise(paciente: PacienteOnboarding) {
  const primeiroNome = obterPrimeiroNome(paciente.nome);
  const imc =
    typeof paciente.pesoKg === 'number' && typeof paciente.alturaCm === 'number'
      ? Number((paciente.pesoKg / Math.pow(paciente.alturaCm / 100, 2)).toFixed(1))
      : null;
  const classificacaoImc = imc ? classificarImc(imc) : 'Não informado';
  const riscoTexto = formatarRiscoTexto(paciente.riscoEscala);
  const fraseRisco = montarFraseRisco(riscoTexto);
  return { primeiroNome, imc, classificacaoImc, riscoTexto, fraseRisco };
}

async function enviarAnalisePosFlow(
  telefone: string,
  paciente: PacienteOnboarding,
  phoneNumberId?: string,
) {
  const { primeiroNome, imc, classificacaoImc, riscoTexto, fraseRisco } = montarDadosAnalise(paciente);
  await new Promise((resolve) => setTimeout(resolve, 16000));
  const mensagemValor =
    `*${primeiroNome}*, analisei seu perfil… e vou ser direto com você 👇\n\n` +
    '🧬 Seu corpo já está mostrando sinais importantes\n' +
    `📊 *Seu IMC*: ${imc ?? 'Não informado'}\n` +
    `*Classificação*: ${classificacaoImc}\n` +
    `⚠️*Risco Metabólico*: ${riscoTexto}\n\n` +
    '👉 *Isso significa que*:\n' +
    `${fraseRisco}\n\n` +
    '🔥 *Mas a boa notícia é*:\n' +
    'Você está no momento PERFEITO para controlar isso...';
  await enviarTextoComRegistro(telefone, paciente.id, mensagemValor, phoneNumberId);
  await new Promise((resolve) => setTimeout(resolve, 3500));
  const mensagemPosicionamento =
    `Agora vem a parte mais importante, *${primeiroNome}*…\n\n` +
    'A partir de hoje eu vou:\n' +
    '✅ Analisar suas refeições 🍽️\n' +
    '✅ Prever impacto na glicemia 📈\n' +
    '✅ Te ajudar a evitar picos 🚫\n' +
    '✅ E te guiar até o controle real\n\n' +
    '“Nos próximos 7 dias eu vou acompanhar você de perto… e você vai ver sua glicemia começar a responder 👀”\n\n' +
    '1️⃣ Me envie a foto da sua próxima refeição\n' +
    '2️⃣ Ou me envie sua glicemia atual\n\n' +
    '👉 E eu te mostro exatamente o que fazer a partir de agora.';
  await enviarTextoComRegistro(telefone, paciente.id, mensagemPosicionamento, phoneNumberId);
}

async function enviarBotoesWhatsApp(
  telefone: string,
  texto: string,
  botoes: { id: string; titulo: string }[],
  phoneNumberId?: string,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'enviar_botoes',
    telefone,
    botoes: botoes.map((botao) => botao.id),
    phoneNumberId: numeroId,
  });
  const url = `https://graph.facebook.com/v20.0/${numeroId}/messages`;
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
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: texto },
            action: {
              buttons: botoes.map((botao) => ({
                type: 'reply',
                reply: { id: botao.id, title: botao.titulo },
              })),
            },
          },
        }),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_botoes',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'botoes_enviados', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_botoes',
        telefone,
        tentativa,
        erro: (erro as Error).message,
      });
      if (tentativa === 3) {
        throw erro;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
    }
  }
  return false;
}

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

async function processarRespostaFlow(
  telefone: string,
  pacienteId: string,
  responseJson: string,
  phoneNumberId?: string,
) {
  let dadosFlow: Record<string, unknown> | null = null;
  try {
    dadosFlow = JSON.parse(responseJson) as Record<string, unknown>;
  } catch {
    console.log('[GLUCO:WHATSAPP]', { acao: 'flow_json_invalido', telefone });
    return;
  }
  const existente = await buscarPacientePorId(pacienteId);
  const dadosExistentes =
    existente?.onboardingDados && typeof existente.onboardingDados === 'object'
      ? (existente.onboardingDados as Record<string, unknown>)
      : null;
  const termosJaEnviados = dadosExistentes?._termoAnaliseEnviado === true;
  const nome = obterValorPorChaves(dadosFlow, ['nome', 'name', 'nome_completo', 'nomeCompleto']);
  const generoBruto = obterValorPorChaves(dadosFlow, ['sexo', 'genero', 'gênero']);
  const genero = mapearGeneroFlow(generoBruto);
  const email = obterValorPorChaves(dadosFlow, ['email', 'e-mail']);
  const tipoDiabetesFlow = mapearTipoDiabetesFlow(
    obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']),
  );
  const dataNascimentoValor = obterValorPorChaves(dadosFlow, [
    'data_nascimento',
    'dataNascimento',
    'nascimento',
  ]);
  const paisValor = obterValorPorChaves(dadosFlow, ['pais', 'país', 'country']);
  const anosDiagnosticoValor = obterValorPorChaves(dadosFlow, [
    'anos_diabetes',
    'anosDiagnostico',
    'anos_diagnostico',
  ]);
  const idadeValor = obterValorPorChaves(dadosFlow, ['idade', 'age']);
  const alturaValor = obterValorPorChaves(dadosFlow, ['altura', 'altura_cm', 'alturaCm']);
  const pesoValor = obterValorPorChaves(dadosFlow, ['peso', 'peso_kg', 'pesoKg']);
  const glicemiaValor = obterValorPorChaves(dadosFlow, [
    'ultima_glicemia',
    'ultimaglicemia',
    'glicemia',
    'pico_glicemia',
  ]);
  const sintomasValor = obterValorPorChaves(dadosFlow, [
    'sintomas',
    'complicacoes',
    'sintomasComplicacoes',
  ]);
  const emergenciaValor = obterValorPorChaves(dadosFlow, ['emergencia', 'emergência']);
  const termosValor = obterValorPorChaves(dadosFlow, ['termos', 'termos_aceitos', 'aceite_termos']);
  const idade = parsearNumero(idadeValor);
  const alturaCm = alturaValor ? extrairAlturaCm(String(alturaValor)) : null;
  const pesoKg = pesoValor ? extrairPesoKg(String(pesoValor)) : null;
  const glicemiaTexto = typeof glicemiaValor === 'string' ? glicemiaValor : '';
  const glicemiaNumeros = glicemiaTexto.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  const ultimaGlicemia =
    glicemiaNumeros.length > 0 ? Math.max(...glicemiaNumeros) : parsearNumero(glicemiaValor);
  const sintomasArray = Array.isArray(sintomasValor) ? sintomasValor : null;
  const sintomasComplicacoes =
    sintomasArray && sintomasArray.length
      ? true
      : parsearBooleano(sintomasValor) ?? parsearBooleano(emergenciaValor);
  const termosAceitos = parsearBooleano(termosValor);
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const anosDiagnostico = parsearAnosDiagnostico(anosDiagnosticoValor);
  const idadeCalculada =
    !idade && dataNascimento ? calcularIdade(dataNascimento) : (idade ?? null);
  const risco =
    typeof ultimaGlicemia === 'number' && typeof sintomasComplicacoes === 'boolean'
      ? calcularEscalaRisco(ultimaGlicemia, sintomasComplicacoes)
      : null;
  const macros = typeof pesoKg === 'number' ? calcularMacrosDiarios(pesoKg) : null;
  const primeiroNome = obterPrimeiroNome(typeof nome === 'string' ? nome : undefined);
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  await atualizarPacienteOnboarding(pacienteId, {
    nome: typeof nome === 'string' ? nome.trim() : undefined,
    genero: typeof genero === 'string' ? genero : undefined,
    email: typeof email === 'string' ? email : undefined,
    tipoDiabetes: tipoDiabetesFlow ?? undefined,
    dataNascimento: dataNascimento ?? undefined,
    idade: typeof idadeCalculada === 'number' ? Math.round(idadeCalculada) : undefined,
    alturaCm: typeof alturaCm === 'number' ? alturaCm : undefined,
    pesoKg: typeof pesoKg === 'number' ? pesoKg : undefined,
    ultimaGlicemia: typeof ultimaGlicemia === 'number' ? Math.round(ultimaGlicemia) : undefined,
    sintomasComplicacoes: typeof sintomasComplicacoes === 'boolean' ? sintomasComplicacoes : undefined,
    termosAceitos: typeof termosAceitos === 'boolean' ? termosAceitos : undefined,
    riscoEscala: risco ?? undefined,
    macrosDiarios: macros ?? undefined,
    pais: typeof paisValor === 'string' ? paisValor : undefined,
    anosdiagnostico: typeof anosDiagnostico === 'number' ? anosDiagnostico : undefined,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'TERMO_ANALISE_PENDENTE',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  console.log('[GLUCO:WHATSAPP]', { acao: 'flow_processado', telefone, pacienteId });
  if (termosJaEnviados) {
    return;
  }
  const mensagemFechamento =
    '🎉 Pronto ' +
    `*${primeiroNome}*! Missão concluída!\n\n` +
    'Você desbloqueou seu *Perfil Metabólico Inicial* 🧬\n\n' +
    'Agora deixa comigo que vou analisar tudo aqui… 👇';
  await enviarTextoComRegistro(telefone, pacienteId, mensagemFechamento, phoneNumberId);
  const mensagemTermos =
    `*${primeiroNome}* Seja bem-vindo ao Gluco IA.\n\n` +
    'Estou analisando seu perfil por aqui. Antes de poder te enviar o resultado, preciso que você concorde com os termos de uso da nossa plataforma.\n\n' +
    'Nossos termos de uso estão disponíveis em: https://glucoia.com/termos-de-uso\n\n' +
    'Certifique-se de que leu, e toque em uma das opções abaixo.';
  await enviarBotoesComRegistro(telefone, pacienteId, mensagemTermos, botoesTermosAnalise, phoneNumberId);
  const dadosComFlag = {
    ...(onboardingDadosAtualizados ?? {}),
    _termoAnaliseEnviado: true,
  };
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingDados: dadosComFlag as Prisma.InputJsonValue,
  });
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
        const tipo =
          message.type === 'text'
            ? 'text'
            : message.type === 'image'
              ? 'image'
              : message.type === 'interactive'
                ? 'interactive'
                : 'unknown';
        const textoInterativo =
          message.interactive?.button_reply?.title ??
          message.interactive?.button_reply?.id ??
          message.interactive?.list_reply?.title ??
          message.interactive?.list_reply?.id;
        const flowJson = message.interactive?.nfm_reply?.response_json;
        if (!message.from) {
          continue;
        }
        mensagens.push({
          id: message.id ?? crypto.randomUUID(),
          telefone: message.from,
          tipo,
          texto: message.text?.body ?? textoInterativo,
          imagemId: message.image?.id,
          interactiveTipo: message.interactive?.type,
          flowResponseJson: flowJson,
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

async function enviarTextoWhatsApp(
  telefone: string,
  texto: string,
  phoneNumberId?: string,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'enviar_texto',
    telefone,
    tamanho: texto.length,
    phoneNumberId: numeroId,
  });
  const url = `https://graph.facebook.com/v20.0/${numeroId}/messages`;
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
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_texto',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'texto_enviado', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_texto',
        telefone,
        tentativa,
        erro: (erro as Error).message,
      });
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

function normalizarTexto(texto?: string) {
  return (texto ?? '').trim();
}

function normalizarResposta(texto?: string) {
  return normalizarTexto(texto).toLowerCase();
}

function normalizarChave(chave: string) {
  return chave
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function obterValorPorChaves(dados: Record<string, unknown>, chaves: string[]) {
  const alvos = new Set(chaves.map(normalizarChave));
  for (const [chave, valor] of Object.entries(dados)) {
    if (alvos.has(normalizarChave(chave))) {
      return valor;
    }
  }
  return undefined;
}

function parsearBooleano(valor: unknown) {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor === 'number') return valor === 1;
  if (typeof valor !== 'string') return null;
  const texto = normalizarResposta(valor);
  if (['sim', 's', 'true', '1'].includes(texto)) return true;
  if (['nao', 'não', 'n', 'false', '0'].includes(texto)) return false;
  return null;
}

function parsearNumero(valor: unknown) {
  if (typeof valor === 'number') return valor;
  if (typeof valor !== 'string') return null;
  return extrairNumeroDecimal(valor);
}

function parsearAnosDiagnostico(valor: unknown) {
  if (typeof valor === 'number') return Math.round(valor);
  if (typeof valor !== 'string') return null;
  const numeros = valor.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  if (!numeros.length) return null;
  return Math.max(...numeros);
}

function parsearDataNascimento(valor: unknown) {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : valor;
  }
  if (typeof valor !== 'string') return null;
  const texto = valor.trim();
  if (!texto) return null;
  const br = texto.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (br) {
    const dia = Number(br[1]);
    const mes = Number(br[2]);
    const ano = Number(br[3]);
    const data = new Date(ano, mes - 1, dia);
    if (!Number.isNaN(data.getTime())) return data;
  }
  const dataIso = new Date(texto);
  if (!Number.isNaN(dataIso.getTime())) return dataIso;
  return null;
}

function calcularIdade(dataNascimento: Date) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade -= 1;
  }
  return idade;
}

function extrairNumeroDecimal(texto: string) {
  const normalizado = texto.replace(',', '.');
  const match = normalizado.match(/[\d.]+/);
  if (!match) {
    return null;
  }
  const valor = Number(match[0]);
  if (!Number.isFinite(valor)) {
    return null;
  }
  return valor;
}

function extrairAlturaCm(texto: string) {
  const valor = extrairNumeroDecimal(texto);
  if (!valor) {
    return null;
  }
  if (valor <= 3) {
    return Math.round(valor * 100);
  }
  return Math.round(valor);
}

function extrairPesoKg(texto: string) {
  const valor = extrairNumeroDecimal(texto);
  if (!valor) {
    return null;
  }
  return Math.round(valor * 10) / 10;
}

function calcularMacrosDiarios(pesoKg: number) {
  return {
    proteina: Math.round(pesoKg * 1.6),
    carboidratos: Math.round(pesoKg * 3),
    gorduras: Math.round(pesoKg * 0.8),
  };
}

function calcularEscalaRisco(ultimaGlicemia: number, sintomasComplicacoes: boolean) {
  if (sintomasComplicacoes || ultimaGlicemia >= 250) {
    return 'ALTO';
  }
  if (ultimaGlicemia >= 180) {
    return 'MODERADO';
  }
  return 'BAIXO';
}

async function registrarMensagemPaciente(pacienteId: string, mensagem: MensagemEntrada) {
  try {
    if (mensagem.tipo === 'image') {
      await salvarMensagem({
        pacienteId,
        conteudo: mensagem.imagemId ? `imagem:${mensagem.imagemId}` : 'imagem',
        remetente: 'PACIENTE',
        tipo: 'IMAGEM',
      });
      return;
    }
    if (mensagem.texto) {
      await salvarMensagem({
        pacienteId,
        conteudo: mensagem.texto,
        remetente: 'PACIENTE',
        tipo: 'TEXTO',
      });
    }
  } catch {
    return;
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

function criarFlowToken(numero: string) {
  const data = Date.now();
  return `onboarding_${numero}_${data}`;
}

async function enviarFlowDireto(telefone: string, phoneNumberId?: string) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId || !env.FLOW_ID) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  console.log('[GLUCO:WHATSAPP]', { acao: 'enviar_flow', telefone, flowId: env.FLOW_ID, phoneNumberId: numeroId });
  const url = `https://graph.facebook.com/v19.0/${numeroId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: telefone,
    type: 'interactive',
    interactive: {
      type: 'flow',
      header: { type: 'text', text: '🧬 Gluco IA' },
      body: {
        text:
          'Olá! 👋😄\n\n' +
          'Eu sou o Gluco IA, seu novo parceiro para:\n\n' +
          '✅ Controlar sua glicemia\n' +
          '✅ Montar refeições anti-diabetes\n' +
          '✅ Evitar complicações 😅\n\n' +
          '👉 Vamos montar seu perfil? Leva menos de 1 minuto ⏱️',
      },
      footer: { text: 'Powered by Gluco IA 🧬' },
      action: {
        name: 'flow',
        parameters: {
          flow_message_version: '3',
          flow_token: criarFlowToken(telefone),
          flow_id: env.FLOW_ID,
          flow_cta: 'Começar agora',
          flow_action: 'navigate',
          flow_action_payload: { screen: 'BREAK_PATTERN' },
        },
      },
    },
  };
  for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log('[GLUCO:WHATSAPP]', {
          acao: 'erro_enviar_flow',
          telefone,
          status: resposta.status,
          erro: erroTexto,
        });
        throw new Error(erroTexto);
      }
      console.log('[GLUCO:WHATSAPP]', { acao: 'flow_enviado', telefone, status: resposta.status });
      return true;
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'falha_enviar_flow',
        telefone,
        tentativa,
        erro: (erro as Error).message,
      });
      if (tentativa === 3) {
        throw erro;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
    }
  }
  return false;
}

async function garantirPaciente(
  telefone: string,
  idNumero: string | undefined,
  configuracao?: ConfiguracaoWhatsappMin | null,
) {
  const existente = (await buscarPacientePorTelefone(telefone)) as PacienteOnboarding | null;
  if (existente) {
    return existente;
  }
  if (!idNumero) {
    return null;
  }
  const config = configuracao ?? (await obterConfiguracaoWhatsapp(idNumero));
  if (!config) {
    return null;
  }
  try {
    const criado = await criarPacienteWhatsapp({
      clinicaId: config.clinicaId,
      telefone,
      nome: 'Paciente WhatsApp',
      tipoDiabetes: 'TIPO_2',
    });
    console.log('[GLUCO:WHATSAPP]', { acao: 'criar_paciente', telefone, pacienteId: criado.id });
    return criado as PacienteOnboarding;
  } catch (erro) {
    if (detectarConflitoPrisma(erro)) {
      return (await buscarPacientePorTelefone(telefone)) as PacienteOnboarding | null;
    }
    console.log('[GLUCO:WHATSAPP]', { acao: 'erro_criar_paciente', telefone });
    return null;
  }
}

async function processarMensagem(mensagem: MensagemEntrada, idNumero?: string) {
  try {
    const telefone = normalizarTelefone(mensagem.telefone);
    console.log('[GLUCO:WHATSAPP]', { acao: 'mensagem_recebida', telefone, tipo: mensagem.tipo });
    const configuracao = await obterConfiguracaoWhatsapp(idNumero);
    if (idNumero && !configuracao) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'config_nao_encontrada', idNumero });
      return;
    }
    const phoneNumberId = configuracao?.idNumero ?? env.WHATSAPP_PHONE_NUMBER_ID;
    if (!phoneNumberId) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'phone_number_id_ausente', idNumero });
      return;
    }
    console.log('[GLUCO:WHATSAPP]', { acao: 'config_resolvida', phoneNumberId });
    const paciente = await garantirPaciente(telefone, idNumero, configuracao);
    if (!paciente) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'paciente_nao_encontrado', telefone, idNumero });
      await enviarTextoWhatsApp(
        telefone,
        'Não consegui iniciar seu cadastro no momento. Por favor, tente novamente em alguns minutos.',
        phoneNumberId,
      );
      return;
    }
    await registrarMensagemPaciente(paciente.id, mensagem);
    if (mensagem.tipo === 'interactive' && mensagem.flowResponseJson) {
      await processarRespostaFlow(
        telefone,
        paciente.id,
        mensagem.flowResponseJson,
        phoneNumberId,
      );
      return;
    }
    if (paciente.onboardingEtapa === 'TERMO_ANALISE_PENDENTE' || paciente.onboardingEtapa === 'TERMO_ANALISE_RECUSADO') {
      const resposta = normalizarResposta(mensagem.texto);
      if (['termo_concordar', 'concordar', 'concordar termos', 'termo_concordar_retorno'].includes(resposta)) {
        const dadosExistentes =
          paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
            ? (paciente.onboardingDados as Record<string, unknown>)
            : null;
        const analiseEnviada = dadosExistentes?._analisePosFlowEnviada === true;
        await atualizarPacienteOnboarding(paciente.id, {
          termosAceitos: true,
          onboardingStatus: 'CONCLUIDO',
          onboardingEtapa: 'FLOW_CONCLUIDO',
          onboardingDados: {
            ...(dadosExistentes ?? {}),
            _analisePosFlowEnviada: true,
          } as Prisma.InputJsonValue,
        });
        if (!analiseEnviada) {
          await enviarAnalisePosFlow(telefone, paciente, phoneNumberId);
        }
        return;
      }
      if (['termo_discordar', 'discordar'].includes(resposta)) {
        await atualizarPacienteOnboarding(paciente.id, {
          termosAceitos: false,
          onboardingStatus: 'EM_ANDAMENTO',
          onboardingEtapa: 'TERMO_ANALISE_RECUSADO',
        });
        const mensagemRecusa =
          'Sem o aceite dos termos eu não consigo continuar.\n\n' +
          'Se desejar, você pode concordar agora ou solicitar a exclusão do cadastro.';
        await enviarBotoesComRegistro(
          telefone,
          paciente.id,
          mensagemRecusa,
          botoesRecuperacaoTermos,
          phoneNumberId,
        );
        return;
      }
      if (['termo_excluir_cadastro', 'excluir cadastro'].includes(resposta)) {
        await desativarPacienteWhatsapp(paciente.id);
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          'Cadastro excluído conforme solicitado. Se quiser voltar, é só mandar uma mensagem.',
          phoneNumberId,
        );
        return;
      }
      await enviarBotoesComRegistro(
        telefone,
        paciente.id,
        'Para continuar, preciso do seu aceite dos termos.',
        botoesTermosAnalise,
        phoneNumberId,
      );
      return;
    }
    const precisaOnboarding = paciente.onboardingStatus !== 'CONCLUIDO';
    if (precisaOnboarding) {
      const texto = normalizarResposta(mensagem.texto);
      const deveDispararFlow = texto && gatilhosFlow.some((gatilho) => texto.includes(gatilho));
      if (mensagem.tipo === 'text' && deveDispararFlow) {
        await enviarFlowDireto(telefone, phoneNumberId);
        await atualizarPacienteOnboarding(paciente.id, {
          onboardingStatus: 'EM_ANDAMENTO',
          onboardingEtapa: 'FLOW_ENVIADO',
        });
        return;
      }
      if (mensagem.tipo === 'text') {
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          'Para iniciar o cadastro, digite "oi" ou "cadastrar".',
          phoneNumberId,
        );
        return;
      }
    }
    const rota = rotearMensagem(mensagem.texto, mensagem.tipo);
    if (rota === 'MENU') {
      await enviarTextoComRegistro(telefone, paciente.id, menuMensagem, phoneNumberId);
      return;
    }
    if (rota === 'HISTORICO') {
      const historico = await montarHistoricoMensagem(paciente.id);
      await enviarTextoComRegistro(telefone, paciente.id, historico, phoneNumberId);
      return;
    }
    if (rota === 'PERFIL') {
      const metaMin = paciente.metaGlicemicaMin ?? 70;
      const metaMax = paciente.metaGlicemicaMax ?? 140;
      const perfil = `Seu perfil:\n${paciente.nome}\nTipo: ${formatarTipoDiabetes(
        paciente.tipoDiabetes,
      )}\nMeta: ${metaMin}-${metaMax} mg/dL`;
      await enviarTextoComRegistro(telefone, paciente.id, perfil, phoneNumberId);
      return;
    }
    if (rota === 'LEITURA_GLICEMIA' && mensagem.texto) {
      const valor = extrairValorNumerico(mensagem.texto);
      if (!valor) {
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          'Não consegui entender o valor da glicemia. Tente enviar apenas o número.',
          phoneNumberId,
        );
        return;
      }
      await criarGlicemia(paciente.id, valor);
      const resposta =
        `Glicemia de ${Math.round(valor)} mg/dL registrada! 📊\n` +
        'Analisando e em breve envio sua orientação... 🧠';
      await enviarTextoComRegistro(telefone, paciente.id, resposta, phoneNumberId);
      return;
    }
    if (rota === 'FOTO_REFEICAO') {
      const resposta = 'Foto recebida! 🍽️ Vou analisar e já te retorno com a orientação.';
      await enviarTextoComRegistro(telefone, paciente.id, resposta, phoneNumberId);
      return;
    }
    const fallback = 'Não entendi sua mensagem. Digite "menu" para ver as opções disponíveis.';
    await enviarTextoComRegistro(telefone, paciente.id, fallback, phoneNumberId);
  } catch {
    return;
  }
}

type CriarConfiguracaoWhatsappInput = {
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  webhookUrl: string;
  ativo: boolean;
};

function gerarTokenVerificacaoConfig(businessId: string) {
  const normalizado = businessId.replace(/\s+/g, '');
  const base = normalizado.slice(-6) || 'gluco';
  return `gluco-${base}`.toLowerCase();
}

async function criarConfiguracaoWhatsappService(
  clinicaId: string,
  dados: CriarConfiguracaoWhatsappInput,
) {
  return criarConfiguracaoWhatsapp({
    clinicaId,
    idNumero: dados.idNumero,
    numeroExibicao: dados.numeroExibicao,
    businessId: dados.businessId,
    webhookUrl: dados.webhookUrl,
    tokenVerificacao: gerarTokenVerificacaoConfig(dados.businessId),
    ativo: dados.ativo,
  });
}

async function obterConfiguracaoWhatsappService(clinicaId: string) {
  return buscarConfiguracaoWhatsappPorClinica(clinicaId);
}

async function obterConfiguracaoWhatsappPorNumeroService(idNumero: string) {
  return buscarConfiguracaoWhatsappPorIdNumero(idNumero);
}

async function excluirConfiguracaoWhatsappService(clinicaId: string, id: string) {
  return excluirConfiguracaoWhatsapp(clinicaId, id);
}

async function processarWebhook(payload: WebhookPayload) {
  const mensagens = extrairMensagens(payload);
  console.log('[GLUCO:WHATSAPP]', { acao: 'webhook_recebido', mensagens: mensagens.length });
  for (const mensagem of mensagens) {
    try {
      await processarMensagem(mensagem);
    } catch {
      continue;
    }
  }
}

async function processarWebhookComNumero(payload: WebhookPayload, idNumero?: string) {
  const mensagens = extrairMensagens(payload);
  console.log('[GLUCO:WHATSAPP]', { acao: 'webhook_recebido', mensagens: mensagens.length, idNumero });
  for (const mensagem of mensagens) {
    try {
      await processarMensagem(mensagem, idNumero);
    } catch {
      continue;
    }
  }
}

export {
  processarWebhook,
  processarWebhookComNumero,
  verificarAssinatura,
  enviarTextoWhatsApp,
  criarConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappPorNumeroService,
  excluirConfiguracaoWhatsappService,
};

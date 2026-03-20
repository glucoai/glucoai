import crypto from 'crypto';
import { env } from '../../config/env.js';
import {
  buscarPacientePorTelefone,
  salvarMensagem,
  criarGlicemia,
  buscarUltimasGlicemias,
  criarConfiguracaoWhatsapp,
  buscarConfiguracaoWhatsappPorClinica,
  buscarConfiguracaoWhatsappPorIdNumero,
  atualizarPacienteOnboarding,
} from './repository.js';
import type { MensagemEntrada, RotaMensagem, WebhookPayload } from './types.js';

const menuMensagem =
  'Olá! Sou o assistente Gluco IA 🤖\n' +
  'Você pode:\n' +
  '📊 Enviar sua glicemia (ex: 120)\n' +
  '🍽️ Enviar foto da sua refeição para análise\n' +
  '📈 Digitar "histórico" para ver os últimos 7 dias\n' +
  '💊 Digitar "perfil" para ver suas informações';

type OnboardingDados = {
  nomePendente?: string;
  emailPendente?: string;
};

type PacienteOnboarding = {
  id: string;
  nome: string;
  telefone: string;
  tipoDiabetes: string;
  metaGlicemicaMin: number | null;
  metaGlicemicaMax: number | null;
  onboardingStatus?: string | null;
  onboardingEtapa?: string | null;
  onboardingDados?: unknown;
  ultimaGlicemia?: number | null;
  pesoKg?: number | null;
};

const botoesTermos = [
  { id: 'TERMOS_ACEITAR', titulo: 'Aceitar' },
  { id: 'TERMOS_RECUSAR', titulo: 'Recusar' },
];

const botoesConfirmarNome = [
  { id: 'NOME_CONFIRMAR', titulo: 'Confirmar' },
  { id: 'NOME_EDITAR', titulo: 'Editar' },
];

const botoesConfirmarEmail = [
  { id: 'EMAIL_CONFIRMAR', titulo: 'Confirmar' },
  { id: 'EMAIL_EDITAR', titulo: 'Editar' },
];

const botoesSexo = [
  { id: 'SEXO_FEMININO', titulo: 'Feminino' },
  { id: 'SEXO_MASCULINO', titulo: 'Masculino' },
  { id: 'SEXO_OUTRO', titulo: 'Outro' },
  { id: 'SEXO_NAO_INFORMAR', titulo: 'Prefiro não informar' },
];

const botoesSintomas = [
  { id: 'SINTOMAS_SIM', titulo: 'Sim' },
  { id: 'SINTOMAS_NAO', titulo: 'Não' },
];

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
        if (!message.from) {
          continue;
        }
        mensagens.push({
          id: message.id ?? crypto.randomUUID(),
          telefone: message.from,
          tipo,
          texto: message.text?.body ?? textoInterativo,
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

async function enviarBotoesWhatsApp(
  telefone: string,
  texto: string,
  botoes: { id: string; titulo: string }[],
) {
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

function normalizarTexto(texto?: string) {
  return (texto ?? '').trim();
}

function normalizarResposta(texto?: string) {
  return normalizarTexto(texto).toLowerCase();
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

function obterOnboardingDados(paciente: { onboardingDados?: unknown }) {
  const dados = paciente.onboardingDados;
  if (!dados || typeof dados !== 'object') {
    return {};
  }
  return dados as OnboardingDados;
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

async function enviarTextoComRegistro(telefone: string, pacienteId: string, texto: string) {
  try {
    await enviarTextoWhatsApp(telefone, texto);
    await salvarMensagem({
      pacienteId,
      conteudo: texto,
      remetente: 'SISTEMA',
      tipo: 'TEXTO',
    });
  } catch {
    return;
  }
}

async function enviarBotoesComRegistro(
  telefone: string,
  pacienteId: string,
  texto: string,
  botoes: { id: string; titulo: string }[],
) {
  try {
    await enviarBotoesWhatsApp(telefone, texto, botoes);
    await salvarMensagem({
      pacienteId,
      conteudo: texto,
      remetente: 'SISTEMA',
      tipo: 'TEMPLATE',
    });
  } catch {
    return;
  }
}

async function iniciarOnboarding(telefone: string, pacienteId: string) {
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'TERMOS',
  });
  const boasVindas =
    'Bem-vindo(a) ao Gluco IA! ✨\n' +
    'Eu vou te acompanhar de forma simples e cuidadosa pelo WhatsApp.\n' +
    'Antes de começarmos, preciso do seu aceite dos termos de uso.';
  await enviarBotoesComRegistro(telefone, pacienteId, boasVindas, botoesTermos);
}

async function tratarEtapaTermos(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const resposta = normalizarResposta(texto);
  if (['aceitar', 'termos_aceitar', 'aceito'].includes(resposta)) {
    await atualizarPacienteOnboarding(pacienteId, {
      termosAceitos: true,
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'NOME',
    });
    await enviarTextoComRegistro(telefone, pacienteId, 'Perfeito! Qual é o seu nome completo?');
    return;
  }
  if (['recusar', 'termos_recusar', 'nao'].includes(resposta)) {
    await atualizarPacienteOnboarding(pacienteId, {
      termosAceitos: false,
      onboardingStatus: 'RECUSADO',
      onboardingEtapa: 'TERMOS',
    });
    await enviarBotoesComRegistro(
      telefone,
      pacienteId,
      'Sem o aceite dos termos eu não consigo continuar. Se desejar, você pode aceitar agora.',
      botoesTermos,
    );
    return;
  }
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    'Para continuar, preciso que você aceite os termos de uso.',
    botoesTermos,
  );
}

async function tratarEtapaNome(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const nome = normalizarTexto(texto);
  if (!nome) {
    await enviarTextoComRegistro(telefone, pacienteId, 'Qual é o seu nome completo?');
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'NOME_CONFIRMA',
    onboardingDados: { nomePendente: nome },
  });
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    `Seu nome está correto assim: ${nome}?`,
    botoesConfirmarNome,
  );
}

async function tratarEtapaNomeConfirmacao(
  telefone: string,
  pacienteId: string,
  texto: string,
  dados: OnboardingDados,
) {
  const resposta = normalizarResposta(texto);
  if (['nome_confirmar', 'confirmar'].includes(resposta) && dados.nomePendente) {
    await atualizarPacienteOnboarding(pacienteId, {
      nome: dados.nomePendente,
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'SEXO',
      onboardingDados: {},
    });
    await enviarBotoesComRegistro(
      telefone,
      pacienteId,
      'Qual é o seu sexo?',
      botoesSexo,
    );
    return;
  }
  if (['nome_editar', 'editar'].includes(resposta)) {
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'NOME',
    });
    await enviarTextoComRegistro(telefone, pacienteId, 'Tudo bem, qual é o seu nome completo?');
    return;
  }
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    'Você pode confirmar ou editar seu nome.',
    botoesConfirmarNome,
  );
}

function mapearSexo(texto: string) {
  const resposta = normalizarResposta(texto);
  if (['sexo_feminino', 'feminino'].includes(resposta)) return 'Feminino';
  if (['sexo_masculino', 'masculino'].includes(resposta)) return 'Masculino';
  if (['sexo_outro', 'outro'].includes(resposta)) return 'Outro';
  if (['sexo_nao_informar', 'prefiro não informar', 'prefiro nao informar'].includes(resposta)) {
    return 'Prefiro não informar';
  }
  return null;
}

async function tratarEtapaSexo(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const sexo = mapearSexo(texto);
  if (!sexo) {
    await enviarBotoesComRegistro(telefone, pacienteId, 'Qual é o seu sexo?', botoesSexo);
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    genero: sexo,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'EMAIL',
  });
  await enviarTextoComRegistro(telefone, pacienteId, 'Qual é o seu e-mail?');
}

async function tratarEtapaEmail(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const email = normalizarTexto(texto);
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valido) {
    await enviarTextoComRegistro(telefone, pacienteId, 'Digite um e-mail válido, por favor.');
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'EMAIL_CONFIRMA',
    onboardingDados: { emailPendente: email },
  });
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    `Seu e-mail está correto assim: ${email}?`,
    botoesConfirmarEmail,
  );
}

async function tratarEtapaEmailConfirmacao(
  telefone: string,
  pacienteId: string,
  texto: string,
  dados: OnboardingDados,
) {
  const resposta = normalizarResposta(texto);
  if (['email_confirmar', 'confirmar'].includes(resposta) && dados.emailPendente) {
    await atualizarPacienteOnboarding(pacienteId, {
      email: dados.emailPendente,
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'IDADE',
      onboardingDados: {},
    });
    await enviarTextoComRegistro(telefone, pacienteId, 'Qual é a sua idade?');
    return;
  }
  if (['email_editar', 'editar'].includes(resposta)) {
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingStatus: 'EM_ANDAMENTO',
      onboardingEtapa: 'EMAIL',
    });
    await enviarTextoComRegistro(telefone, pacienteId, 'Tudo bem, qual é o seu e-mail?');
    return;
  }
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    'Você pode confirmar ou editar seu e-mail.',
    botoesConfirmarEmail,
  );
}

async function tratarEtapaIdade(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const idade = extrairValorNumerico(texto ?? '');
  if (!idade || idade < 1 || idade > 120) {
    await enviarTextoComRegistro(telefone, pacienteId, 'Informe sua idade em anos, por favor.');
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    idade,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'ALTURA',
  });
  await enviarTextoComRegistro(telefone, pacienteId, 'Qual é a sua altura em cm?');
}

async function tratarEtapaAltura(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const altura = extrairAlturaCm(texto ?? '');
  if (!altura || altura < 80 || altura > 250) {
    await enviarTextoComRegistro(telefone, pacienteId, 'Informe sua altura em cm, por favor.');
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    alturaCm: altura,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'PESO',
  });
  await enviarTextoComRegistro(telefone, pacienteId, 'Qual é o seu peso em kg?');
}

async function tratarEtapaPeso(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const peso = extrairPesoKg(texto ?? '');
  if (!peso || peso < 20 || peso > 300) {
    await enviarTextoComRegistro(telefone, pacienteId, 'Informe seu peso em kg, por favor.');
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    pesoKg: peso,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'ULTIMA_GLICEMIA',
  });
  await enviarTextoComRegistro(telefone, pacienteId, 'Qual foi sua última glicemia em mg/dL?');
}

async function tratarEtapaUltimaGlicemia(
  telefone: string,
  pacienteId: string,
  texto: string,
) {
  const valor = extrairValorNumerico(texto ?? '');
  if (!valor || valor < 30 || valor > 600) {
    await enviarTextoComRegistro(
      telefone,
      pacienteId,
      'Informe a glicemia em mg/dL, por favor. Exemplo: 120',
    );
    return;
  }
  await atualizarPacienteOnboarding(pacienteId, {
    ultimaGlicemia: valor,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'SINTOMAS',
  });
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    'Você tem sintomas ou complicações atualmente?',
    botoesSintomas,
  );
}

async function tratarEtapaSintomas(
  telefone: string,
  pacienteId: string,
  texto: string,
  ultimaGlicemia: number | null | undefined,
  pesoKg: number | null | undefined,
) {
  const resposta = normalizarResposta(texto);
  if (!['sintomas_sim', 'sim', 'sintomas_nao', 'nao', 'não'].includes(resposta)) {
    await enviarBotoesComRegistro(
      telefone,
      pacienteId,
      'Você tem sintomas ou complicações atualmente?',
      botoesSintomas,
    );
    return;
  }
  const sintomas = ['sintomas_sim', 'sim'].includes(resposta);
  const glicemiaBase = ultimaGlicemia ?? 0;
  const pesoBase = pesoKg && pesoKg > 0 ? pesoKg : 70;
  const risco = calcularEscalaRisco(glicemiaBase, sintomas);
  const macros = calcularMacrosDiarios(pesoBase);
  await atualizarPacienteOnboarding(pacienteId, {
    sintomasComplicacoes: sintomas,
    riscoEscala: risco,
    macrosDiarios: macros,
    onboardingStatus: 'CONCLUIDO',
    onboardingEtapa: 'FINAL',
    onboardingDados: {},
  });
  const resumo =
    `Onboarding concluído! ✅\n` +
    `Escala de risco: ${risco}\n` +
    `Macros diários estimados:\n` +
    `Proteína: ${macros.proteina}g | Carboidratos: ${macros.carboidratos}g | Gorduras: ${macros.gorduras}g`;
  await enviarTextoComRegistro(telefone, pacienteId, resumo);
  await enviarTextoComRegistro(telefone, pacienteId, menuMensagem);
}

async function processarOnboarding(
  telefone: string,
  paciente: PacienteOnboarding,
  texto: string | undefined,
) {
  const etapa = paciente.onboardingEtapa ?? 'BOAS_VINDAS';
  if (etapa === 'BOAS_VINDAS') {
    await iniciarOnboarding(telefone, paciente.id);
    return true;
  }
  if (!texto) {
    await enviarTextoComRegistro(telefone, paciente.id, 'Envie uma resposta para continuarmos.');
    return true;
  }
  const dados = obterOnboardingDados(paciente);
  if (etapa === 'TERMOS') {
    await tratarEtapaTermos(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'NOME') {
    await tratarEtapaNome(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'NOME_CONFIRMA') {
    await tratarEtapaNomeConfirmacao(telefone, paciente.id, texto, dados);
    return true;
  }
  if (etapa === 'SEXO') {
    await tratarEtapaSexo(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'EMAIL') {
    await tratarEtapaEmail(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'EMAIL_CONFIRMA') {
    await tratarEtapaEmailConfirmacao(telefone, paciente.id, texto, dados);
    return true;
  }
  if (etapa === 'IDADE') {
    await tratarEtapaIdade(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'ALTURA') {
    await tratarEtapaAltura(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'PESO') {
    await tratarEtapaPeso(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'ULTIMA_GLICEMIA') {
    await tratarEtapaUltimaGlicemia(telefone, paciente.id, texto);
    return true;
  }
  if (etapa === 'SINTOMAS') {
    await tratarEtapaSintomas(
      telefone,
      paciente.id,
      texto,
      paciente.ultimaGlicemia,
      paciente.pesoKg,
    );
    return true;
  }
  await iniciarOnboarding(telefone, paciente.id);
  return true;
}

async function processarMensagem(mensagem: MensagemEntrada) {
  try {
    const telefone = normalizarTelefone(mensagem.telefone);
    const paciente = (await buscarPacientePorTelefone(telefone)) as PacienteOnboarding | null;
    if (!paciente) {
      await enviarTextoWhatsApp(telefone, 'Não encontramos seu cadastro. Fale com sua clínica.');
      return;
    }
    await registrarMensagemPaciente(paciente.id, mensagem);
    const precisaOnboarding = paciente.onboardingStatus !== 'CONCLUIDO';
    if (precisaOnboarding) {
      const handled = await processarOnboarding(telefone, paciente, mensagem.texto);
      if (handled) {
        return;
      }
    }
    const rota = rotearMensagem(mensagem.texto, mensagem.tipo);
    if (rota === 'MENU') {
      await enviarTextoComRegistro(telefone, paciente.id, menuMensagem);
      return;
    }
    if (rota === 'HISTORICO') {
      const historico = await montarHistoricoMensagem(paciente.id);
      await enviarTextoComRegistro(telefone, paciente.id, historico);
      return;
    }
    if (rota === 'PERFIL') {
      const metaMin = paciente.metaGlicemicaMin ?? 70;
      const metaMax = paciente.metaGlicemicaMax ?? 140;
      const perfil = `Seu perfil:\n${paciente.nome}\nTipo: ${formatarTipoDiabetes(
        paciente.tipoDiabetes,
      )}\nMeta: ${metaMin}-${metaMax} mg/dL`;
      await enviarTextoComRegistro(telefone, paciente.id, perfil);
      return;
    }
    if (rota === 'LEITURA_GLICEMIA' && mensagem.texto) {
      const valor = extrairValorNumerico(mensagem.texto);
      if (!valor) {
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          'Não consegui entender o valor da glicemia. Tente enviar apenas o número.',
        );
        return;
      }
      await criarGlicemia(paciente.id, valor);
      const resposta =
        `Glicemia de ${Math.round(valor)} mg/dL registrada! 📊\n` +
        'Analisando e em breve envio sua orientação... 🧠';
      await enviarTextoComRegistro(telefone, paciente.id, resposta);
      return;
    }
    if (rota === 'FOTO_REFEICAO') {
      const resposta = 'Foto recebida! 🍽️ Vou analisar e já te retorno com a orientação.';
      await enviarTextoComRegistro(telefone, paciente.id, resposta);
      return;
    }
    const fallback = 'Não entendi sua mensagem. Digite "menu" para ver as opções disponíveis.';
    await enviarTextoComRegistro(telefone, paciente.id, fallback);
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

export {
  processarWebhook,
  verificarAssinatura,
  enviarTextoWhatsApp,
  criarConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappPorNumeroService,
};

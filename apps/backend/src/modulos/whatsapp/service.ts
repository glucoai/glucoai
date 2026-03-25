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
  'Olá! Sou o assistente Gluco AI 🤖\n' +
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
  { id: 'TERMO_CONCORDAR', titulo: 'Sim, Concordar' },
  { id: 'TERMO_DISCORDAR', titulo: 'Não Concordo' },
];

const botoesRecuperacaoTermos = [
  { id: 'TERMO_CONTINUAR', titulo: 'Vamos continuar!' },
  { id: 'TERMO_NAO_COMPARTILHAR', titulo: 'Não compartilhar' },
];

const botoesGestacional = [
  { id: 'GESTACIONAL_AVISAR', titulo: 'Quero ser avisada' },
  { id: 'GESTACIONAL_NAO', titulo: 'Não, obrigada' },
];

const botoesConviteFlow = [{ id: 'FLOW_COMO_FUNCIONA', titulo: 'Como Funciona?' }];

const textoConviteFlow =
  'Olá! 👋😄\n\n' +
  'Eu sou o *Gluco AI*🧬, seu novo parceiro para controlar o diabetes.\n\n' +
  'A maioria das complicações do diabetes (visão, rins, circulação) começa em silêncio…\n' +
  '…antes de qualquer sintoma aparecer. 😟\n\n' +
  'Mas com o acompanhamento certo? Dá pra evitar tudo isso. 💪\n\n' +
  '*Vou te ajudar a*:\n' +
  '✅ Controlar sua glicemia e evitar complicações\n' +
  '✅ Entender sua alimentação e montar refeições seguras\n' +
  '✅ Agir rápido quando a glicemia subir, sem sair de casa 😅\n\n' +
  '👉 Vamos começar seu controle agora? Leva menos de 1 minuto ⏱️';

const textoFlowDireto =
  'Perfeito! Vamos iniciar seu controle agora. 🚀\n' +
  'Leva menos de 1 minuto.';

const textoContinuarFlow02 =
  'Perfeito! Estamos quase lá com seu cadastro.\n' +
  'Toque no botão abaixo para continuar.';

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

function extrairTextoResposta(valor: unknown) {
  if (typeof valor === 'string') return valor;
  if (valor && typeof valor === 'object') {
    const possivelId = (valor as { id?: unknown }).id;
    if (typeof possivelId === 'string') return possivelId;
    const possivelTitle = (valor as { title?: unknown }).title;
    if (typeof possivelTitle === 'string') return possivelTitle;
  }
  return '';
}

function obterPrimeiroNome(nome?: string) {
  if (!nome) return 'Paciente';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'Paciente';
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
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
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

async function enviarConviteFlowComBotoes(
  telefone: string,
  pacienteId: string,
  phoneNumberId?: string,
) {
  await enviarFlowDireto(telefone, phoneNumberId, textoConviteFlow, 'Controlar Glicemia Agora', env.FLOW01_ID);
  await enviarBotoesComRegistro(
    telefone,
    pacienteId,
    'Quer entender melhor antes de começar?',
    botoesConviteFlow,
    phoneNumberId,
  );
}

async function enviarComoFuncionaComBotao(
  telefone: string,
  pacienteId: string,
  primeiroNome: string,
  phoneNumberId?: string,
) {
  const texto =
    `Boa pergunta! 😄 Funciona assim:\n\n` +
    `📲 Você me envia pelo WhatsApp:\n` +
    `• Sua glicemia (digitando ou foto do aparelho).\n` +
    `• Foto do que vai comer.\n\n` +
    `🧠 Eu analiso em segundos e te digo:\n` +
    `• Como está sua glicemia e o que fazer.\n` +
    `• Se sua refeição é segura para você.\n` +
    `• Quanto sua glicemia pode subir depois de comer.\n\n` +
    `⚡ Se a sua glicemia estiver muito alta, ativo automaticamente o Protocolo AQS e te acompanho a cada 1 hora até normalizar, dessa forma, juntos, evitamos as complicações.\n\n` +
    `Tudo pelo WhatsApp. Sem baixar nenhum app. 📱\n\n` +
    `Pronto pra começar, ${primeiroNome}? 🚀`;
  await enviarFlowDireto(telefone, phoneNumberId, texto, 'Sim, quero começar!', env.FLOW01_ID);
}

function identificarFlowResposta(dadosFlow: Record<string, unknown>) {
  const chavesFlow03 = ['sintomas', 'alimentacao', 'peso', 'altura', 'email'];
  const encontrouFlow03 = chavesFlow03.some(
    (chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined,
  );
  if (encontrouFlow03) {
    return 'FLOW03';
  }
  const chavesFlow02 = [
    'medicamentos',
    'anos_diabetes',
    'controle_diabetes',
    'pronto_socorro',
    'maior_glicemia',
    'aparelho_glicemia',
  ];
  const encontrou = chavesFlow02.some((chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined);
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'identificar_flow_resposta',
    chavesEncontradas: chavesFlow02.filter((chave) => obterValorPorChaves(dadosFlow, [chave]) !== undefined),
  });
  return encontrou ? 'FLOW02' : 'FLOW01';
}

function montarDadosFlow02Inicial(dadosFlow: Record<string, unknown>) {
  return {
    controle_glicemia: obterValorPorChaves(dadosFlow, ['controle_glicemia']),
    nome_completo: obterValorPorChaves(dadosFlow, ['nome_completo', 'nomeCompleto', 'nome']),
    data_nascimento: obterValorPorChaves(dadosFlow, ['data_nascimento', 'dataNascimento']),
    sexo: obterValorPorChaves(dadosFlow, ['sexo']),
    pais: obterValorPorChaves(dadosFlow, ['pais']),
    tipo_diabetes: obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']),
  };
}

function montarDadosFlow03Inicial(dadosFlow: Record<string, unknown>) {
  return {
    ...montarDadosFlow02Inicial(dadosFlow),
    medicamentos: obterValorPorChaves(dadosFlow, ['medicamentos']),
    anos_diabetes: obterValorPorChaves(dadosFlow, ['anos_diabetes', 'anosDiagnostico', 'anos_diagnostico']),
    controle_diabetes: obterValorPorChaves(dadosFlow, ['controle_diabetes']),
    pronto_socorro: obterValorPorChaves(dadosFlow, ['pronto_socorro']),
    maior_glicemia: obterValorPorChaves(dadosFlow, ['maior_glicemia']),
    aparelho_glicemia: obterValorPorChaves(dadosFlow, ['aparelho_glicemia']),
  };
}

async function processarRespostaFlow01(
  telefone: string,
  pacienteId: string,
  dadosFlow: Record<string, unknown>,
  phoneNumberId?: string,
) {
  const existente = await buscarPacientePorId(pacienteId);
  const onboardingDadosBruto =
    existente && typeof existente === 'object' && 'onboardingDados' in existente
      ? (existente as { onboardingDados?: unknown }).onboardingDados
      : undefined;
  const dadosExistentes =
    onboardingDadosBruto && typeof onboardingDadosBruto === 'object'
      ? (onboardingDadosBruto as Record<string, unknown>)
      : null;
  const nome = obterValorPorChaves(dadosFlow, ['nome', 'name', 'nome_completo', 'nomeCompleto']);
  const generoBruto = obterValorPorChaves(dadosFlow, ['sexo', 'genero', 'gênero']);
  const genero = mapearGeneroFlow(generoBruto);
  const dataNascimentoValor = obterValorPorChaves(dadosFlow, [
    'data_nascimento',
    'dataNascimento',
    'nascimento',
  ]);
  const paisValor = obterValorPorChaves(dadosFlow, ['pais', 'país', 'country']);
  const tipoDiabetesValor = obterValorPorChaves(dadosFlow, ['tipo_diabetes', 'tipoDiabetes']);
  const tipoDiabetesFlow = mapearTipoDiabetesFlow(tipoDiabetesValor);
  const tipoDiabetesTexto = normalizarResposta(extrairTextoResposta(tipoDiabetesValor));
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'flow01_tipo_diabetes',
    tipoDiabetesValor,
    tipoDiabetesFlow,
    tipoDiabetesTexto,
  });
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const idadeCalculada = dataNascimento ? calcularIdade(dataNascimento) : null;
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  await atualizarPacienteOnboarding(pacienteId, {
    nome: typeof nome === 'string' ? nome.trim() : undefined,
    genero: typeof genero === 'string' ? genero : undefined,
    tipoDiabetes: tipoDiabetesFlow ?? undefined,
    dataNascimento: dataNascimento ?? undefined,
    idade: typeof idadeCalculada === 'number' ? Math.round(idadeCalculada) : undefined,
    pais: typeof paisValor === 'string' ? paisValor : undefined,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'FLOW01_RESPONDIDO',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  const dadosFlow02Inicial = montarDadosFlow02Inicial(onboardingDadosAtualizados);
  const pacienteAtualizado = await buscarPacientePorId(pacienteId);
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
  if (tipoDiabetesFlow === 'GESTACIONAL' || tipoDiabetesTexto.includes('gestacional')) {
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'GESTACIONAL_AVISO',
      tipoDiabetes: 'GESTACIONAL',
    });
    const mensagemGestacional =
      `Opa ${primeiroNome}! 🌸\n\n` +
      'No momento o Gluco AI é focado em pessoas com diabetes tipo 1 ou tipo 2.\n\n' +
      'Mas fica tranquila, você não vai ficar sem ajuda!\n\n' +
      '👉 Te recomendo procurar um pré-natalista ou endocrinologista especializado em diabetes gestacional.\n\n' +
      'Posso te avisar quando lançarmos o suporte para diabetes gestacional?';
    await enviarBotoesComRegistro(
      telefone,
      pacienteId,
      mensagemGestacional,
      botoesGestacional,
      phoneNumberId,
    );
    return;
  }
  if (
    tipoDiabetesTexto.includes('nao_sei') ||
    tipoDiabetesTexto.includes('naosei') ||
    tipoDiabetesTexto.includes('não sei')
  ) {
    const mensagemNaoSei =
      `Tudo bem *${primeiroNome}*! Isso acontece mais do que você imagina 😊\n\n` +
      'Vou continuar configurando seu perfil de forma mais geral por enquanto.\n\n' +
      '⚠️ Para resultados mais precisos, recomendo pedir ao seu médico para confirmar o tipo de diabetes na próxima consulta. Depois é só me avisar e eu atualizo tudo!\n\n' +
      'Vamos continuar? 🚀';
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      mensagemNaoSei,
      'Ok, vamos continuar',
      env.FLOW02_ID,
      'DIABETES_TYPE_CHECK',
      dadosFlow02Inicial,
    );
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'FLOW02_ENVIADO',
    });
    return;
  }
  if (tipoDiabetesFlow === 'TIPO_1' || tipoDiabetesFlow === 'TIPO_2') {
    const mensagemContinuar =
      `Perfeito, *${primeiroNome}*.\n\n` +
      'Estamos quase lá com seu cadastro, toque no botão abaixo para continuar.';
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      mensagemContinuar,
      'Ok, vamos continuar',
      env.FLOW02_ID,
      'DIABETES_TYPE_CHECK',
      dadosFlow02Inicial,
    );
    await atualizarPacienteOnboarding(pacienteId, {
      onboardingEtapa: 'FLOW02_ENVIADO',
    });
    return;
  }
  await enviarFlowDireto(
    telefone,
    phoneNumberId,
    textoContinuarFlow02,
    'Ok, vamos continuar',
    env.FLOW02_ID,
    'DIABETES_TYPE_CHECK',
    dadosFlow02Inicial,
  );
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingEtapa: 'FLOW02_ENVIADO',
  });
}

async function processarRespostaFlow02(
  telefone: string,
  pacienteId: string,
  dadosFlow: Record<string, unknown>,
  phoneNumberId?: string,
) {
  const existente = await buscarPacientePorId(pacienteId);
  const onboardingDadosBruto =
    existente && typeof existente === 'object' && 'onboardingDados' in existente
      ? (existente as { onboardingDados?: unknown }).onboardingDados
      : undefined;
  const dadosExistentes =
    onboardingDadosBruto && typeof onboardingDadosBruto === 'object'
      ? (onboardingDadosBruto as Record<string, unknown>)
      : null;
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
  const medicamentosValor = obterValorPorChaves(dadosFlow, ['medicamentos']);
  const idadeValor = obterValorPorChaves(dadosFlow, ['idade', 'age']);
  const alturaValor = obterValorPorChaves(dadosFlow, ['altura', 'altura_cm', 'alturaCm']);
  const pesoValor = obterValorPorChaves(dadosFlow, ['peso', 'peso_kg', 'pesoKg']);
  const glicemiaValor = obterValorPorChaves(dadosFlow, [
    'ultima_glicemia',
    'ultimaglicemia',
    'glicemia',
    'pico_glicemia',
    'maior_glicemia',
  ]);
  const sintomasValor = obterValorPorChaves(dadosFlow, [
    'sintomas',
    'complicacoes',
    'sintomasComplicacoes',
  ]);
  const emergenciaValor = obterValorPorChaves(dadosFlow, ['emergencia', 'emergência']);
  const aparelhoValor = obterValorPorChaves(dadosFlow, ['aparelho_glicemia']);
  const idade = parsearNumero(idadeValor);
  const alturaCm = alturaValor ? extrairAlturaCm(String(alturaValor)) : null;
  const pesoKg = pesoValor ? extrairPesoKg(String(pesoValor)) : null;
  const glicemiaTexto = typeof glicemiaValor === 'string' ? glicemiaValor : '';
  const glicemiaNumeros = glicemiaTexto.match(/\d+/g)?.map((item) => Number(item)) ?? [];
  const ultimaGlicemia =
    glicemiaNumeros.length > 0 ? Math.max(...glicemiaNumeros) : parsearNumero(glicemiaValor);
  const sintomasArray = Array.isArray(sintomasValor)
    ? sintomasValor
    : typeof sintomasValor === 'string'
      ? sintomasValor.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  const sintomasTemNenhum = sintomasArray.some(
    (item) => normalizarResposta(String(item)) === 'nenhum',
  );
  const sintomasComplicacoes =
    sintomasArray.length > 0
      ? !sintomasTemNenhum
      : parsearBooleano(sintomasValor) ?? parsearBooleano(emergenciaValor);
  const dataNascimento = parsearDataNascimento(dataNascimentoValor);
  const anosDiagnostico = parsearAnosDiagnostico(anosDiagnosticoValor);
  const idadeCalculada =
    !idade && dataNascimento ? calcularIdade(dataNascimento) : (idade ?? null);
  const risco =
    typeof ultimaGlicemia === 'number' && typeof sintomasComplicacoes === 'boolean'
      ? calcularEscalaRisco(ultimaGlicemia, sintomasComplicacoes)
      : null;
  const macros = typeof pesoKg === 'number' ? calcularMacrosDiarios(pesoKg) : null;
  const onboardingDadosAtualizados = {
    ...(dadosExistentes ?? {}),
    ...dadosFlow,
  };
  const aparelhoTexto = normalizarResposta(extrairTextoResposta(aparelhoValor));
  const temAparelho = aparelhoTexto === 'sim' || aparelhoTexto.includes('sim');
  const semGlicosimetro = !temAparelho;
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
    riscoEscala: risco ?? undefined,
    macrosDiarios: macros ?? undefined,
    pais: typeof paisValor === 'string' ? paisValor : undefined,
    anosdiagnostico: typeof anosDiagnostico === 'number' ? anosDiagnostico : undefined,
    medicamentos: typeof medicamentosValor === 'string' ? medicamentosValor : undefined,
    semGlicosimetro,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'FLOW02_RESPONDIDO',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  const pacienteAtualizado = await buscarPacientePorId(pacienteId);
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
  const dadosFlow03Inicial = montarDadosFlow03Inicial(onboardingDadosAtualizados);
  if (temAparelho) {
    const mensagemComAparelho =
      `Parabéns, ${primeiroNome}! 🎉 Isso faz TODA a diferença.\n\n` +
      'Ter o aparelho em casa significa que você já está um passo à frente na prevenção de complicações sérias.\n\n' +
      'A partir de agora vamos usar cada medição para construir o seu controle com precisão. 🎯\n\n' +
      'Vamos continuar agora?';
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      mensagemComAparelho,
      'Continuar Cadastro',
      env.FLOW03_ID,
      'STEP_SINTOMAS',
      dadosFlow03Inicial,
    );
  } else {
    const mensagemSemAparelho =
      `${primeiroNome}, preciso ser direto(a) com você sobre algo muito importante. 🚨\n\n` +
      '*Uma pessoa diabética sem aparelho de glicemia é como dirigir com os olhos vendados.*\n\n' +
      'Sem medir, você não sabe se sua glicemia está normal, alta ou em colapso — e isso pode levar a complicações sérias como neuropatia, problemas renais e na visão.\n\n' +
      'Posso te ajudar com análise de refeições e previsões, *mas o controle real só é possível com medições reais.*\n\n' +
      '📍 *Como conseguir seu aparelho agora:*\n\n' +
      '1️⃣ *Pelo SUS (grátis):* Vá ao seu posto de saúde com sua carteirinha do SUS e diagnóstico de diabetes. Diabéticos têm direito ao glicosímetro e às fitas pelo SUS.\n\n' +
      '2️⃣ *Por compra:* Qualquer farmácia tem aparelhos a partir de R$50–R$80. As fitas de teste são o item mais importante — verifique o custo antes de escolher o modelo.\n\n' +
      '👉 *Te peço apenas uma coisa:* vá conseguir o seu ainda esta semana. Quando tiver, me avisa que continuamos juntos com controle total. 💪\n\n' +
      'Agora vamos continuar seu cadastro';
    await enviarFlowDireto(
      telefone,
      phoneNumberId,
      mensagemSemAparelho,
      'Continuar Cadastro',
      env.FLOW03_ID,
      'STEP_SINTOMAS',
      dadosFlow03Inicial,
    );
  }
  await atualizarPacienteOnboarding(pacienteId, {
    onboardingEtapa: 'FLOW03_ENVIADO',
  });
}

async function processarRespostaFlow03(
  telefone: string,
  pacienteId: string,
  dadosFlow: Record<string, unknown>,
  phoneNumberId?: string,
) {
  const existente = await buscarPacientePorId(pacienteId);
  const onboardingDadosBruto =
    existente && typeof existente === 'object' && 'onboardingDados' in existente
      ? (existente as { onboardingDados?: unknown }).onboardingDados
      : undefined;
  const dadosExistentes =
    onboardingDadosBruto && typeof onboardingDadosBruto === 'object'
      ? (onboardingDadosBruto as Record<string, unknown>)
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
  const medicamentosValor = obterValorPorChaves(dadosFlow, ['medicamentos']);
  const idadeValor = obterValorPorChaves(dadosFlow, ['idade', 'age']);
  const alturaValor = obterValorPorChaves(dadosFlow, ['altura', 'altura_cm', 'alturaCm']);
  const pesoValor = obterValorPorChaves(dadosFlow, ['peso', 'peso_kg', 'pesoKg']);
  const glicemiaValor = obterValorPorChaves(dadosFlow, [
    'ultima_glicemia',
    'ultimaglicemia',
    'glicemia',
    'pico_glicemia',
    'maior_glicemia',
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
  const sintomasArray = Array.isArray(sintomasValor)
    ? sintomasValor
    : typeof sintomasValor === 'string'
      ? sintomasValor.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  const sintomasTemNenhum = sintomasArray.some(
    (item) => normalizarResposta(String(item)) === 'nenhum',
  );
  const sintomasComplicacoes =
    sintomasArray.length > 0
      ? !sintomasTemNenhum
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
    medicamentos: typeof medicamentosValor === 'string' ? medicamentosValor : undefined,
    onboardingStatus: 'EM_ANDAMENTO',
    onboardingEtapa: 'TERMO_ANALISE_PENDENTE',
    onboardingDados: onboardingDadosAtualizados as Prisma.InputJsonValue,
  });
  const pacienteAtualizado = await buscarPacientePorId(pacienteId);
  const primeiroNome = obterPrimeiroNome(pacienteAtualizado?.nome ?? existente?.nome);
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
    `*${primeiroNome}*, estou analisando seu perfil por aqui.\n\n` +
    'Antes de poder te enviar o resultado, uma informação importante 🔒\n\n' +
    'Os dados que foram coletados é estritamente para personalizar o seu acompanhamento\n' +
    '*Seus dados são*:\n' +
    '✅ Criptografados e armazenados no Brasil\n' +
    '✅ Nunca compartilhados com terceiros\n' +
    '✅ Protegidos pela LGPD\n\n' +
    'Ao continuar, você concorda com nossos termos de uso estão disponíveis em: https://glucoia.com/termos-de-uso\n\n' +
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
  const payloadBase =
    dadosFlow.data && typeof dadosFlow.data === 'object'
      ? (dadosFlow.data as Record<string, unknown>)
      : dadosFlow;
  const chavesUteis = Object.keys(payloadBase).filter(
    (chave) => !['flow_token', 'version', 'screen', 'action', 'flow_id'].includes(chave),
  );
  if (chavesUteis.length === 0) {
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'flow_sem_dados',
      telefone,
      chaves: Object.keys(payloadBase),
    });
    return;
  }
  const tipo = identificarFlowResposta(payloadBase);
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'flow_recebido',
    telefone,
    tipo,
    chaves: Object.keys(payloadBase),
  });
  if (tipo === 'FLOW02') {
    await processarRespostaFlow02(telefone, pacienteId, payloadBase, phoneNumberId);
    return;
  }
  if (tipo === 'FLOW03') {
    await processarRespostaFlow03(telefone, pacienteId, payloadBase, phoneNumberId);
    return;
  }
  await processarRespostaFlow01(telefone, pacienteId, payloadBase, phoneNumberId);
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
        const flowBody = message.interactive?.nfm_reply?.body;
        const flowJsonString =
          typeof flowJson === 'string'
            ? flowJson
            : flowJson && typeof flowJson === 'object'
              ? JSON.stringify(flowJson)
              : undefined;
        const flowBodyString =
          flowBody && typeof flowBody === 'object' ? JSON.stringify(flowBody) : undefined;
        if (!message.from) {
          continue;
        }
        if (message.interactive?.nfm_reply) {
          console.log('[GLUCO:WHATSAPP]', {
            acao: 'flow_webhook_raw',
            telefone: message.from,
            interactiveTipo: message.interactive?.type,
            responseJson: flowJsonString ?? flowJson,
            responseBody: flowBodyString ?? flowBody,
            nfmKeys: Object.keys(message.interactive?.nfm_reply ?? {}),
          });
        }
        mensagens.push({
          id: message.id ?? crypto.randomUUID(),
          telefone: message.from,
          tipo,
          texto: message.text?.body ?? textoInterativo,
          imagemId: message.image?.id,
          interactiveTipo: message.interactive?.type,
          flowResponseJson: flowJsonString ?? flowBodyString,
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
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
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

async function enviarFlowDireto(
  telefone: string,
  phoneNumberId?: string,
  texto?: string,
  flowCta?: string,
  flowId?: string,
  telaInicial?: string,
  dadosInicial?: Record<string, unknown>,
) {
  const numeroId = phoneNumberId ?? env.WHATSAPP_PHONE_NUMBER_ID;
  const idFlow =
    env.TESTEFLOW && env.FLOWTESTE_ID
      ? env.FLOWTESTE_ID
      : flowId ?? env.FLOW01_ID ?? env.FLOW_ID;
  if (!env.WHATSAPP_TOKEN || !numeroId || !idFlow) {
    throw new Error('Configuração do WhatsApp não encontrada.');
  }
  const tela =
    telaInicial ??
    (env.TESTEFLOW && env.FLOWTESTE_ID
      ? 'TESTE'
      : idFlow === env.FLOW03_ID
        ? 'STEP_SINTOMAS'
        : idFlow === env.FLOW02_ID
          ? 'DIABETES_TYPE_CHECK'
          : 'BREAK_PATTERN');
  console.log('[GLUCO:WHATSAPP]', { acao: 'enviar_flow', telefone, flowId: idFlow, phoneNumberId: numeroId });
  const url = `https://graph.facebook.com/v21.0/${numeroId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: telefone,
    type: 'interactive',
    interactive: {
      type: 'flow',
      header: { type: 'text', text: '🧬 Gluco AI' },
      body: {
        text: texto ?? textoConviteFlow,
      },
      footer: { text: 'Powered by Gluco AI 🧬' },
      action: {
        name: 'flow',
        parameters: {
          flow_message_version: '3',
          flow_token: criarFlowToken(telefone),
          flow_id: idFlow,
          flow_cta: flowCta ?? 'Controlar Glicemia Agora',
          flow_action: 'navigate',
          flow_action_payload: {
            screen: tela,
            ...(dadosInicial ? { data: dadosInicial } : {}),
          },
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
    const respostaNormalizada = normalizarResposta(mensagem.texto);
    const respostaChave = normalizarChave(mensagem.texto ?? '');
    if (mensagem.tipo === 'interactive') {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'resposta_interactive',
        telefone,
        texto: mensagem.texto,
        respostaNormalizada,
        respostaChave,
        interactiveTipo: mensagem.interactiveTipo,
      });
    }
    if (['flow_como_funciona', 'como funciona', 'como funciona?'].includes(respostaNormalizada)) {
      const primeiroNome = obterPrimeiroNome(paciente.nome);
      await enviarComoFuncionaComBotao(telefone, paciente.id, primeiroNome, phoneNumberId);
      return;
    }
    if (['flow_iniciar', 'sim, quero começar', 'sim, quero começar!', 'sim quero começar'].includes(respostaNormalizada)) {
      await enviarFlowDireto(telefone, phoneNumberId, textoFlowDireto, 'Controlar Glicemia Agora', env.FLOW01_ID);
      await atualizarPacienteOnboarding(paciente.id, {
        onboardingStatus: 'EM_ANDAMENTO',
        onboardingEtapa: 'FLOW01_ENVIADO',
      });
      return;
    }
    const gestacionalAvisar = [
      'gestacionalavisar',
      'simqueroseravisada',
      'queroseravisada',
    ].includes(respostaChave);
    const gestacionalNao = ['gestacionalnao', 'naoobrigada'].includes(respostaChave);
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'gestacional_match',
      telefone,
      onboardingEtapa: paciente.onboardingEtapa,
      gestacionalAvisar,
      gestacionalNao,
      respostaChave,
    });
    if (paciente.onboardingEtapa === 'GESTACIONAL_AVISO' || gestacionalAvisar || gestacionalNao) {
      if (gestacionalAvisar) {
        console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_resposta', telefone, escolha: 'avisar' });
        try {
          await atualizarPacienteOnboarding(paciente.id, {
            waitlistGestacional: true,
            onboardingStatus: 'CONCLUIDO',
            onboardingEtapa: 'GESTACIONAL_WAITLIST',
          });
        } catch (erro) {
          console.log('[GLUCO:WHATSAPP]', {
            acao: 'gestacional_erro_atualizar',
            telefone,
            erro: (erro as Error).message,
          });
        }
        const mensagemAvisada =
          `Perfeito, *${obterPrimeiroNome(paciente.nome)}*! 🥰 Você já está na lista.\n\n` +
          'Assim que lançarmos o suporte completo para diabetes gestacional, você será uma das primeiras a saber.\n\n' +
          'Cuide-se muito, e qualquer dúvida pode me chamar aqui. Estou sempre por perto. 💚';
        console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_envio_mensagem', telefone, tipo: 'avisar' });
        await enviarTextoComRegistro(telefone, paciente.id, mensagemAvisada, phoneNumberId);
        return;
      }
      if (gestacionalNao) {
        console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_resposta', telefone, escolha: 'nao' });
        try {
          await atualizarPacienteOnboarding(paciente.id, {
            waitlistGestacional: false,
            onboardingStatus: 'CONCLUIDO',
            onboardingEtapa: 'GESTACIONAL_FINAL',
          });
        } catch (erro) {
          console.log('[GLUCO:WHATSAPP]', {
            acao: 'gestacional_erro_atualizar',
            telefone,
            erro: (erro as Error).message,
          });
        }
        const mensagemFinal =
          `Tudo bem, *${obterPrimeiroNome(paciente.nome)}*! Respeito sua decisão. 🙏\n\n` +
          'Cuide muito de você e do seu bebê.\n\n' +
          'Se um dia quiser conversar, é só me chamar aqui. 💚';
        console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_envio_mensagem', telefone, tipo: 'nao' });
        await enviarTextoComRegistro(telefone, paciente.id, mensagemFinal, phoneNumberId);
        return;
      }
    }
    if (paciente.onboardingEtapa === 'TERMO_ANALISE_PENDENTE' || paciente.onboardingEtapa === 'TERMO_ANALISE_RECUSADO') {
      const resposta = respostaNormalizada;
      const respostaTermoChave = normalizarChave(mensagem.texto ?? '');
      if (
        ['termo_concordar', 'concordar', 'concordar termos', 'termo_concordar_retorno'].includes(resposta) ||
        ['simconcordar', 'concordar', 'termocontinuar'].includes(respostaTermoChave)
      ) {
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
      if (
        ['termo_discordar', 'discordar', 'termo_nao_compartilhar'].includes(resposta) ||
        ['naoconcordo', 'termonaocompartilhar'].includes(respostaTermoChave)
      ) {
        await atualizarPacienteOnboarding(paciente.id, {
          termosAceitos: false,
          onboardingStatus: 'EM_ANDAMENTO',
          onboardingEtapa: 'TERMO_ANALISE_RECUSADO',
        });
        const mensagemRecusa =
          `${obterPrimeiroNome(paciente.nome)}, entendo a sua preocupação e respeito muito isso. 🙏\n\n` +
          'Antes de confirmar, quero que você saiba o que significa *não compartilhar seus dados*:\n\n' +
          '⚠️ *1. Sem personalização*\n' +
          'Não consigo adaptar as orientações ao seu tipo de diabetes, histórico e metas. Você recebe respostas genéricas, não para o seu caso.\n\n' +
          '⚠️ *2. Sem protocolo de emergência*\n' +
          'Não é possível ativar o Protocolo AQS nem acionar seu contato de emergência em situações críticas.\n\n' +
          '⚠️ *3. Sem acompanhamento de evolução*\n' +
          'Sem histórico salvo, não consigo identificar padrões, prever picos nem mostrar sua evolução ao longo do tempo.\n\n' +
          'Tem certeza que prefere não compartilhar?';
        await enviarBotoesComRegistro(
          telefone,
          paciente.id,
          mensagemRecusa,
          botoesRecuperacaoTermos,
          phoneNumberId,
        );
        return;
      }
      if (['termo_continuar', 'vamos continuar', 'vamos continuar!'].includes(resposta)) {
        await atualizarPacienteOnboarding(paciente.id, {
          termosAceitos: true,
          onboardingStatus: 'CONCLUIDO',
          onboardingEtapa: 'FLOW_CONCLUIDO',
        });
        await enviarAnalisePosFlow(telefone, paciente, phoneNumberId);
        return;
      }
      if (['termo_nao_compartilhar', 'não compartilhar', 'nao compartilhar'].includes(resposta)) {
        await desativarPacienteWhatsapp(paciente.id);
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          `Tudo bem, ${obterPrimeiroNome(paciente.nome)}! Respeito sua decisão. 🙏\n\n` +
            'Cuide muito de você e do seu bebê.\n\n' +
            'Se um dia quiser conversar, é só me chamar aqui. 💚',
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
      const texto = respostaNormalizada;
      const deveDispararFlow = texto && gatilhosFlow.some((gatilho) => texto.includes(gatilho));
      if (mensagem.tipo === 'text' && deveDispararFlow) {
        await enviarConviteFlowComBotoes(telefone, paciente.id, phoneNumberId);
        await atualizarPacienteOnboarding(paciente.id, {
          onboardingStatus: 'EM_ANDAMENTO',
          onboardingEtapa: 'FLOW01_ENVIADO',
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

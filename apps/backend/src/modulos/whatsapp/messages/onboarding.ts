const botoesConviteFlow = [
  { id: 'FLOW_CONTROLAR_AGORA', titulo: 'Controlar Agora' },
  { id: 'FLOW_COMO_FUNCIONA', titulo: 'Como Funciona?' },
];

const botoesBreakPattern = [
  { id: 'BREAK_CONTROLADO', titulo: 'Controlo Direitinho' },
  { id: 'BREAK_DESCUIDADO', titulo: 'Não Lembro Direito' },
];

const botoesComecarFlow = [{ id: 'FLOW_COMECAR', titulo: 'Sim, quero começar!' }];

const ctaFlowContinuar = 'Ok, vamos continuar';
const ctaFlowBreak = 'Sim, vamos lá!';
const ctaFlowPadrao = 'Controlar Glicemia Agora';
const textoCabecalhoFlow = '🧬 Gluco AI';
const textoRodapeFlow = 'Powered by Gluco AI 🧬';

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
  '👉 Vamos começar seu controle agora? Leva menos de 2 minutos ⏱️';

const textoBreakPattern =
  'Antes da gente começar… deixa eu te perguntar uma coisa 😄\n' +
  '(Sem julgamentos… estamos juntos nisso 🤝)\n\n' +
  '👉 *Você é do tipo que*:\n' +
  '1️⃣ Controla a glicemia direitinho\n' +
  '2️⃣ Só lembra quando dá problema 😬';

const textoMotivacaoControlado =
  'Que incrível! 🎉 Então vou te ajudar a manter esse controle com ainda mais precisão e inteligência.\n\n' +
  '*Meu objetivo é simples*:\n' +
  '👉 Te ajudar a evitar picos de glicemia.\n' +
  '👉 Reduzir riscos de complicações.\n' +
  '👉 E te ensinar a comer bem sem neura 🍽️\n\n' +
  'Vou te fazer algumas perguntas rápidas (*menos de 2 minutos* ⏱️) e já começo a te acompanhar de forma personalizada.';

const textoMotivacaoDescuidado =
  'Haha, você é honesto(a)! 😄 A maioria das pessoas também é assim. Mas isso vai mudar agora.\n\n' +
  '*Meu objetivo é simples*:\n' +
  '👉 Te ajudar a evitar picos de glicemia.\n' +
  '👉 Reduzir riscos de complicações.\n' +
  '👉 E te ensinar a comer bem sem neura 🍽️\n\n' +
  'Vou te fazer algumas perguntas rápidas (*menos de 2 minutos* ⏱️) e já começo a te acompanhar de forma personalizada.';

const textoContinuarFlow02 =
  'Perfeito! Estamos quase lá com seu cadastro.\n' +
  'Toque no botão abaixo para continuar.';

function mensagemComoFunciona() {
  return (
    'Boa pergunta! 😄 Funciona assim:\n\n' +
    '📲 Você me envia pelo WhatsApp:\n' +
    '• Sua glicemia (digitando ou foto do aparelho).\n' +
    '• Foto do que vai comer.\n\n' +
    '🧠 Eu analiso em segundos e te digo:\n' +
    '• Como está sua glicemia e o que fazer.\n' +
    '• Se sua refeição é segura para você.\n' +
    '• Quanto sua glicemia pode subir depois de comer.\n\n' +
    '⚡ Se a sua glicemia estiver muito alta, ativo automaticamente o Protocolo AQS e te acompanho a cada 1 hora até normalizar, dessa forma, juntos, evitamos as complicações.\n\n' +
    'Tudo pelo WhatsApp. Sem baixar nenhum app. 📱\n\n' +
    'Pronto pra começar? 🚀'
  );
}

function mensagemNaoSei(primeiroNome: string) {
  return (
    `Tudo bem *${primeiroNome}*! Isso acontece mais do que você imagina 😊\n\n` +
    'Vou continuar configurando seu perfil de forma mais geral por enquanto.\n\n' +
    '⚠️ Para resultados mais precisos, recomendo pedir ao seu médico para confirmar o tipo de diabetes na próxima consulta. Depois é só me avisar e eu atualizo tudo!\n\n' +
    'Vamos continuar? 🚀'
  );
}

function mensagemContinuar(primeiroNome: string) {
  return (
    `Perfeito, *${primeiroNome}*.\n\n` +
    'Estamos quase lá com seu cadastro, toque no botão abaixo para continuar.'
  );
}

function mensagemComAparelho(primeiroNome: string) {
  return (
    `Parabéns, ${primeiroNome}! 🎉 Isso faz TODA a diferença.\n\n` +
    'Ter o aparelho em casa significa que você já está um passo à frente na prevenção de complicações sérias.\n\n' +
    'A partir de agora vamos usar cada medição para construir o seu controle com precisão. 🎯\n\n' +
    'Vamos continuar agora?'
  );
}

function mensagemSemAparelho(primeiroNome: string) {
  return (
    `${primeiroNome}, preciso ser direto(a) com você sobre algo muito importante. 🚨\n\n` +
    '*Uma pessoa diabética sem aparelho de glicemia é como dirigir com os olhos vendados.*\n\n' +
    'Sem medir, você não sabe se sua glicemia está normal, alta ou em colapso — e isso pode levar a complicações sérias como neuropatia, problemas renais e na visão.\n\n' +
    'Posso te ajudar com análise de refeições e previsões, *mas o controle real só é possível com medições reais.*\n\n' +
    '📍 *Como conseguir seu aparelho agora:*\n\n' +
    '1️⃣ *Pelo SUS (grátis):* Vá ao seu posto de saúde com sua carteirinha do SUS e diagnóstico de diabetes. Diabéticos têm direito ao glicosímetro e às fitas pelo SUS.\n\n' +
    '2️⃣ *Por compra:* Qualquer farmácia tem aparelhos a partir de R$50–R$80. As fitas de teste são o item mais importante — verifique o custo antes de escolher o modelo.\n\n' +
    '👉 *Te peço apenas uma coisa:* vá conseguir o seu ainda esta semana. Quando tiver, me avisa que continuamos juntos com controle total. 💪\n\n' +
    'Agora vamos continuar seu cadastro'
  );
}

export {
  botoesConviteFlow,
  botoesBreakPattern,
  botoesComecarFlow,
  ctaFlowContinuar,
  ctaFlowBreak,
  ctaFlowPadrao,
  textoCabecalhoFlow,
  textoRodapeFlow,
  textoConviteFlow,
  textoBreakPattern,
  textoMotivacaoControlado,
  textoMotivacaoDescuidado,
  textoContinuarFlow02,
  mensagemComoFunciona,
  mensagemNaoSei,
  mensagemContinuar,
  mensagemComAparelho,
  mensagemSemAparelho,
};

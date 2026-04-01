function montarMensagemAnalise(params: {
  primeiroNome: string;
  imc: number | null;
  classificacaoImc: string;
  riscoTexto: string;
  fraseRisco: string;
  scoreTotal?: number | null;
  scoreNivelTexto: string;
  scoreMensagem?: string | null;
}) {
  const {
    primeiroNome,
    imc,
    classificacaoImc,
    riscoTexto,
    fraseRisco,
    scoreTotal,
    scoreNivelTexto,
    scoreMensagem,
  } = params;
  return (
    `*${primeiroNome}*, analisei seu perfil… e vou ser direto com você 👇\n\n` +
    '🧬 Seu corpo já está mostrando sinais importantes\n' +
    `📊 *Seu IMC*: ${imc ?? 'Não informado'}\n` +
    `🚨 *Classificação*: ${classificacaoImc}\n` +
    `⚠️ *Risco Metabólico*: ${riscoTexto}\n` +
    `🧮 *Seu escore*: ${scoreTotal ?? 'Não calculado'} (${scoreNivelTexto})\n\n` +
    (scoreMensagem ? `${scoreMensagem}\n\n` : '') +
    '👉 *Isso significa que*:\n' +
    `${fraseRisco}\n\n` +
    '🔥 *Mas a boa notícia é*:\n' +
    'Você está no momento PERFEITO para controlar isso...'
  );
}

function montarMensagemMetas(params: {
  kcal: number | null;
  macros: { proteina?: number; carboidratos?: number; gorduras?: number } | null;
  scoreFrequencia?: string | null;
}) {
  const { kcal, macros, scoreFrequencia } = params;
  return (
    '*Suas Metas Diárias Personalizadas* 🎯\n\n' +
    `🔥 *Meta calórica*: ${kcal ?? 'Não informado'} kcal/dia\n\n` +
    '🥗 *Distribuição ideal*:\n' +
    `• Proteínas: ${macros?.proteina ?? 'Não informado'}g\n` +
    `• Carboidratos: ${macros?.carboidratos ?? 'Não informado'}g\n` +
    `• Gorduras: ${macros?.gorduras ?? 'Não informado'}g\n\n` +
    '🩸 *Meta glicêmica* (Diretrizes SBD 2023):\n' +
    '• Jejum: entre 80 e 130 mg/dL\n' +
    '• Pós-refeição (2h): abaixo de 150 mg/dL\n\n' +
    `⏱️ Frequência ideal de medição: ${scoreFrequencia ?? 'Não informado'}`
  );
}

function montarMensagemPosicionamento(primeiroNome: string) {
  return (
    `Agora vem a parte mais importante, e a que vai mudar sua vida para sempre *${primeiroNome}*…\n\n` +
    'Eu vou acompanhar você de perto… e você vai ver sua glicemia começar a responder sem necessidade de tomar mais remédios 👀\n\n' +
    'A partir de hoje eu vou:\n' +
    '✅ Analisar suas refeições 🍽️\n' +
    '✅ Prever impacto na glicemia 📈\n' +
    '✅ Te ajudar a evitar picos 🚫\n' +
    '✅ E te guiar até o controle real da diabetes.\n\n'
  );
}

function montarMensagemProximoPasso(primeiroNome: string, sozinhoA: string) {
  return (
    `🚀 *${primeiroNome}*, agora vamos começar de verdade?\n\n` +
    'Me envia uma das seguintes informações:\n\n' +
    '📸 Foto da sua próxima refeição (lanche, almoço, janta, etc.).\n' +
    '📷 Foto da leitura da sua glicemia no glicosímetro.\n' +
    '🩺 O valor da sua última leitura de glicemia.\n\n' +
    '👉 *Não tem nenhuma dessas agora?*\n' +
    'Sem problema, me chama aqui quando tiver e eu já te respondo na hora. 📲\n\n' +
    '⏰ *E se esquecer, não preocupa*, eu volto aqui em 2 horas pra te lembrar.\n\n' +
    `🛡️ A partir de agora você nunca mais estará ${sozinhoA}, *${primeiroNome}*.\n\n` +
    'Cada foto que você me mandar vai virar:\n' +
    '✅ Uma análise e um plano de tratamento natural.\n' +
    '✅ Uma ação para evitar ter que tomar mais remédios.\n' +
    '✅ Você mais perto de se libertar de sintomas e complicações.\n\n' +
    '*Tudo isso sem sair do WhatsApp*. Só manda a foto, *eu cuido do resto.* 💪'
  );
}

export {
  montarMensagemAnalise,
  montarMensagemMetas,
  montarMensagemPosicionamento,
  montarMensagemProximoPasso,
};

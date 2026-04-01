const botoesGestacional = [
  { id: 'GESTACIONAL_AVISAR', titulo: 'Quero ser avisada' },
  { id: 'GESTACIONAL_NAO', titulo: 'Não, obrigada' },
];

function mensagemGestacional(primeiroNome: string) {
  return (
    `Opa ${primeiroNome}! 🌸\n\n` +
    'No momento o Gluco AI é focado em pessoas com diabetes tipo 1 ou tipo 2.\n\n' +
    'Mas fica tranquila, você não vai ficar sem ajuda!\n\n' +
    '👉 Te recomendo procurar um pré-natalista ou endocrinologista especializado em diabetes gestacional.\n\n' +
    'Posso te avisar quando lançarmos o suporte para diabetes gestacional?'
  );
}

function mensagemAvisada(primeiroNome: string) {
  return (
    `Perfeito, *${primeiroNome}*! 🥰 Você já está na lista.\n\n` +
    'Assim que lançarmos o suporte completo para diabetes gestacional, você será uma das primeiras a saber.\n\n' +
    'Cuide-se muito, e qualquer dúvida pode me chamar aqui. Estou sempre por perto. 💚'
  );
}

function mensagemFinalGestacional(primeiroNome: string) {
  return (
    `Tudo bem, *${primeiroNome}*! Respeito sua decisão. 🙏\n\n` +
    'Cuide muito de você e do seu bebê.\n\n' +
    'Se um dia quiser conversar, é só me chamar aqui. 💚'
  );
}

export { botoesGestacional, mensagemGestacional, mensagemAvisada, mensagemFinalGestacional };

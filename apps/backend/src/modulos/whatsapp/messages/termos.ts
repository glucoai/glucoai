const botoesTermosAnalise = [
  { id: 'TERMO_CONCORDAR', titulo: 'Sim, Concordar' },
  { id: 'TERMO_DISCORDAR', titulo: 'Não Concordo' },
];

const botoesRecuperacaoTermos = [
  { id: 'TERMO_CONTINUAR', titulo: 'Vamos continuar!' },
  { id: 'TERMO_NAO_COMPARTILHAR', titulo: 'Não compartilhar' },
];

const mensagemAceiteObrigatorio = 'Para continuar, preciso do seu aceite dos termos.';

function mensagemTermos(primeiroNome: string) {
  return (
    `*${primeiroNome}*, estou analisando seu perfil por aqui.\n\n` +
    'Antes de poder te enviar o resultado, uma informação importante 🔒\n\n' +
    'Os dados que foram coletados é estritamente para personalizar o seu acompanhamento\n\n' +
    '*Seus dados são*:\n' +
    '✅ Criptografados e armazenados no Brasil\n' +
    '✅ Nunca compartilhados com terceiros\n' +
    '✅ Protegidos pela LGPD\n\n' +
    'Ao continuar, você concorda com nossos termos de uso que estão disponíveis em: https://glucoia.com/termos-de-uso\n\n' +
    'Certifique-se de que leu, e toque em uma das opções abaixo.'
  );
}

function mensagemRecusa(primeiroNome: string) {
  return (
    `${primeiroNome}, entendo a sua preocupação e respeito muito isso. 🙏\n\n` +
    'Antes de confirmar, quero que você saiba o que significa *não compartilhar seus dados*:\n\n' +
    '⚠️ *1. Sem personalização*\n' +
    'Não consigo adaptar as orientações ao seu tipo de diabetes, histórico e metas. Você recebe respostas genéricas, não para o seu caso.\n\n' +
    '⚠️ *2. Sem protocolo de emergência*\n' +
    'Não é possível ativar o Protocolo AQS nem acionar seu contato de emergência em situações críticas.\n\n' +
    '⚠️ *3. Sem acompanhamento de evolução*\n' +
    'Sem histórico salvo, não consigo identificar padrões, prever picos nem mostrar sua evolução ao longo do tempo.\n\n' +
    'Tem certeza que prefere não compartilhar?'
  );
}

function mensagemNaoCompartilhar(primeiroNome: string) {
  return (
    `Tudo bem, ${primeiroNome}! Respeito sua decisão. 🙏\n\n` +
    'Cuide muito de você e do seu bebê.\n\n' +
    'Se um dia quiser conversar, é só me chamar aqui. 💚'
  );
}

export {
  botoesTermosAnalise,
  botoesRecuperacaoTermos,
  mensagemAceiteObrigatorio,
  mensagemTermos,
  mensagemRecusa,
  mensagemNaoCompartilhar,
};

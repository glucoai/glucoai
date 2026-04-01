type ScoreNivel = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO';

type ScoreMensagem = {
  mensagem: string;
  frequencia: string;
};

function obterMensagemScore(nivel: ScoreNivel): ScoreMensagem {
  if (nivel === 'BAIXO') {
    return {
      mensagem:
        'Seu perfil mostra um risco controlável. Com pequenos ajustes no dia a dia, você pode manter a glicemia estável por muito tempo.',
      frequencia: '2x/dia',
    };
  }
  if (nivel === 'MODERADO') {
    return {
      mensagem:
        'Seu histórico indica que a glicemia já criou alguns padrões que precisam de atenção. Agir agora evita complicações nos próximos anos.',
      frequencia: '3x/dia',
    };
  }
  if (nivel === 'ALTO') {
    return {
      mensagem:
        'Seu organismo está mostrando sinais de que a glicemia vem impactando sua saúde. Quanto antes você agir, mais fácil será reverter esse quadro.',
      frequencia: '4x/dia',
    };
  }
  return {
    mensagem:
      'Seu perfil indica risco elevado. Vamos trabalhar intensivamente juntos. Você não está sozinho nessa — e isso muda a partir de agora.',
    frequencia: '4–6x/dia + acompanhamento AQS ativo',
  };
}

export type { ScoreNivel };
export { obterMensagemScore };

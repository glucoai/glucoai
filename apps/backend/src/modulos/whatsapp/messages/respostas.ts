const mensagemCadastroIndisponivel =
  'Não consegui iniciar seu cadastro no momento. Por favor, tente novamente em alguns minutos.';

const mensagemSolicitarCadastro = 'Para iniciar o cadastro, digite "oi" ou "cadastrar".';

const mensagemFallback = 'Não entendi sua mensagem. Digite "menu" para ver as opções disponíveis.';

const mensagemGlicemiaInvalida = 'Não consegui entender o valor da glicemia. Tente enviar apenas o número.';

const mensagemGlicemiaErro = 'Não consegui registrar sua glicemia agora. Tente novamente em alguns minutos.';

const mensagemImagemIndisponivel = 'Não consegui acessar sua foto. Pode enviar novamente?';

const mensagemAnaliseIndisponivel = 'Não consegui iniciar a análise agora. Tente novamente em alguns minutos.';

const mensagemFotoAparelhoRecebida = 'Foto do aparelho recebida! 📊 Vou ler a medição e já te retorno.';

const mensagemFotoClassificando = 'Foto recebida! Vou identificar se é glicemia ou refeição e já te retorno.';

const mensagemFotoRefeicaoRecebida = 'Foto recebida! 🍽️ Vou analisar e já te retorno com a orientação.';

const mensagemFotoProcessarErro =
  'Não consegui processar sua foto agora. Tente novamente em alguns minutos.';

const mensagemEscoreNaoCalculado =
  '⚠️ *Escore ainda não calculado*\n\nSe quiser, posso recalcular após seu próximo fluxo.';

function montarMensagemGlicemiaRegistrada(valor: number) {
  return (
    `Glicemia de ${Math.round(valor)} mg/dL registrada! 📊\n` +
    'Analisando e em breve envio sua orientação... 🧠'
  );
}

function montarMensagemPerfil(nome: string, tipoTexto: string, metaMin: number, metaMax: number) {
  return `Seu perfil:\n${nome}\nTipo: ${tipoTexto}\nMeta: ${metaMin}-${metaMax} mg/dL`;
}

function montarMensagemHistoricoSemRegistros(resumoScore: string) {
  return `Ainda não encontrei registros de glicemia nos últimos 7 dias.\n\n${resumoScore}`;
}

function montarMensagemHistoricoResumo(params: {
  total: number;
  media: number;
  ultima: number;
  resumoScore: string;
}) {
  const { total, media, ultima, resumoScore } = params;
  return (
    `Resumo dos últimos 7 dias:\n${total} registros\nMédia: ${media} mg/dL\nÚltima: ${Math.round(
      ultima,
    )} mg/dL\n\n${resumoScore}`
  );
}

function montarMensagemResumoScore(
  total: number,
  nivel: string,
  mensagem?: string | null,
  frequencia?: string | null,
) {
  const blocos = [
    `🧮 *Seu último escore*: ${total} (${nivel})`,
    mensagem ? `💬 *Orientação*: ${mensagem}` : '',
    frequencia ? `📌 *Frequência sugerida*: ${frequencia}` : '',
  ].filter(Boolean);
  return blocos.join('\n\n');
}

export {
  mensagemCadastroIndisponivel,
  mensagemSolicitarCadastro,
  mensagemFallback,
  mensagemGlicemiaInvalida,
  mensagemGlicemiaErro,
  mensagemImagemIndisponivel,
  mensagemAnaliseIndisponivel,
  mensagemFotoAparelhoRecebida,
  mensagemFotoClassificando,
  mensagemFotoRefeicaoRecebida,
  mensagemFotoProcessarErro,
  mensagemEscoreNaoCalculado,
  montarMensagemGlicemiaRegistrada,
  montarMensagemPerfil,
  montarMensagemHistoricoSemRegistros,
  montarMensagemHistoricoResumo,
  montarMensagemResumoScore,
};

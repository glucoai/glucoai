type ScoreNivel = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO';
type ScoreResultado = { total: number; nivel: ScoreNivel; mensagem: string; frequencia: string };
function normalizarTexto(texto?: string | null) {
  return (texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
function normalizarResposta(texto?: string | null) { return normalizarTexto(texto); }
function normalizarChave(chave: string) { return normalizarTexto(chave).replace(/[^a-z0-9]/g, ''); }
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
function obterValorPorChaves(dados: Record<string, unknown> | null, chaves: string[]) {
  if (!dados) return undefined;
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
  if (['nao', 'n', 'false', '0'].includes(texto)) return false;
  return null;
}
function extrairNumeroDecimal(valor: string) {
  const texto = valor.replace(',', '.');
  const match = texto.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const numero = Number(match[1]);
  return Number.isFinite(numero) ? numero : null;
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
function classificarImc(imc: number) {
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}
function obterMensagemScore(nivel: ScoreNivel) {
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
function determinarNivelScore(total: number): ScoreNivel {
  if (total <= 6) return 'BAIXO';
  if (total <= 12) return 'MODERADO';
  if (total <= 18) return 'ALTO';
  return 'CRITICO';
}
function calcularQuantidadeSintomas(valor: unknown) {
  if (Array.isArray(valor)) {
    const filtrados = valor.filter((item) => normalizarResposta(String(item)) !== 'nenhum');
    return filtrados.length;
  }
  if (typeof valor === 'string') {
    const itens = valor
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => normalizarResposta(item) !== 'nenhum');
    return itens.length;
  }
  const bool = parsearBooleano(valor);
  return bool ? 1 : 0;
}
function pontuarTipoDiabetes(tipo?: string | null) { if (!tipo) return null; if (tipo === 'TIPO_1') return 3; if (tipo === 'TIPO_2') return 2; return 0; }
function pontuarTempo(anos?: number | null) { if (typeof anos !== 'number') return null; if (anos < 2) return 1; if (anos <= 10) return 2; return 3; }
function pontuarControle(controle?: string | null) { if (!controle) return null; const texto = normalizarResposta(controle); if (texto.includes('descontrolado')) return 3; if (texto.includes('nao sei')) return 2; return 0; }
function pontuarEmergencia(emergencia?: boolean | null) { if (typeof emergencia !== 'boolean') return null; return emergencia ? 3 : 0; }
function pontuarPico(pico?: number | null) { if (typeof pico !== 'number') return null; if (pico >= 400) return 3; if (pico >= 300) return 2; if (pico >= 200) return 1; return 0; }
function pontuarSintomas(qtd?: number | null) { if (typeof qtd !== 'number') return null; if (qtd >= 3) return 3; if (qtd >= 1) return 2; return 0; }
function pontuarImc(imc?: number | null) { if (typeof imc !== 'number') return null; const classificacao = classificarImc(imc); if (classificacao === 'Obesidade') return 2; if (classificacao === 'Sobrepeso') return 1; return 0; }
function pontuarAlimentacao(valor?: string | null) { if (!valor) return null; const texto = normalizarResposta(valor); if (texto.includes('muito desorganizada')) return 2; return 0; }
function pontuarMedicamentos(valor?: string | null) { if (!valor) return null; const texto = normalizarResposta(valor); if (texto.includes('insulina')) return 1; return 0; }
function calcularScoreMetabolico(dados: {
  tipoDiabetes?: string | null;
  anosDiagnostico?: number | null;
  controleDiabetes?: string | null;
  emergencia?: boolean | null;
  picoGlicemia?: number | null;
  quantidadeSintomas?: number | null;
  imc?: number | null;
  alimentacao?: string | null;
  medicamentos?: string | null;
}) {
  const pontuacoes = [
    pontuarTipoDiabetes(dados.tipoDiabetes),
    pontuarTempo(dados.anosDiagnostico),
    pontuarControle(dados.controleDiabetes),
    pontuarEmergencia(dados.emergencia),
    pontuarPico(dados.picoGlicemia),
    pontuarSintomas(dados.quantidadeSintomas),
    pontuarImc(dados.imc),
    pontuarAlimentacao(dados.alimentacao),
    pontuarMedicamentos(dados.medicamentos),
  ];
  let total = 0;
  let temDados = false;
  for (const pontos of pontuacoes) {
    if (pontos !== null) {
      total += pontos;
      temDados = true;
    }
  }
  if (!temDados) return null;
  const nivel = determinarNivelScore(total);
  const { mensagem, frequencia } = obterMensagemScore(nivel);
  return { total, nivel, mensagem, frequencia } as ScoreResultado;
}
export {
  type ScoreNivel,
  type ScoreResultado,
  calcularQuantidadeSintomas,
  calcularScoreMetabolico,
  extrairTextoResposta,
  obterValorPorChaves,
  parsearAnosDiagnostico,
  parsearBooleano,
  parsearNumero,
  normalizarResposta,
};

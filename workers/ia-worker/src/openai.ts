import { env } from './infra.js';

type AnaliseImagem = {
  alimentos?: string[];
  calorias?: number;
  carboidratos?: number;
  ig?: number;
  cg?: number;
};

type OpenAIChoice = {
  message?: { content?: string | null };
};

type OpenAIResponse = {
  choices?: OpenAIChoice[];
};

async function chamarOpenAI(
  modelo: string,
  mensagens: { role: string; content: unknown }[],
  jsonMode = false,
) {
  try {
    const body = {
      model: modelo,
      messages: mensagens,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    };
    const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_CHAVE}`,
      },
      body: JSON.stringify(body),
    });
    if (!resposta.ok) {
      throw new Error('Falha ao chamar OpenAI.');
    }
    const payload = (await resposta.json()) as OpenAIResponse;
    const texto = payload.choices?.[0]?.message?.content?.trim();
    if (!texto) {
      throw new Error('Resposta inválida da OpenAI.');
    }
    return texto;
  } catch (erro) {
    console.log('Erro ao chamar OpenAI.', erro);
    return '';
  }
}

function promptSistemaGlicemia() {
  return [
    'Você é um assistente de saúde para pacientes com diabetes.',
    'Responda em Português BR, linguagem simples e encorajadora.',
    'Nunca use jargão médico. Máximo 3 parágrafos curtos.',
    'Se glicemia crítica (>300 ou <60): seja gentil mas urgente.',
  ].join(' ');
}

async function analisarImagem(base64: string) {
  try {
    const resposta = await chamarOpenAI(
      'gpt-4o-mini',
      [
        {
          role: 'system',
          content:
            'Analise a imagem e responda apenas em JSON com: alimentos, calorias, carboidratos, ig, cg.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identifique alimentos e estime macros.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
          ],
        },
      ],
      true,
    );
    return parseJsonSeguro<AnaliseImagem>(resposta);
  } catch (erro) {
    console.log('Erro ao analisar imagem.', erro);
    return {};
  }
}

async function gerarRecomendacaoRefeicao(analise: AnaliseImagem) {
  try {
    const alimentos = (analise.alimentos ?? []).join(', ') || 'alimentos não identificados';
    const texto = [
      `Alimentos: ${alimentos}.`,
      `Calorias: ${analise.calorias ?? 0} kcal.`,
      `Carboidratos: ${analise.carboidratos ?? 0} g.`,
      `IG: ${analise.ig ?? 0}.`,
      `CG: ${analise.cg ?? 0}.`,
    ].join(' ');
    const resposta = await chamarOpenAI('gpt-4o', [
      {
        role: 'system',
        content: 'Responda em Português BR com linguagem simples e no máximo 4 linhas.',
      },
      {
        role: 'user',
        content:
          `🍽️ Identifiquei na sua refeição: ${alimentos}. ` +
          `📊 Estimativa: ${analise.calorias ?? 0} kcal | ${analise.carboidratos ?? 0}g carboidratos. ` +
          `🧠 Sua glicemia pode subir ~${analise.ig ?? 0}-${analise.cg ?? 0} mg/dL. ` +
          `💡 Gere uma orientação personalizada.`,
      },
    ]);
    return resposta || texto;
  } catch (erro) {
    console.log('Erro ao gerar recomendação.', erro);
    return 'Não foi possível gerar a recomendação agora. Tente novamente mais tarde.';
  }
}

function parseJsonSeguro<T>(valor: string): T {
  try {
    return JSON.parse(valor) as T;
  } catch {
    return {} as T;
  }
}

export { chamarOpenAI, promptSistemaGlicemia, analisarImagem, gerarRecomendacaoRefeicao };
export type { AnaliseImagem };

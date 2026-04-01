import { env } from './infra.js';

type AnaliseImagem = {
  alimentos?: Array<string | { nome?: string }>;
  calorias?: number;
  carboidratos?: number;
  ig?: number;
  cg?: number;
  confianca?: 'alta' | 'media' | 'baixa';
  observacao?: string;
};
type ClassificacaoImagem = {
  tipo?: 'GLICEMIA' | 'REFEICAO' | 'OUTRO';
  confianca?: 'alta' | 'media' | 'baixa';
  observacao?: string;
};
type AnaliseGlicemiaImagem = {
  valor?: number | null;
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
      const erroTexto = await resposta.text();
      console.log('[GLUCO:OPENAI]', {
        acao: 'falha_http',
        modelo,
        status: resposta.status,
        statusText: resposta.statusText,
        erro: erroTexto.slice(0, 800),
      });
      throw new Error('Falha ao chamar OpenAI.');
    }
    const payload = (await resposta.json()) as OpenAIResponse;
    const texto = payload.choices?.[0]?.message?.content?.trim();
    if (!texto) {
      console.log('[GLUCO:OPENAI]', { acao: 'resposta_vazia', modelo });
      throw new Error('Resposta inválida da OpenAI.');
    }
    return texto;
  } catch (erro) {
    console.log('[GLUCO:OPENAI]', { acao: 'erro_execucao', modelo, erro });
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
            'Responda apenas em JSON com o schema: { alimentos: [{ nome: string, calorias: number, carboidratos: number, ig: number, cg: number }], calorias: number, carboidratos: number, ig: number, cg: number, confianca: "alta" | "media" | "baixa", observacao: string }.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'Identifique alimentos, estime macros e avalie confiança. ' +
                'Se houver dúvida, marque confianca como "baixa" e descreva na observacao o que ficou incerto. ' +
                'Evite confundir pão com frutas.',
            },
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
    const alimentos = (analise.alimentos ?? [])
      .map((item) => (typeof item === 'string' ? item : item?.nome ?? ''))
      .map((item) => item.trim())
      .filter(Boolean);
    const calorias = Number(analise.calorias ?? 0);
    const carboidratos = Number(analise.carboidratos ?? 0);
    const ig = Number(analise.ig ?? 0);
    const cg = Number(analise.cg ?? 0);
    const confianca =
      typeof (analise as { confianca?: string }).confianca === 'string'
        ? (analise as { confianca?: string }).confianca
        : undefined;
    const observacao =
      typeof (analise as { observacao?: string }).observacao === 'string'
        ? (analise as { observacao?: string }).observacao
        : undefined;
    const resumoAlimentos = alimentos.length ? alimentos.join(', ') : 'alimentos não identificados';
    const textoFallback = [
      `🍽️ Alimentos identificados: ${resumoAlimentos}.`,
      `📊 Estimativa: ${calorias} kcal | ${carboidratos} g carboidratos.`,
      `📈 Possível impacto: IG ${ig} | CG ${cg}.`,
      confianca === 'baixa' && observacao
        ? `⚠️ Observação: ${observacao}`
        : 'Se algo estiver errado, me corrija para ajustar a análise.',
      confianca === 'baixa'
        ? '🙏 Pode me enviar a lista dos alimentos? Vou cruzar a lista com a foto para melhorar a precisão.'
        : '',
      'Se puder, confirme os alimentos para ajustar melhor.',
    ].join(' ');
    const resposta = await chamarOpenAI('gpt-4o', [
      {
        role: 'system',
        content:
          'Responda em Português BR, linguagem simples, sem jargão médico. Máximo 6 linhas. Sempre use o template: 1) 🍽️ Alimentos identificados: ... 2) 📊 Estimativa: ... 3) 📈 Possível impacto: ... 4) 💡 Orientação prática. Se confiança for baixa, inclua uma linha "⚠️ Observação: ..." e outra linha pedindo a lista dos alimentos para cruzar com a foto.',
      },
      {
        role: 'user',
        content:
          `🍽️ Alimentos identificados: ${resumoAlimentos}. ` +
          `📊 Estimativa: ${calorias} kcal | ${carboidratos} g carboidratos. ` +
          `📈 Possível impacto: IG ${ig} | CG ${cg}. ` +
          `${confianca === 'baixa' && observacao ? `⚠️ Observação: ${observacao}. ` : ''}` +
          `${confianca === 'baixa' ? '🙏 Peça a lista dos alimentos para cruzar com a foto. ' : ''}` +
          `💡 Gere uma orientação prática (ex: porção, combinação com fibras/proteína, água, ritmo de consumo).`,
      },
    ]);
    return resposta || textoFallback;
  } catch (erro) {
    console.log('Erro ao gerar recomendação.', erro);
    return 'Não foi possível gerar a recomendação agora. Tente novamente mais tarde.';
  }
}

async function extrairGlicemiaImagem(base64: string) {
  try {
    const resposta = await chamarOpenAI(
      'gpt-4o-mini',
      [
        {
          role: 'system',
          content:
            'Extraia o valor da glicemia exibido no aparelho e responda apenas em JSON com: valor (número ou null).',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Leia a medição no visor e retorne o número exato.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
          ],
        },
      ],
      true,
    );
    const payload = parseJsonSeguro<AnaliseGlicemiaImagem>(resposta);
    const valor = payload?.valor;
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      return null;
    }
    if (valor < 30 || valor > 600) {
      return null;
    }
    return Math.round(valor);
  } catch (erro) {
    console.log('Erro ao extrair glicemia da imagem.', erro);
    return null;
  }
}

async function classificarImagem(base64: string) {
  try {
    const resposta = await chamarOpenAI(
      'gpt-4o-mini',
      [
        {
          role: 'system',
          content:
            'Responda apenas em JSON com o schema: { tipo: "GLICEMIA" | "REFEICAO" | "OUTRO", confianca: "alta" | "media" | "baixa", observacao: string }.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'Classifique a imagem como aparelho de glicemia, prato/refeição ou outro. ' +
                'Se não tiver certeza, use confianca baixa e explique na observacao.',
            },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
          ],
        },
      ],
      true,
    );
    return parseJsonSeguro<ClassificacaoImagem>(resposta);
  } catch (erro) {
    console.log('Erro ao classificar imagem.', erro);
    return {};
  }
}

function parseJsonSeguro<T>(valor: string): T {
  try {
    return JSON.parse(valor) as T;
  } catch {
    return {} as T;
  }
}

export {
  chamarOpenAI,
  promptSistemaGlicemia,
  analisarImagem,
  gerarRecomendacaoRefeicao,
  extrairGlicemiaImagem,
  classificarImagem,
};
export type { AnaliseImagem, ClassificacaoImagem };

import { criarRefeicao } from '../repository.js';
import {
  enfileirarAnaliseGlicemiaFoto,
  enfileirarAnaliseRefeicao,
  enfileirarClassificacaoImagem,
} from '../services/filaIA.js';
import {
  mensagemAnaliseIndisponivel,
  mensagemFotoAparelhoRecebida,
  mensagemFotoClassificando,
  mensagemFotoRefeicaoRecebida,
  mensagemFotoProcessarErro,
  mensagemImagemIndisponivel,
} from '../messages/respostas.js';

type ResultadoHandler = { ok: boolean; mensagem: string };

function normalizarLegenda(texto?: string) {
  return (texto ?? '').trim().toLowerCase();
}

function legendaSugereGlicemia(texto?: string) {
  const legenda = normalizarLegenda(texto);
  if (!legenda) return false;
  const termos = ['glicemia', 'aparelho', 'medicao', 'medição', 'sensor', 'medidor'];
  return termos.some((termo) => legenda.includes(termo));
}

async function tratarImagemWhatsApp(
  pacienteId: string,
  imagemId?: string,
  legenda?: string,
): Promise<ResultadoHandler> {
  if (!imagemId) {
    return {
      ok: false,
      mensagem: mensagemImagemIndisponivel,
    };
  }
  try {
    console.log('[GLUCO:WHATSAPP]', { acao: 'imagem_handler_inicio', pacienteId, imagemId });
    const legendaNormalizada = normalizarLegenda(legenda);
    if (legendaSugereGlicemia(legendaNormalizada)) {
      const enfileirado = await enfileirarAnaliseGlicemiaFoto(pacienteId, imagemId);
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'imagem_handler_enfileirar_glicemia',
        pacienteId,
        imagemId,
        enfileirado,
      });
      if (!enfileirado) {
        return {
          ok: false,
          mensagem: mensagemAnaliseIndisponivel,
        };
      }
      return {
        ok: true,
        mensagem: mensagemFotoAparelhoRecebida,
      };
    }
    if (!legendaNormalizada) {
      const enfileirado = await enfileirarClassificacaoImagem(pacienteId, imagemId);
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'imagem_handler_enfileirar_classificacao',
        pacienteId,
        imagemId,
        enfileirado,
      });
      if (!enfileirado) {
        return {
          ok: false,
          mensagem: mensagemAnaliseIndisponivel,
        };
      }
      return {
        ok: true,
        mensagem: mensagemFotoClassificando,
      };
    }
    const refeicao = await criarRefeicao(pacienteId, `whatsapp:${imagemId}`);
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'imagem_handler_refeicao_criada',
      pacienteId,
      refeicaoId: refeicao.id,
    });
    const enfileirado = await enfileirarAnaliseRefeicao(refeicao.id);
    console.log('[GLUCO:WHATSAPP]', {
      acao: 'imagem_handler_enfileirar_refeicao',
      pacienteId,
      refeicaoId: refeicao.id,
      enfileirado,
    });
    if (!enfileirado) {
      return {
        ok: false,
        mensagem: mensagemAnaliseIndisponivel,
      };
    }
    return {
      ok: true,
      mensagem: mensagemFotoRefeicaoRecebida,
    };
  } catch {
    return {
      ok: false,
      mensagem: mensagemFotoProcessarErro,
    };
  }
}

export { tratarImagemWhatsApp };

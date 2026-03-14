import {
  prisma,
  validarLimiteDiario,
  criarMensagemLimite,
  criarMensagemIA,
  baixarImagemBase64,
  normalizarLista,
  enviarTextoWhatsApp,
} from './infra.js';
import { analisarImagem, gerarRecomendacaoRefeicao } from './openai.js';

async function processarRefeicao(id: string) {
  try {
    const refeicao = await buscarRefeicao(id);
    if (!refeicao) {
      console.log('Refeição não encontrada.');
      return;
    }
    const permitido = await validarLimiteDiario(refeicao.pacienteId);
    if (!permitido) {
      await criarMensagemLimite(refeicao.pacienteId);
      if (refeicao.paciente?.telefone) {
        await enviarTextoWhatsApp(refeicao.paciente.telefone, 'Limite diário atingido. Tente amanhã! 😊');
      }
      return;
    }
    const base64 = await baixarImagemBase64(refeicao.urlImagem);
    const analise = await analisarImagem(base64);
    const recomendacao = await gerarRecomendacaoRefeicao(analise);
    await atualizarRefeicao(refeicao.id, analise, recomendacao);
    await criarMensagemIA(refeicao.pacienteId, recomendacao);
    if (refeicao.paciente?.telefone) {
      await enviarTextoWhatsApp(refeicao.paciente.telefone, recomendacao);
    }
  } catch (erro) {
    console.log('Erro ao processar refeição.', erro);
  }
}

async function buscarRefeicao(id: string) {
  try {
    return await prisma.refeicao.findUnique({
      where: { id },
      include: { paciente: true },
    });
  } catch (erro) {
    console.log('Erro ao buscar refeição.', erro);
    return null;
  }
}

async function atualizarRefeicao(
  id: string,
  analise: { alimentos?: string[]; calorias?: number; carboidratos?: number; ig?: number; cg?: number },
  recomendacao: string,
) {
  try {
    await prisma.refeicao.update({
      where: { id },
      data: {
        analise,
        alimentos: normalizarLista(analise.alimentos),
        calorias: analise.calorias ?? null,
        carboidratos: analise.carboidratos ?? null,
        indiceGlicemico: analise.ig ?? null,
        cargaGlicemica: analise.cg ?? null,
        recomendacaoIA: recomendacao,
      },
    });
  } catch (erro) {
    console.log('Erro ao atualizar refeição.', erro);
  }
}

export { processarRefeicao };

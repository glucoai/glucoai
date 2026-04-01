import {
  prisma,
  validarLimiteDiario,
  criarMensagemLimite,
  criarMensagemIA,
  criarMensagemSistema,
  baixarImagemBase64,
  baixarImagemWhatsAppBase64,
  normalizarLista,
  enviarTextoWhatsApp,
  buscarPhoneNumberIdClinica,
} from './infra.js';
import { analisarImagem, gerarRecomendacaoRefeicao } from './openai.js';

async function processarRefeicao(id: string) {
  try {
    console.log('[GLUCO:IA_REFEICAO]', { acao: 'processar_inicio', refeicaoId: id });
    const refeicao = await buscarRefeicao(id);
    if (!refeicao) {
      console.log('[GLUCO:IA_REFEICAO]', { acao: 'refeicao_nao_encontrada', refeicaoId: id });
      return;
    }
    console.log('[GLUCO:IA_REFEICAO]', {
      acao: 'refeicao_encontrada',
      refeicaoId: refeicao.id,
      pacienteId: refeicao.pacienteId,
      urlImagem: refeicao.urlImagem,
    });
    const permitido = await validarLimiteDiario(refeicao.pacienteId);
    if (!permitido) {
      console.log('[GLUCO:IA_REFEICAO]', {
        acao: 'limite_diario_atingido',
        pacienteId: refeicao.pacienteId,
      });
      await criarMensagemLimite(refeicao.pacienteId);
      const phoneNumberId = await buscarPhoneNumberIdClinica(refeicao.paciente?.clinicaId);
      if (refeicao.paciente?.telefone) {
        await enviarTextoWhatsApp(
          refeicao.paciente.telefone,
          'Limite diário atingido. Tente amanhã! 😊',
          phoneNumberId,
        );
      }
      return;
    }
    console.log('[GLUCO:IA_REFEICAO]', { acao: 'baixar_imagem_inicio', refeicaoId: refeicao.id });
    const base64 = refeicao.urlImagem.startsWith('whatsapp:')
      ? await baixarImagemWhatsAppBase64(refeicao.urlImagem.replace('whatsapp:', ''))
      : await baixarImagemBase64(refeicao.urlImagem);
    if (!base64) {
      console.log('[GLUCO:IA_REFEICAO]', { acao: 'baixar_imagem_falha', refeicaoId: refeicao.id });
      await criarMensagemSistema(refeicao.pacienteId, 'Não consegui acessar a foto enviada.');
      const phoneNumberId = await buscarPhoneNumberIdClinica(refeicao.paciente?.clinicaId);
      if (refeicao.paciente?.telefone) {
        await enviarTextoWhatsApp(
          refeicao.paciente.telefone,
          'Não consegui acessar sua foto. Pode enviar novamente?',
          phoneNumberId,
        );
      }
      return;
    }
    console.log('[GLUCO:IA_REFEICAO]', {
      acao: 'baixar_imagem_ok',
      refeicaoId: refeicao.id,
      tamanhoBase64: base64.length,
    });
    console.log('[GLUCO:IA_REFEICAO]', { acao: 'analise_inicio', refeicaoId: refeicao.id });
    const analise = await analisarImagem(base64);
    console.log('[GLUCO:IA_REFEICAO]', {
      acao: 'analise_ok',
      refeicaoId: refeicao.id,
      analise,
    });
    const analiseNormalizada = {
      ...analise,
      alimentos: normalizarLista(analise.alimentos),
    };
    console.log('[GLUCO:IA_REFEICAO]', {
      acao: 'analise_normalizada',
      refeicaoId: refeicao.id,
      alimentos: analiseNormalizada.alimentos,
    });
    console.log('[GLUCO:IA_REFEICAO]', { acao: 'recomendacao_inicio', refeicaoId: refeicao.id });
    const recomendacao = await gerarRecomendacaoRefeicao(analiseNormalizada);
    console.log('[GLUCO:IA_REFEICAO]', {
      acao: 'recomendacao_ok',
      refeicaoId: refeicao.id,
      tamanho: recomendacao.length,
    });
    await atualizarRefeicao(refeicao.id, analiseNormalizada, recomendacao);
    await criarMensagemIA(refeicao.pacienteId, recomendacao);
    const phoneNumberId = await buscarPhoneNumberIdClinica(refeicao.paciente?.clinicaId);
    if (refeicao.paciente?.telefone) {
      console.log('[GLUCO:IA_REFEICAO]', {
        acao: 'enviar_whatsapp_tentativa',
        refeicaoId: refeicao.id,
        telefone: refeicao.paciente.telefone,
        phoneNumberId,
      });
      const enviado = await enviarTextoWhatsApp(refeicao.paciente.telefone, recomendacao, phoneNumberId);
      console.log('[GLUCO:IA_REFEICAO]', {
        acao: 'enviar_whatsapp_resultado',
        refeicaoId: refeicao.id,
        enviado,
      });
    }
  } catch (erro) {
    console.log('[GLUCO:IA_REFEICAO]', { acao: 'processar_erro', refeicaoId: id, erro });
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

async function criarRefeicaoDireta(pacienteId: string, urlImagem: string) {
  try {
    return await prisma.refeicao.create({
      data: {
        pacienteId,
        urlImagem,
        origem: 'WHATSAPP',
      },
    });
  } catch (erro) {
    console.log('Erro ao criar refeição.', erro);
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

export { processarRefeicao, criarRefeicaoDireta };

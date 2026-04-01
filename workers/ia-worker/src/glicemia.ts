import {
  prisma,
  validarLimiteDiario,
  criarMensagemLimite,
  criarMensagemIA,
  registrarAlertaCritico,
  criarMensagemSistema,
  baixarImagemWhatsAppBase64,
  enviarTextoWhatsApp,
  enviarAlertaProfissional,
  formatarData,
  buscarPhoneNumberIdClinica,
} from './infra.js';
import { chamarOpenAI, promptSistemaGlicemia, extrairGlicemiaImagem } from './openai.js';

async function processarGlicemia(id: string) {
  try {
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'processar_inicio', glicemiaId: id });
    const glicemia = await buscarGlicemia(id);
    if (!glicemia) {
      console.log('[GLUCO:IA_GLICEMIA]', { acao: 'glicemia_nao_encontrada', glicemiaId: id });
      return;
    }
    console.log('[GLUCO:IA_GLICEMIA]', {
      acao: 'glicemia_encontrada',
      glicemiaId: glicemia.id,
      pacienteId: glicemia.pacienteId,
      valor: glicemia.valor,
    });
    const phoneNumberId = await buscarPhoneNumberIdClinica(glicemia.paciente?.clinicaId);
    const permitido = await validarLimiteDiario(glicemia.pacienteId);
    if (!permitido) {
      console.log('[GLUCO:IA_GLICEMIA]', {
        acao: 'limite_diario_atingido',
        pacienteId: glicemia.pacienteId,
      });
      await criarMensagemLimite(glicemia.pacienteId);
      if (glicemia.paciente?.telefone) {
        await enviarTextoWhatsApp(
          glicemia.paciente.telefone,
          'Limite diário atingido. Tente amanhã! 😊',
          phoneNumberId,
        );
      }
      return;
    }
    const historico = await buscarHistoricoGlicemias(glicemia.pacienteId);
    const prompt = montarPromptGlicemia(glicemia, historico);
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'openai_inicio', glicemiaId: glicemia.id });
    const resposta = await chamarOpenAI('gpt-5.1', [
      { role: 'system', content: promptSistemaGlicemia() },
      { role: 'user', content: prompt },
    ]);
    console.log('[GLUCO:IA_GLICEMIA]', {
      acao: 'openai_ok',
      glicemiaId: glicemia.id,
      tamanho: resposta.length,
    });
    await atualizarGlicemia(glicemia.id, resposta);
    await criarMensagemIA(glicemia.pacienteId, resposta);
    if (glicemia.paciente?.telefone) {
      console.log('[GLUCO:IA_GLICEMIA]', {
        acao: 'enviar_whatsapp_tentativa',
        glicemiaId: glicemia.id,
        telefone: glicemia.paciente.telefone,
        phoneNumberId,
      });
      await enviarTextoWhatsApp(glicemia.paciente.telefone, resposta, phoneNumberId);
      console.log('[GLUCO:IA_GLICEMIA]', {
        acao: 'enviar_whatsapp_ok',
        glicemiaId: glicemia.id,
      });
    }
    if (glicemia.valor > 300 || glicemia.valor < 60) {
      await registrarAlertaCritico(glicemia.pacienteId, glicemia.id, glicemia.valor);
      await criarMensagemSistema(
        glicemia.pacienteId,
        'Alerta crítico detectado. Sua equipe foi notificada.',
      );
      if (glicemia.paciente?.telefone) {
        await enviarTextoWhatsApp(
          glicemia.paciente.telefone,
          'Alerta crítico detectado. Sua equipe foi notificada.',
          phoneNumberId,
        );
      }
      const alertaProfissional = [
        `Alerta crítico de glicemia: ${Math.round(glicemia.valor)} mg/dL.`,
        `Paciente: ${glicemia.paciente?.nome ?? 'Paciente'}.`,
        `Horário: ${formatarData(glicemia.registradoEm)}.`,
      ].join(' ');
      await enviarAlertaProfissional(alertaProfissional);
    }
  } catch (erro) {
    console.log('Erro ao processar glicemia.', erro);
  }
}

async function buscarGlicemia(id: string) {
  try {
    return await prisma.glicemia.findUnique({
      where: { id },
      include: { paciente: true },
    });
  } catch (erro) {
    console.log('Erro ao buscar glicemia.', erro);
    return null;
  }
}

async function buscarHistoricoGlicemias(pacienteId: string) {
  try {
    return await prisma.glicemia.findMany({
      where: { pacienteId },
      orderBy: { registradoEm: 'desc' },
      take: 15,
      select: { valor: true, contexto: true, registradoEm: true },
    });
  } catch (erro) {
    console.log('Erro ao buscar histórico.', erro);
    return [];
  }
}

function montarPromptGlicemia(
  glicemia: { valor: number; contexto: string; registradoEm: Date; paciente: { nome: string } },
  historico: { valor: number; contexto: string; registradoEm: Date }[],
) {
  const resumo = historico
    .map((item) => `${item.valor} mg/dL (${item.contexto}) em ${formatarData(item.registradoEm)}`)
    .join('; ');
  return [
    `Paciente: ${glicemia.paciente.nome}.`,
    `Registro atual: ${glicemia.valor} mg/dL em ${glicemia.contexto}, ${formatarData(
      glicemia.registradoEm,
    )}.`,
    `Histórico recente (15 últimos): ${resumo || 'Sem dados.'}.`,
  ].join(' ');
}

async function atualizarGlicemia(id: string, analiseIA: string) {
  try {
    await prisma.glicemia.update({
      where: { id },
      data: { analiseIA },
    });
  } catch (erro) {
    console.log('Erro ao atualizar glicemia.', erro);
  }
}

async function buscarPaciente(pacienteId: string) {
  try {
    return await prisma.paciente.findUnique({
      where: { id: pacienteId },
      select: { id: true, telefone: true, nome: true, clinicaId: true },
    });
  } catch (erro) {
    console.log('Erro ao buscar paciente.', erro);
    return null;
  }
}

async function criarGlicemiaFoto(pacienteId: string, valor: number) {
  try {
    return await prisma.glicemia.create({
      data: {
        pacienteId,
        valor,
        unidade: 'MG_DL',
        contexto: 'OUTRO',
        origem: 'WHATSAPP',
      },
    });
  } catch (erro) {
    console.log('Erro ao criar glicemia da foto.', erro);
    return null;
  }
}

async function avisarFalhaGlicemiaFoto(
  pacienteId: string,
  telefone: string | null,
  texto: string,
  phoneNumberId?: string,
) {
  await criarMensagemSistema(pacienteId, texto);
  if (telefone) {
    await enviarTextoWhatsApp(telefone, texto, phoneNumberId);
  }
}

async function processarGlicemiaFoto(pacienteId: string, mediaId: string) {
  try {
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_inicio', pacienteId, mediaId });
    const paciente = await buscarPaciente(pacienteId);
    if (!paciente) {
      console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_paciente_nao_encontrado', pacienteId });
      return;
    }
    const phoneNumberId = await buscarPhoneNumberIdClinica(paciente.clinicaId);
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_baixar_inicio', pacienteId, mediaId });
    const base64 = await baixarImagemWhatsAppBase64(mediaId);
    if (!base64) {
      console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_baixar_falha', pacienteId, mediaId });
      await avisarFalhaGlicemiaFoto(
        pacienteId,
        paciente.telefone ?? null,
        'Não consegui acessar a foto do aparelho. Pode enviar novamente?',
        phoneNumberId,
      );
      return;
    }
    console.log('[GLUCO:IA_GLICEMIA]', {
      acao: 'foto_baixar_ok',
      pacienteId,
      tamanhoBase64: base64.length,
    });
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_extrair_inicio', pacienteId });
    const valor = await extrairGlicemiaImagem(base64);
    if (!valor) {
      console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_extrair_falha', pacienteId });
      await avisarFalhaGlicemiaFoto(
        pacienteId,
        paciente.telefone ?? null,
        'Não consegui ler a medição na foto. Pode enviar outra imagem mais nítida?',
        phoneNumberId,
      );
      return;
    }
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_extrair_ok', pacienteId, valor });
    const glicemia = await criarGlicemiaFoto(pacienteId, valor);
    if (!glicemia) {
      console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_criar_glicemia_falha', pacienteId });
      await avisarFalhaGlicemiaFoto(
        pacienteId,
        paciente.telefone ?? null,
        'Não consegui registrar sua glicemia agora. Tente novamente em alguns minutos.',
        phoneNumberId,
      );
      return;
    }
    console.log('[GLUCO:IA_GLICEMIA]', {
      acao: 'foto_criar_glicemia_ok',
      pacienteId,
      glicemiaId: glicemia.id,
    });
    await processarGlicemia(glicemia.id);
  } catch (erro) {
    console.log('[GLUCO:IA_GLICEMIA]', { acao: 'foto_erro', pacienteId, mediaId, erro });
  }
}

export { processarGlicemia, processarGlicemiaFoto };

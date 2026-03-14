import {
  prisma,
  validarLimiteDiario,
  criarMensagemLimite,
  criarMensagemIA,
  registrarAlertaCritico,
  criarMensagemSistema,
  enviarTextoWhatsApp,
  enviarAlertaProfissional,
  formatarData,
} from './infra.js';
import { chamarOpenAI, promptSistemaGlicemia } from './openai.js';

async function processarGlicemia(id: string) {
  try {
    const glicemia = await buscarGlicemia(id);
    if (!glicemia) {
      console.log('Glicemia não encontrada.');
      return;
    }
    const permitido = await validarLimiteDiario(glicemia.pacienteId);
    if (!permitido) {
      await criarMensagemLimite(glicemia.pacienteId);
      if (glicemia.paciente?.telefone) {
        await enviarTextoWhatsApp(glicemia.paciente.telefone, 'Limite diário atingido. Tente amanhã! 😊');
      }
      return;
    }
    const historico = await buscarHistoricoGlicemias(glicemia.pacienteId);
    const prompt = montarPromptGlicemia(glicemia, historico);
    const resposta = await chamarOpenAI('gpt-5.1', [
      { role: 'system', content: promptSistemaGlicemia() },
      { role: 'user', content: prompt },
    ]);
    await atualizarGlicemia(glicemia.id, resposta);
    await criarMensagemIA(glicemia.pacienteId, resposta);
    if (glicemia.paciente?.telefone) {
      await enviarTextoWhatsApp(glicemia.paciente.telefone, resposta);
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

export { processarGlicemia };

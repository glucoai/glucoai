import { processarGlicemia, processarGlicemiaFoto } from './glicemia.js';
import { criarRefeicaoDireta, processarRefeicao } from './refeicao.js';
import {
  baixarImagemWhatsAppBase64,
  buscarPhoneNumberIdClinica,
  encerrar,
  enviarTextoWhatsApp,
  prisma,
  redis,
} from './infra.js';
import { classificarImagem } from './openai.js';

type JobIA =
  | { tipo: 'glicemia'; id: string }
  | { tipo: 'refeicao'; id: string }
  | { tipo: 'glicemia_foto'; pacienteId: string; mediaId: string }
  | { tipo: 'classificar_imagem'; pacienteId: string; mediaId: string };

async function buscarPacienteBasico(pacienteId: string) {
  try {
    return await prisma.paciente.findUnique({
      where: { id: pacienteId },
      select: { telefone: true, clinicaId: true },
    });
  } catch (erro) {
    console.log('[GLUCO:IA_WORKER]', { acao: 'paciente_busca_erro', pacienteId, erro });
    return null;
  }
}

async function avisarImagemIndefinida(pacienteId: string, texto: string) {
  const paciente = await buscarPacienteBasico(pacienteId);
  const phoneNumberId = await buscarPhoneNumberIdClinica(paciente?.clinicaId);
  if (paciente?.telefone) {
    await enviarTextoWhatsApp(paciente.telefone, texto, phoneNumberId);
  }
}

async function processarImagemSemLegenda(pacienteId: string, mediaId: string) {
  try {
    console.log('[GLUCO:IA_WORKER]', {
      acao: 'classificar_imagem_inicio',
      pacienteId,
      mediaId,
    });
    const base64 = await baixarImagemWhatsAppBase64(mediaId);
    if (!base64) {
      console.log('[GLUCO:IA_WORKER]', { acao: 'classificar_imagem_baixar_falha', pacienteId });
      await avisarImagemIndefinida(
        pacienteId,
        'Não consegui acessar sua foto. Pode enviar novamente?',
      );
      return;
    }
    const resultado = await classificarImagem(base64);
    console.log('[GLUCO:IA_WORKER]', {
      acao: 'classificar_imagem_resultado',
      pacienteId,
      resultado,
    });
    if (resultado.tipo === 'GLICEMIA') {
      await processarGlicemiaFoto(pacienteId, mediaId);
      return;
    }
    if (resultado.tipo === 'REFEICAO') {
      const refeicao = await criarRefeicaoDireta(pacienteId, `whatsapp:${mediaId}`);
      if (!refeicao) {
        await avisarImagemIndefinida(
          pacienteId,
          'Não consegui registrar sua refeição agora. Tente novamente em alguns minutos.',
        );
        return;
      }
      await processarRefeicao(refeicao.id);
      return;
    }
    await avisarImagemIndefinida(
      pacienteId,
      'Não consegui identificar se a foto é do aparelho ou da refeição. Pode me dizer? Responda com:\n1) Aparelho\n2) Refeição',
    );
  } catch (erro) {
    console.log('[GLUCO:IA_WORKER]', { acao: 'classificar_imagem_erro', pacienteId, erro });
  }
}

async function processarJob(payload: string) {
  try {
    console.log('[GLUCO:IA_WORKER]', { acao: 'job_recebido', payload });
    const job = JSON.parse(payload) as JobIA;
    console.log('[GLUCO:IA_WORKER]', { acao: 'job_parseado', tipo: job.tipo });
    if (job.tipo === 'glicemia') {
      await processarGlicemia(job.id);
      return;
    }
    if (job.tipo === 'refeicao') {
      await processarRefeicao(job.id);
      return;
    }
    if (job.tipo === 'glicemia_foto') {
      await processarGlicemiaFoto(job.pacienteId, job.mediaId);
      return;
    }
    if (job.tipo === 'classificar_imagem') {
      await processarImagemSemLegenda(job.pacienteId, job.mediaId);
    }
  } catch (erro) {
    console.log('Erro ao processar job.', erro);
  }
}

async function consumirFila() {
  console.log('Worker em execução. Aguardando jobs...');
  while (true) {
    try {
      const resposta = await redis.blpop('ia_fila', 0);
      const payload = resposta?.[1];
      console.log('[GLUCO:IA_WORKER]', { acao: 'fila_blpop', recebeu: Boolean(payload) });
      if (payload) {
        await processarJob(payload);
      }
    } catch (erro) {
      console.log('Erro ao ler fila.', erro);
    }
  }
}

async function iniciar() {
  const [tipo, id] = process.argv.slice(2);
  if (!tipo || !id) {
    await consumirFila();
    return;
  }
  if (tipo === 'glicemia') {
    await processarGlicemia(id);
    await encerrar();
    return;
  }
  if (tipo === 'refeicao') {
    await processarRefeicao(id);
    await encerrar();
    return;
  }
  console.log('Tipo inválido. Use glicemia ou refeicao.');
  await encerrar();
}

iniciar().catch((erro) => {
  console.log('Erro ao iniciar worker.', erro);
});

import { env } from '../../../config/env.js';
import type { MensagemEntrada } from '../types.js';
import { mensagemCadastroIndisponivel, mensagemSolicitarCadastro } from '../messages/index.js';
import { enviarTextoComRegistro, enviarTextoWhatsApp } from '../client/index.js';
import { normalizarChave, normalizarResposta, normalizarTelefone } from '../parsing/index.js';
import { processarRespostaFlow } from './flowResposta.js';
import { garantirPaciente, obterConfiguracaoWhatsapp, registrarMensagemPaciente } from './paciente.js';
import { tratarInteracoesFlow, enviarConviteFlowComBotoes } from './mensagemFlow.js';
import { tratarGestacional } from './mensagemGestacional.js';
import { tratarTermos } from './mensagemTermos.js';
import { tratarRotas } from './mensagemRotas.js';
import { atualizarPacienteOnboarding } from '../repository.js';
import { gatilhosFlow } from '../routing/gatilhos.js';

type PacienteMensagem = {
  id: string;
  nome: string;
  telefone: string;
  tipoDiabetes: string;
  metaGlicemicaMin: number | null;
  metaGlicemicaMax: number | null;
  scoreTotal?: number | null;
  scoreNivel?: string | null;
  scoreMensagem?: string | null;
  scoreFrequencia?: string | null;
  onboardingStatus?: string | null;
  onboardingEtapa?: string | null;
  onboardingDados?: unknown | null;
};

async function processarMensagem(mensagem: MensagemEntrada, idNumero?: string) {
  try {
    const telefone = normalizarTelefone(mensagem.telefone);
    console.log('[GLUCO:WHATSAPP]', { acao: 'mensagem_recebida', telefone, tipo: mensagem.tipo });
    const configuracao = await obterConfiguracaoWhatsapp(idNumero);
    if (idNumero && !configuracao) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'config_nao_encontrada', idNumero });
      return;
    }
    const phoneNumberId = configuracao?.idNumero ?? env.WHATSAPP_PHONE_NUMBER_ID;
    if (!phoneNumberId) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'phone_number_id_ausente', idNumero });
      return;
    }
    console.log('[GLUCO:WHATSAPP]', { acao: 'config_resolvida', phoneNumberId });
    const paciente = (await garantirPaciente(telefone, idNumero, configuracao)) as PacienteMensagem | null;
    if (!paciente) {
      console.log('[GLUCO:WHATSAPP]', { acao: 'paciente_nao_encontrado', telefone, idNumero });
      await enviarTextoWhatsApp(telefone, mensagemCadastroIndisponivel, phoneNumberId);
      return;
    }
    await registrarMensagemPaciente(paciente.id, mensagem);
    const onboardingDados =
      paciente.onboardingDados && typeof paciente.onboardingDados === 'object'
        ? (paciente.onboardingDados as Record<string, unknown>)
        : null;
    if (onboardingDados?._analisePosFlowEmAndamento === true) {
      return;
    }
    if (mensagem.tipo === 'interactive' && mensagem.flowResponseJson) {
      await processarRespostaFlow(telefone, paciente.id, mensagem.flowResponseJson, phoneNumberId);
      return;
    }
    const respostaNormalizada = normalizarResposta(mensagem.texto);
    const respostaChave = normalizarChave(mensagem.texto ?? '');
    if (mensagem.tipo === 'interactive') {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'resposta_interactive',
        telefone,
        texto: mensagem.texto,
        respostaNormalizada,
        respostaChave,
        interactiveTipo: mensagem.interactiveTipo,
      });
    }
    const handledFlow = await tratarInteracoesFlow(
      telefone,
      paciente.id,
      respostaNormalizada,
      respostaChave,
      onboardingDados,
      phoneNumberId,
    );
    if (handledFlow) return;
    const handledGestacional = await tratarGestacional(
      telefone,
      paciente,
      respostaChave,
      phoneNumberId,
    );
    if (handledGestacional) return;
    if (paciente.onboardingEtapa === 'TERMO_ANALISE_PENDENTE' || paciente.onboardingEtapa === 'TERMO_ANALISE_RECUSADO') {
      const respostaTermoChave = normalizarChave(mensagem.texto ?? '');
      const handledTermos = await tratarTermos(
        telefone,
        paciente,
        respostaNormalizada,
        respostaTermoChave,
        phoneNumberId,
      );
      if (handledTermos) return;
    }
    const precisaOnboarding = paciente.onboardingStatus !== 'CONCLUIDO';
    if (precisaOnboarding) {
      const texto = respostaNormalizada;
      const deveDispararFlow = texto && gatilhosFlow.some((gatilho) => texto.includes(gatilho));
      if (mensagem.tipo === 'text' && deveDispararFlow) {
        await enviarConviteFlowComBotoes(telefone, paciente.id, phoneNumberId);
        await atualizarPacienteOnboarding(paciente.id, {
          onboardingStatus: 'EM_ANDAMENTO',
          onboardingEtapa: 'FLOW01_ENVIADO',
        });
        return;
      }
      if (mensagem.tipo === 'text') {
        await enviarTextoComRegistro(
          telefone,
          paciente.id,
          mensagemSolicitarCadastro,
          phoneNumberId,
        );
        return;
      }
    }
    await tratarRotas(mensagem, paciente, telefone, phoneNumberId);
  } catch {
    return;
  }
}

export { processarMensagem };

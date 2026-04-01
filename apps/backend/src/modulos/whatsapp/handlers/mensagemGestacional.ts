import { atualizarPacienteOnboarding } from '../repository.js';
import { mensagemAvisada, mensagemFinalGestacional } from '../messages/index.js';
import { enviarTextoComRegistro } from '../client/index.js';

type PacienteGestacional = {
  id: string;
  nome?: string | null;
  onboardingEtapa?: string | null;
};

function obterPrimeiroNome(nome?: string | null) {
  if (!nome) return 'Paciente';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'Paciente';
}

async function tratarGestacional(
  telefone: string,
  paciente: PacienteGestacional,
  respostaChave: string,
  phoneNumberId?: string,
) {
  const gestacionalAvisar = [
    'gestacionalavisar',
    'simqueroseravisada',
    'queroseravisada',
  ].includes(respostaChave);
  const gestacionalNao = ['gestacionalnao', 'naoobrigada'].includes(respostaChave);
  console.log('[GLUCO:WHATSAPP]', {
    acao: 'gestacional_match',
    telefone,
    onboardingEtapa: paciente.onboardingEtapa,
    gestacionalAvisar,
    gestacionalNao,
    respostaChave,
  });
  if (!(paciente.onboardingEtapa === 'GESTACIONAL_AVISO' || gestacionalAvisar || gestacionalNao)) {
    return false;
  }
  if (gestacionalAvisar) {
    console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_resposta', telefone, escolha: 'avisar' });
    try {
      await atualizarPacienteOnboarding(paciente.id, {
        waitlistGestacional: true,
        onboardingStatus: 'CONCLUIDO',
        onboardingEtapa: 'GESTACIONAL_WAITLIST',
      });
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'gestacional_erro_atualizar',
        telefone,
        erro: (erro as Error).message,
      });
    }
    const textoAvisada = mensagemAvisada(obterPrimeiroNome(paciente.nome ?? undefined));
    console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_envio_mensagem', telefone, tipo: 'avisar' });
    await enviarTextoComRegistro(telefone, paciente.id, textoAvisada, phoneNumberId);
    return true;
  }
  if (gestacionalNao) {
    console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_resposta', telefone, escolha: 'nao' });
    try {
      await atualizarPacienteOnboarding(paciente.id, {
        waitlistGestacional: false,
        onboardingStatus: 'CONCLUIDO',
        onboardingEtapa: 'GESTACIONAL_FINAL',
      });
    } catch (erro) {
      console.log('[GLUCO:WHATSAPP]', {
        acao: 'gestacional_erro_atualizar',
        telefone,
        erro: (erro as Error).message,
      });
    }
    const textoFinal = mensagemFinalGestacional(obterPrimeiroNome(paciente.nome ?? undefined));
    console.log('[GLUCO:WHATSAPP]', { acao: 'gestacional_envio_mensagem', telefone, tipo: 'nao' });
    await enviarTextoComRegistro(telefone, paciente.id, textoFinal, phoneNumberId);
    return true;
  }
  return false;
}

export { tratarGestacional };

import {
  buscarConfiguracaoWhatsappPorClinica,
  buscarConfiguracaoWhatsappPorIdNumero,
  criarConfiguracaoWhatsapp,
  excluirConfiguracaoWhatsapp,
} from '../repository.js';

type CriarConfiguracaoWhatsappInput = {
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  webhookUrl: string;
  ativo: boolean;
};

function gerarTokenVerificacaoConfig(businessId: string) {
  const normalizado = businessId.replace(/\s+/g, '');
  const base = normalizado.slice(-6) || 'gluco';
  return `gluco-${base}`.toLowerCase();
}

async function criarConfiguracaoWhatsappService(clinicaId: string, dados: CriarConfiguracaoWhatsappInput) {
  return criarConfiguracaoWhatsapp({
    clinicaId,
    idNumero: dados.idNumero,
    numeroExibicao: dados.numeroExibicao,
    businessId: dados.businessId,
    webhookUrl: dados.webhookUrl,
    tokenVerificacao: gerarTokenVerificacaoConfig(dados.businessId),
    ativo: dados.ativo,
  });
}

async function obterConfiguracaoWhatsappService(clinicaId: string) {
  return buscarConfiguracaoWhatsappPorClinica(clinicaId);
}

async function obterConfiguracaoWhatsappPorNumeroService(idNumero: string) {
  return buscarConfiguracaoWhatsappPorIdNumero(idNumero);
}

async function excluirConfiguracaoWhatsappService(clinicaId: string, id: string) {
  return excluirConfiguracaoWhatsapp(clinicaId, id);
}

export {
  criarConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappService,
  obterConfiguracaoWhatsappPorNumeroService,
  excluirConfiguracaoWhatsappService,
};

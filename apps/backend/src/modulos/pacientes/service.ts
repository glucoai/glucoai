import PDFDocument from 'pdfkit';
import type { PacientePayload, PacienteQuery } from './types.js';
import {
  listarPacientes,
  buscarPacienteDetalhe,
  criarPaciente,
  atualizarPaciente,
  desativarPaciente,
  obterPacienteAtivoComClinica,
  listarMensagens,
  criarMensagemProfissional,
  listarGlicemiasPeriodo,
} from './repository.js';

async function listarPacientesService(clinicaId: string, filtros: PacienteQuery) {
  return listarPacientes(clinicaId, filtros);
}

async function obterPacienteDetalheService(clinicaId: string, id: string) {
  return buscarPacienteDetalhe(clinicaId, id);
}

async function criarPacienteService(clinicaId: string, payload: PacientePayload) {
  return criarPaciente(clinicaId, payload);
}

async function atualizarPacienteService(
  clinicaId: string,
  id: string,
  payload: Partial<PacientePayload>,
) {
  return atualizarPaciente(clinicaId, id, payload);
}

async function desativarPacienteService(clinicaId: string, id: string) {
  return desativarPaciente(clinicaId, id);
}

type HeatmapDia = {
  data: string;
  total: number;
  media: number;
};

type DocumentoPdf = InstanceType<typeof PDFDocument>;

function inicioDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function fimDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59, 59, 999);
}

function chaveDia(data: Date) {
  return data.toISOString().slice(0, 10);
}

function adicionarDias(data: Date, dias: number) {
  return new Date(data.getTime() + dias * 24 * 60 * 60 * 1000);
}

function montarHeatmap(registros: { valor: number; registradoEm: Date }[], inicio: Date, fim: Date) {
  const mapa = new Map<string, { total: number; soma: number }>();
  registros.forEach((registro) => {
    const chave = chaveDia(registro.registradoEm);
    const atual = mapa.get(chave) ?? { total: 0, soma: 0 };
    mapa.set(chave, { total: atual.total + 1, soma: atual.soma + registro.valor });
  });
  const dias: HeatmapDia[] = [];
  let atual = inicioDia(inicio);
  const limite = fimDia(fim);
  while (atual <= limite) {
    const chave = chaveDia(atual);
    const item = mapa.get(chave);
    const total = item?.total ?? 0;
    const media = total ? Math.round(item!.soma / total) : 0;
    dias.push({ data: chave, total, media });
    atual = adicionarDias(atual, 1);
  }
  return dias;
}

function normalizarPeriodo(de?: Date, ate?: Date) {
  const fim = ate ? fimDia(ate) : fimDia(new Date());
  const inicio = de ? inicioDia(de) : adicionarDias(inicioDia(fim), -30);
  return { inicio, fim };
}

function montarResumoRegistros(registros: { valor: number; registradoEm: Date }[]) {
  if (!registros.length) {
    return { total: 0, media: 0, minimo: 0, maximo: 0 };
  }
  const total = registros.length;
  const soma = registros.reduce((acc, item) => acc + item.valor, 0);
  const valores = registros.map((item) => item.valor);
  return {
    total,
    media: Math.round(soma / total),
    minimo: Math.min(...valores),
    maximo: Math.max(...valores),
  };
}

function adicionarSecao(doc: DocumentoPdf, titulo: string) {
  doc.fontSize(12).fillColor('#1A5CB8').text(titulo);
  doc.moveDown(0.3);
}

function adicionarLinha(doc: DocumentoPdf, texto: string) {
  doc.fontSize(10).fillColor('#4F4F4F').text(texto);
}

function montarCabecalho(doc: DocumentoPdf) {
  doc.fontSize(18).fillColor('#2F80ED').text('GLUCO IA');
  doc.fontSize(12).fillColor('#27AE60').text('Relatório do Paciente');
  doc.moveDown();
}

function adicionarDadosPaciente(
  doc: DocumentoPdf,
  dados: {
    paciente: string;
    tipoDiabetes: string;
    metaMin: number;
    metaMax: number;
    periodo: { inicio: Date; fim: Date };
  },
) {
  adicionarSecao(doc, 'Dados do Paciente');
  adicionarLinha(doc, `Paciente: ${dados.paciente}`);
  adicionarLinha(doc, `Tipo de diabetes: ${dados.tipoDiabetes}`);
  adicionarLinha(doc, `Meta glicêmica: ${dados.metaMin}-${dados.metaMax} mg/dL`);
  adicionarLinha(
    doc,
    `Período: ${dados.periodo.inicio.toLocaleDateString('pt-BR')} a ${dados.periodo.fim.toLocaleDateString('pt-BR')}`,
  );
  doc.moveDown();
}

function adicionarEstatisticas(
  doc: DocumentoPdf,
  resumo: { total: number; media: number; minimo: number; maximo: number },
) {
  adicionarSecao(doc, 'Estatísticas');
  adicionarLinha(doc, `Total de registros: ${resumo.total}`);
  adicionarLinha(doc, `Média: ${resumo.media} mg/dL`);
  adicionarLinha(doc, `Mínimo: ${resumo.minimo} mg/dL`);
  adicionarLinha(doc, `Máximo: ${resumo.maximo} mg/dL`);
  doc.moveDown();
}

function adicionarTabela(doc: DocumentoPdf, registros: { valor: number; registradoEm: Date }[]) {
  adicionarSecao(doc, 'Tabela de Glicemias');
  registros.slice(0, 40).forEach((registro) => {
    adicionarLinha(
      doc,
      `${registro.registradoEm.toLocaleDateString('pt-BR')} ${registro.registradoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${Math.round(registro.valor)} mg/dL`,
    );
  });
  doc.moveDown();
}

function adicionarRodape(doc: DocumentoPdf, clinica: string) {
  doc.fontSize(9).fillColor('#4F4F4F').text(
    `Clínica: ${clinica} • Gerado em ${new Date().toLocaleString('pt-BR')}`,
  );
}

function gerarPdf(
  dados: {
    clinica: string;
    paciente: string;
    tipoDiabetes: string;
    metaMin: number;
    metaMax: number;
    periodo: { inicio: Date; fim: Date };
    resumo: { total: number; media: number; minimo: number; maximo: number };
    registros: { valor: number; registradoEm: Date }[];
  },
) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    montarCabecalho(doc);
    adicionarDadosPaciente(doc, dados);
    adicionarEstatisticas(doc, dados.resumo);
    adicionarTabela(doc, dados.registros);
    adicionarRodape(doc, dados.clinica);
    doc.end();
  });
}

async function listarMensagensService(
  clinicaId: string,
  pacienteId: string,
  pagina: number,
  limite: number,
) {
  const paciente = await obterPacienteAtivoComClinica(clinicaId, pacienteId);
  if (!paciente) {
    return null;
  }
  return listarMensagens(pacienteId, pagina, limite);
}

async function criarMensagemProfissionalService(clinicaId: string, pacienteId: string, conteudo: string) {
  const paciente = await obterPacienteAtivoComClinica(clinicaId, pacienteId);
  if (!paciente) {
    return null;
  }
  return { paciente, mensagem: await criarMensagemProfissional(pacienteId, conteudo) };
}

async function obterHeatmapService(clinicaId: string, pacienteId: string, meses: number) {
  const paciente = await obterPacienteAtivoComClinica(clinicaId, pacienteId);
  if (!paciente) {
    return null;
  }
  const fim = fimDia(new Date());
  const inicio = adicionarDias(inicioDia(fim), -meses * 30);
  const registros = await listarGlicemiasPeriodo(pacienteId, inicio, fim);
  return montarHeatmap(registros, inicio, fim);
}

async function gerarRelatorioService(clinicaId: string, pacienteId: string, de?: Date, ate?: Date) {
  const paciente = await obterPacienteAtivoComClinica(clinicaId, pacienteId);
  if (!paciente) {
    return null;
  }
  const periodo = normalizarPeriodo(de, ate);
  const registros = await listarGlicemiasPeriodo(pacienteId, periodo.inicio, periodo.fim);
  const resumo = montarResumoRegistros(registros);
  const pdf = await gerarPdf({
    clinica: paciente.clinica.nome,
    paciente: paciente.nome,
    tipoDiabetes: paciente.tipoDiabetes,
    metaMin: paciente.metaGlicemicaMin ?? 70,
    metaMax: paciente.metaGlicemicaMax ?? 140,
    periodo,
    resumo,
    registros,
  });
  return { paciente, pdf, periodo };
}

export {
  listarPacientesService,
  obterPacienteDetalheService,
  criarPacienteService,
  atualizarPacienteService,
  desativarPacienteService,
  listarMensagensService,
  criarMensagemProfissionalService,
  obterHeatmapService,
  gerarRelatorioService,
};

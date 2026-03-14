type PainelEstatisticas = {
  pacientesTotal: number;
  alertasCriticos24h: number;
  glicemias24h: number;
  adesaoPercentual7d: number;
};

type PainelAlerta = {
  id: string;
  valor: number;
  unidade: string;
  contexto: string;
  registradoEm: Date;
  paciente: {
    id: string;
    nome: string;
    telefone: string;
  };
};

type PainelSerieGlicemia = {
  data: string;
  media: number;
  minimo: number;
  maximo: number;
  total: number;
};

export type { PainelAlerta, PainelEstatisticas, PainelSerieGlicemia };

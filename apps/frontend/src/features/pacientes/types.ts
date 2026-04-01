type TipoDiabetes = 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL' | 'PRE';

type GlicemiaRegistro = {
  valor: number;
  registradoEm: string;
};

type PacienteItem = {
  id: string;
  nome: string;
  telefone: string;
  tipoDiabetes: TipoDiabetes;
  metaGlicemicaMin?: number | null;
  metaGlicemicaMax?: number | null;
  scoreTotal?: number | null;
  scoreNivel?: string | null;
  scoreAtualizadoEm?: string | null;
  glicemias?: GlicemiaRegistro[];
};

type PacientesResposta = {
  total: number;
  pagina: number;
  limite: number;
  dados: PacienteItem[];
};

export type { GlicemiaRegistro, PacienteItem, PacientesResposta, TipoDiabetes };

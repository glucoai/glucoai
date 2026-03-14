type TipoDiabetes = 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL' | 'PRE';

type PacientePayload = {
  nome: string;
  telefone: string;
  tipoDiabetes: TipoDiabetes;
  dataNascimento?: Date | null;
  genero?: string | null;
  cidade?: string | null;
  pais?: string | null;
  anosdiagnostico?: number | null;
  medicamentos?: string | null;
  metaGlicemicaMin?: number | null;
  metaGlicemicaMax?: number | null;
};

type PacienteQuery = {
  busca?: string;
  tipo?: TipoDiabetes;
  pagina: number;
  limite: number;
};

export type { PacientePayload, PacienteQuery, TipoDiabetes };

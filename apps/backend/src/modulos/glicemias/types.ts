type UnidadeGlicemia = 'MG_DL' | 'MMOL_L';
type ContextoGlicemia = 'JEJUM' | 'APOS_CAFE' | 'APOS_ALMOCO' | 'APOS_JANTA' | 'DORMIR' | 'OUTRO';
type OrigemRegistro = 'WHATSAPP' | 'DASHBOARD' | 'API';

type GlicemiaPayload = {
  valor: number;
  unidade: UnidadeGlicemia;
  contexto: ContextoGlicemia;
  origem: OrigemRegistro;
  notas?: string | null;
};

type GlicemiaQuery = {
  de?: Date;
  ate?: Date;
  limite: number;
};

export type { GlicemiaPayload, GlicemiaQuery, UnidadeGlicemia, ContextoGlicemia, OrigemRegistro };

type StatusGlicemia = 'BAIXA' | 'NORMAL' | 'ELEVADA' | 'CRITICA';

type ResultadoClassificacao = {
  status: StatusGlicemia;
  cor: string;
  label: string;
};

function classificarGlicemia(valor: number): ResultadoClassificacao {
  if (valor < 70) {
    return { status: 'BAIXA', cor: '#F2994A', label: 'Baixa' };
  }
  if (valor <= 140) {
    return { status: 'NORMAL', cor: '#27AE60', label: 'Normal' };
  }
  if (valor <= 180) {
    return { status: 'ELEVADA', cor: '#2F80ED', label: 'Elevada' };
  }
  return { status: 'CRITICA', cor: '#EB5757', label: 'Crítica' };
}

export type { ResultadoClassificacao, StatusGlicemia };
export { classificarGlicemia };

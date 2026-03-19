type StatusGlicemia = 'BAIXA' | 'NORMAL' | 'ELEVADA' | 'CRITICA';

type ResultadoClassificacao = {
  status: StatusGlicemia;
  cor: string;
  label: string;
};

function classificarGlicemia(valor: number): ResultadoClassificacao {
  if (valor < 70) {
    return { status: 'BAIXA', cor: '#F5A623', label: 'Baixa' };
  }
  if (valor <= 140) {
    return { status: 'NORMAL', cor: '#00D9B4', label: 'Normal' };
  }
  if (valor <= 180) {
    return { status: 'ELEVADA', cor: '#2B7FFF', label: 'Elevada' };
  }
  return { status: 'CRITICA', cor: '#FF4D4D', label: 'Crítica' };
}

export type { ResultadoClassificacao, StatusGlicemia };
export { classificarGlicemia };

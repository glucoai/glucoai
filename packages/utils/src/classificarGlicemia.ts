type Resultado = {
  codigo: 'HIPO' | 'NORMAL' | 'ELEVADA' | 'HIPER' | 'CRITICA';
  cor: string;
  label: string;
};

export function classificarGlicemia(valor: number): Resultado {
  if (valor < 70) {
    return { codigo: 'HIPO', cor: '#EB5757', label: 'Hipoglicemia' };
  }
  if (valor <= 140) {
    return { codigo: 'NORMAL', cor: '#27AE60', label: 'Normal' };
  }
  if (valor <= 200) {
    return { codigo: 'ELEVADA', cor: '#F2994A', label: 'Elevada' };
  }
  if (valor > 300) {
    return { codigo: 'CRITICA', cor: '#EB5757', label: 'Crítica' };
  }
  return { codigo: 'HIPER', cor: '#EB5757', label: 'Hiperglicemia' };
}

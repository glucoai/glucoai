type Resultado = {
  codigo: 'HIPO' | 'NORMAL' | 'ELEVADA' | 'HIPER' | 'CRITICA';
  cor: string;
  label: string;
};

export function classificarGlicemia(valor: number): Resultado {
  if (valor < 70) {
    return { codigo: 'HIPO', cor: '#FF4D4D', label: 'Hipoglicemia' };
  }
  if (valor <= 140) {
    return { codigo: 'NORMAL', cor: '#00D9B4', label: 'Normal' };
  }
  if (valor <= 200) {
    return { codigo: 'ELEVADA', cor: '#F5A623', label: 'Elevada' };
  }
  if (valor > 300) {
    return { codigo: 'CRITICA', cor: '#FF4D4D', label: 'Crítica' };
  }
  return { codigo: 'HIPER', cor: '#FF4D4D', label: 'Hiperglicemia' };
}

function calcularIdade(dataNascimento: Date) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade -= 1;
  }
  return idade;
}

function calcularMacrosDiarios(pesoKg: number) {
  return {
    proteina: Math.round(pesoKg * 1.6),
    carboidratos: Math.round(pesoKg * 3),
    gorduras: Math.round(pesoKg * 0.8),
  };
}

function calcularEscalaRisco(ultimaGlicemia: number, sintomasComplicacoes: boolean) {
  if (sintomasComplicacoes || ultimaGlicemia >= 250) {
    return 'ALTO';
  }
  if (ultimaGlicemia >= 180) {
    return 'MODERADO';
  }
  return 'BAIXO';
}

export { calcularIdade, calcularMacrosDiarios, calcularEscalaRisco };

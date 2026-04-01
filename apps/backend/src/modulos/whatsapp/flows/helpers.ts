function obterPrimeiroNome(nome?: string | null) {
  if (!nome) return 'Paciente';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? 'Paciente';
}

export { obterPrimeiroNome };

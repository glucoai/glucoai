function normalizarTexto(texto?: string) {
  return (texto ?? '').trim();
}

function normalizarResposta(texto?: string) {
  return normalizarTexto(texto).toLowerCase();
}

function normalizarChave(chave: string) {
  return chave
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizarTelefone(telefone: string) {
  return telefone.replace(/\D/g, '');
}

export { normalizarTexto, normalizarResposta, normalizarChave, normalizarTelefone };

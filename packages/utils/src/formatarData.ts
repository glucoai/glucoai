export function formatarData(data: Date, incluirHora = false) {
  const opcoes: Intl.DateTimeFormatOptions = incluirHora
    ? { dateStyle: 'short', timeStyle: 'short' }
    : { dateStyle: 'short' };

  return new Intl.DateTimeFormat('pt-BR', opcoes).format(data);
}

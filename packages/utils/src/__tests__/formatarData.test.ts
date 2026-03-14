import { describe, expect, it } from 'vitest';
import { formatarData } from '../formatarData';

describe('formatarData', () => {
  it('formata data no padrão pt-BR', () => {
    const data = new Date('2026-03-14T00:00:00.000Z');
    const resultado = formatarData(data);
    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('inclui hora quando solicitado', () => {
    const data = new Date('2026-03-14T10:30:00.000Z');
    const resultado = formatarData(data, true);
    expect(resultado).toMatch(/\d{2}:\d{2}/);
  });
});

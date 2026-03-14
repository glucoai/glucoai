import type { HTMLAttributes } from 'react';

type Tipo = 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL' | 'PRE';

type Props = HTMLAttributes<HTMLSpanElement> & {
  tipo: Tipo;
};

const estilos: Record<Tipo, string> = {
  TIPO_1: 'bg-primaria text-white',
  TIPO_2: 'bg-sucesso text-white',
  GESTACIONAL: 'bg-atencao text-white',
  PRE: 'bg-[#8E44AD] text-white',
};

const rotulos: Record<Tipo, string> = {
  TIPO_1: 'Tipo 1',
  TIPO_2: 'Tipo 2',
  GESTACIONAL: 'Gestacional',
  PRE: 'Pré',
};

export function BadgeTipoDiabetes({ tipo, className = '', ...props }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-sm text-xs font-medium ${estilos[tipo]} ${className}`}
      {...props}
    >
      {rotulos[tipo]}
    </span>
  );
}

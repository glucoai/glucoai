import type { HTMLAttributes } from 'react';

type Status = 'NORMAL' | 'ELEVADA' | 'CRITICA';

type Props = HTMLAttributes<HTMLSpanElement> & {
  status: Status;
};

const estilos: Record<Status, string> = {
  NORMAL: 'bg-sucesso text-white',
  ELEVADA: 'bg-atencao text-white',
  CRITICA: 'bg-perigo text-white',
};

const rotulos: Record<Status, string> = {
  NORMAL: 'Normal',
  ELEVADA: 'Elevada',
  CRITICA: 'Crítica',
};

export function BadgeStatusGlicemia({ status, className = '', ...props }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-sm text-xs font-medium ${estilos[status]} ${className}`}
      {...props}
    >
      {rotulos[status]}
    </span>
  );
}

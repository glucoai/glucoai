import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
};

export function CampoTexto({ rotulo, className = '', ...props }: Props) {
  return (
    <label className="flex flex-col gap-2 text-sm text-texto">
      <span className="font-medium">{rotulo}</span>
      <input
        className={`border border-borda rounded-md px-4 py-3 bg-fundo focus:outline-none focus:ring-2 focus:ring-primaria ${className}`}
        {...props}
      />
    </label>
  );
}

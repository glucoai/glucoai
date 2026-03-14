import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
};

export function CampoGlicemia({ rotulo, className = '', ...props }: Props) {
  return (
    <label className="flex flex-col gap-2 text-sm text-texto">
      <span className="font-medium">{rotulo}</span>
      <div
        className={`flex items-center gap-3 border border-borda rounded-md px-4 py-3 bg-fundo ${className}`}
      >
        <input
          className="flex-1 text-2xl font-semibold focus:outline-none bg-transparent"
          inputMode="numeric"
          type="number"
          {...props}
        />
        <span className="text-sm text-texto">mg/dL</span>
      </div>
    </label>
  );
}

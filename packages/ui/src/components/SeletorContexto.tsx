import type { SelectHTMLAttributes } from 'react';

type Opcao = {
  valor: string;
  rotulo: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  rotulo: string;
  opcoes: Opcao[];
};

export function SeletorContexto({ rotulo, opcoes, className = '', ...props }: Props) {
  return (
    <label className="flex flex-col gap-2 text-sm text-texto">
      <span className="font-medium">{rotulo}</span>
      <select
        className={`border border-borda rounded-md px-4 py-3 bg-fundo focus:outline-none focus:ring-2 focus:ring-primaria ${className}`}
        {...props}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </label>
  );
}

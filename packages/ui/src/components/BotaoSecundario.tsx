import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function BotaoSecundario({ className = '', ...props }: Props) {
  return (
    <button
      className={`border border-primaria text-primaria rounded-md px-6 py-3 font-medium hover:bg-primaria/10 transition ${className}`}
      {...props}
    />
  );
}

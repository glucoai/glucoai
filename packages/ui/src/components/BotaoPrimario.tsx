import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function BotaoPrimario({ className = '', ...props }: Props) {
  return (
    <button
      className={`bg-primaria text-white rounded-md px-6 py-3 font-medium hover:bg-primaria/90 transition ${className}`}
      {...props}
    />
  );
}

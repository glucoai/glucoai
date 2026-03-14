import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function BotaoGhost({ className = '', ...props }: Props) {
  return (
    <button
      className={`text-texto rounded-md px-6 py-3 font-medium hover:bg-superficie transition ${className}`}
      {...props}
    />
  );
}

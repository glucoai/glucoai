import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function BotaoPerigo({ className = '', ...props }: Props) {
  return (
    <button
      className={`bg-perigo text-white rounded-md px-6 py-3 font-medium hover:bg-[#D64545] transition ${className}`}
      {...props}
    />
  );
}

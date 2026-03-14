import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className = '', children, ...props }: Props) {
  return (
    <div
      className={`bg-fundo rounded-md shadow-card p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

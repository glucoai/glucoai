import { useMemo } from 'react';

function gerarPathSparkline(valores: number[]) {
  const largura = 80;
  const altura = 32;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const range = Math.max(max - min, 1);
  return valores
    .map((valor, indice) => {
      const x = (largura / (valores.length - 1)) * indice;
      const y = altura - ((valor - min) / range) * altura;
      return `${indice === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

type Props = {
  valores: number[];
};

export function SparklineMini({ valores }: Props) {
  const path = useMemo(() => gerarPathSparkline(valores), [valores]);
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" className="text-primaria">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

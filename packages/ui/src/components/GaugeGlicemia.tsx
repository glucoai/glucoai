import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  valor: number;
  tamanho?: number;
  cor?: string;
  status?: StatusGlicemia;
  contexto?: string;
};

type StatusGlicemia = 'BAIXA' | 'NORMAL' | 'ELEVADA' | 'CRITICA';

type SvgProps = {
  tamanho: number;
  raio: number;
  cor: string;
  circunferencia: number;
  offset: number;
  valor: number;
  strokeWidth: number;
  tamanhoFonte: number;
};

function GaugeSvg({
  tamanho,
  raio,
  cor,
  circunferencia,
  offset,
  valor,
  strokeWidth,
  tamanhoFonte,
}: SvgProps) {
  return (
    <svg width={tamanho} height={tamanho}>
      <circle
        cx={tamanho / 2}
        cy={tamanho / 2}
        r={raio}
        stroke="#E0E6ED"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={tamanho / 2}
        cy={tamanho / 2}
        r={raio}
        stroke={cor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circunferencia}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={tamanhoFonte}
        fontWeight="700"
        fill={cor}
      >
        {valor}
      </text>
    </svg>
  );
}

function classificarGlicemia(valor: number): StatusGlicemia {
  if (valor < 70) {
    return 'BAIXA';
  }
  if (valor <= 140) {
    return 'NORMAL';
  }
  if (valor <= 180) {
    return 'ELEVADA';
  }
  return 'CRITICA';
}

function corPorStatus(status: StatusGlicemia) {
  if (status === 'BAIXA') {
    return '#F2994A';
  }
  if (status === 'NORMAL') {
    return '#27AE60';
  }
  if (status === 'ELEVADA') {
    return '#2F80ED';
  }
  return '#EB5757';
}

export function GaugeGlicemia({
  valor,
  tamanho = 200,
  cor,
  status,
  contexto = 'Em jejum',
  className = '',
  ...props
}: Props) {
  const compacto = tamanho <= 60;
  const strokeWidth = compacto ? 6 : 12;
  const raio = (tamanho - strokeWidth * 2) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const percentual = Math.min(valor / 300, 1);
  const offset = circunferencia - circunferencia * percentual;
  const statusResolvido = status ?? classificarGlicemia(valor);
  const corResolvida = cor ?? corPorStatus(statusResolvido);
  const tamanhoFonte = compacto ? 14 : 36;

  return (
    <div className={`flex flex-col items-center ${className}`} {...props}>
      <GaugeSvg
        tamanho={tamanho}
        raio={raio}
        cor={corResolvida}
        circunferencia={circunferencia}
        offset={offset}
        valor={valor}
        strokeWidth={strokeWidth}
        tamanhoFonte={tamanhoFonte}
      />
      {compacto ? null : <span className="text-sm text-texto mt-2">{contexto}</span>}
    </div>
  );
}

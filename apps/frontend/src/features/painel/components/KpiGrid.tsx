import { Card } from '@gluco/ui';
import { Activity, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { PainelEstatisticas, PainelSerieGlicemia } from '../types';

type Props = {
  estatisticas: PainelEstatisticas | null;
  serie: PainelSerieGlicemia[];
  carregando: boolean;
};

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR');
}

function KpiCard({
  titulo,
  valor,
  variacao,
  icone,
  dados,
}: {
  titulo: string;
  valor: string;
  variacao: string;
  icone: JSX.Element;
  dados: { data: string; valor: number }[];
}) {
  return (
    <Card className="h-32 flex flex-col justify-between border border-borda bg-fundo/90 backdrop-blur-md">
      <div className="flex items-center justify-between text-sm text-texto">
        <span className="uppercase tracking-[0.2em] text-[10px]">{titulo}</span>
        <span className="text-primaria bg-primaria/10 rounded-xl w-9 h-9 flex items-center justify-center">
          {icone}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-texto">{valor}</div>
        <div className="text-xs text-sucesso bg-sucesso/10 px-2 py-1 rounded-full">
          {variacao}
        </div>
      </div>
      <div className="h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados}>
            <Tooltip
              contentStyle={{ fontSize: 10 }}
              formatter={(valorTooltip) => [`${valorTooltip}`, '']}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#2F80ED"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function montarSparkline(serie: PainelSerieGlicemia[], chave: keyof PainelSerieGlicemia) {
  return serie.slice(-7).map((item) => ({ data: item.data, valor: Number(item[chave]) }));
}

export function KpiGrid({ estatisticas, serie, carregando }: Props) {
  const pacientesValor = estatisticas ? formatarValor(estatisticas.pacientesTotal) : '--';
  const alertasValor = estatisticas ? formatarValor(estatisticas.alertasCriticos24h) : '--';
  const adesaoValor = estatisticas ? `${estatisticas.adesaoPercentual7d}%` : '--';
  const mrrValor = 'R$ 0';

  const sparkMedia = montarSparkline(serie, 'media');
  const sparkMaximo = montarSparkline(serie, 'maximo');
  const sparkMinimo = montarSparkline(serie, 'minimo');

  const kpis = [
    {
      titulo: 'Pacientes',
      valor: pacientesValor,
      variacao: carregando ? '--' : '+0%',
      icone: <Users size={18} />,
      dados: sparkMedia,
    },
    {
      titulo: 'Alertas',
      valor: alertasValor,
      variacao: carregando ? '--' : '+0%',
      icone: <AlertTriangle size={18} />,
      dados: sparkMaximo,
    },
    {
      titulo: 'MRR',
      valor: mrrValor,
      variacao: carregando ? '--' : '+0%',
      icone: <TrendingUp size={18} />,
      dados: sparkMedia,
    },
    {
      titulo: 'Adesão',
      valor: adesaoValor,
      variacao: carregando ? '--' : '+0%',
      icone: <Activity size={18} />,
      dados: sparkMinimo,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((card) => (
        <KpiCard key={card.titulo} {...card} />
      ))}
    </div>
  );
}

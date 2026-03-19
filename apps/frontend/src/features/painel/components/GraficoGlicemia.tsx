import { Card } from '@gluco/ui';
import { LineChart as LineIcon } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PainelSerieGlicemia } from '../types';

type Props = {
  serie: PainelSerieGlicemia[];
  carregando: boolean;
};

function formatarData(valor: string) {
  const [ano, mes, dia] = valor.split('-');
  if (!ano || !mes || !dia) {
    return valor;
  }
  return `${dia}/${mes}`;
}

export function GraficoGlicemia({ serie, carregando }: Props) {
  return (
    <Card className="h-80 flex flex-col gap-5 border border-borda bg-fundo/90 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-texto">Performance</div>
          <div className="text-base text-texto font-semibold">Glicemia diária</div>
        </div>
        <div className="text-primaria bg-primaria/10 rounded-xl w-9 h-9 flex items-center justify-center">
          <LineIcon size={18} />
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-dashed border-borda bg-superficie/40 p-3">
        {carregando ? (
          <div className="h-full flex items-center justify-center text-sm text-texto">
            Carregando gráfico...
          </div>
        ) : serie.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serie}>
              <CartesianGrid strokeDasharray="3 3" stroke="#7C9EFF" strokeOpacity={0.2} />
              <XAxis dataKey="data" tickFormatter={formatarData} fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip
                formatter={(valor) => [`${valor} mg/dL`, '']}
                labelFormatter={(label) => `Dia ${formatarData(label)}`}
              />
              <ReferenceArea y1={70} y2={140} fill="#00D9B4" fillOpacity={0.1} />
              <Line type="monotone" dataKey="media" stroke="#2B7FFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-texto">
            Sem dados de glicemia nos últimos 30 dias.
          </div>
        )}
      </div>
    </Card>
  );
}

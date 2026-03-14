import { Card } from '@gluco/ui';
import { ArrowRight } from 'lucide-react';
import type { PainelAlerta } from '../types';

type Props = {
  alertas: PainelAlerta[];
  carregando: boolean;
};

function formatarTempo(iso: string) {
  const data = new Date(iso);
  const diferenca = Date.now() - data.getTime();
  const minutos = Math.floor(diferenca / 60000);
  if (minutos < 1) {
    return 'agora';
  }
  if (minutos < 60) {
    return `há ${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  return `há ${horas}h`;
}

function nivelAlerta(valor: number) {
  if (valor < 70 || valor > 180) {
    return 'CRITICO';
  }
  return 'ATENCAO';
}

export function AlertasAtivos({ alertas, carregando }: Props) {
  return (
    <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-4">
      <div className="text-sm font-semibold text-texto">Alertas ativos</div>
      {carregando ? (
        <div className="text-sm text-texto">Carregando alertas...</div>
      ) : alertas.length ? (
        <div className="space-y-3">
          {alertas.map((alerta) => {
            const nivel = nivelAlerta(alerta.valor);
            return (
              <div
                key={alerta.id}
                className="flex items-center justify-between rounded-xl border border-borda bg-superficie/60 px-3 py-2"
              >
                <div>
                  <div className="text-xs font-semibold text-texto">{alerta.paciente.nome}</div>
                  <div className="text-[10px] text-texto">
                    {alerta.valor} {alerta.unidade.replace('_', '/')}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      nivel === 'CRITICO' ? 'bg-perigo text-white' : 'bg-atencao/20 text-atencao'
                    }`}
                  >
                    {nivel === 'CRITICO' ? 'Crítico' : 'Atenção'}
                  </div>
                  <div className="text-[10px] text-texto mt-1">
                    {formatarTempo(alerta.registradoEm)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-texto">Nenhum alerta crítico nas últimas 24h.</div>
      )}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 text-sm text-primaria border border-primaria rounded-full py-2 hover:bg-primaria/10 transition"
      >
        Ver todos os alertas
        <ArrowRight size={16} />
      </button>
    </Card>
  );
}

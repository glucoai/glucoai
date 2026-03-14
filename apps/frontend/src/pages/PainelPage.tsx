import { Card } from '@gluco/ui';
import { useAuthStore } from '../stores/useAuthStore';
import { GraficoGlicemia } from '../features/painel/components/GraficoGlicemia';
import { KpiGrid } from '../features/painel/components/KpiGrid';
import { ResumoIA } from '../features/painel/components/ResumoIA';
import { AlertasAtivos } from '../features/painel/components/AlertasAtivos';
import { usePainel } from '../features/painel/hooks/usePainel';
import { HeatmapAdesao } from '../features/painel/components/HeatmapAdesao';
import { PieChart } from 'lucide-react';

export function PainelPage() {
  const token = useAuthStore((state) => state.token);
  const { estatisticas, alertas, serie, carregando, erro } = usePainel({ token });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        {erro ? <div className="text-sm text-perigo">{erro}</div> : null}
        <KpiGrid estatisticas={estatisticas} serie={serie} carregando={carregando} />
        <GraficoGlicemia serie={serie} carregando={carregando} />
        <Card className="h-80 flex flex-col gap-5 border border-borda bg-fundo/90 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-texto">Demografia</div>
              <div className="text-base text-texto font-semibold">Distribuição de tipos</div>
            </div>
            <div className="text-primaria bg-primaria/10 rounded-xl w-9 h-9 flex items-center justify-center">
              <PieChart size={18} />
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-dashed border-borda flex items-center justify-center text-texto text-sm bg-superficie/40">
            Distribuição de tipos de diabetes
          </div>
        </Card>
        <HeatmapAdesao />
      </div>

      <aside className="space-y-4">
        <ResumoIA />
        <AlertasAtivos alertas={alertas} carregando={carregando} />
      </aside>
    </div>
  );
}

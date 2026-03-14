import { GaugeGlicemia, Card } from '@gluco/ui';
import { useAuthStore } from '../stores/useAuthStore';

export function InicioPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-display font-semibold text-texto">
          Bom dia, {usuario?.nome ?? 'Paciente'}
        </div>
        <div className="text-sm text-texto">{dataHoje}</div>
      </div>
      <div className="flex justify-center">
        <GaugeGlicemia valor={112} contexto="Em jejum" tamanho={220} />
      </div>
      <Card className="grid grid-cols-3 text-center gap-2 border border-borda bg-fundo/90 backdrop-blur-md">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-texto">Proteína</div>
          <div className="text-lg font-semibold text-texto">0g</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-texto">Carboidratos</div>
          <div className="text-lg font-semibold text-texto">0g</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-texto">Calorias</div>
          <div className="text-lg font-semibold text-texto">0</div>
        </div>
      </Card>
      <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-3">
        <div className="text-xs uppercase tracking-[0.2em] text-texto">Resumo de hoje</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-texto">Meta de glicemia</div>
          <div className="text-sm font-semibold text-primaria">70 - 140 mg/dL</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-texto">Última medição</div>
          <div className="text-sm font-semibold text-texto">112 mg/dL</div>
        </div>
      </Card>
    </div>
  );
}

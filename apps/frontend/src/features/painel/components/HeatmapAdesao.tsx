import { Card } from '@gluco/ui';

type DiaHeatmap = {
  data: string;
  intensidade: number;
  total: number;
};

function gerarDias(): DiaHeatmap[] {
  const hoje = new Date();
  const dias: DiaHeatmap[] = [];
  for (let i = 27; i >= 0; i -= 1) {
    const data = new Date(hoje.getTime() - i * 24 * 60 * 60 * 1000);
    const total = (i * 7) % 5;
    dias.push({
      data: data.toISOString().slice(0, 10),
      total,
      intensidade: total,
    });
  }
  return dias;
}

function corPorIntensidade(valor: number) {
  if (valor === 0) {
    return 'bg-superficie';
  }
  if (valor === 1) {
    return 'bg-sucesso/20';
  }
  if (valor === 2) {
    return 'bg-sucesso/40';
  }
  if (valor === 3) {
    return 'bg-sucesso/60';
  }
  return 'bg-sucesso';
}

export function HeatmapAdesao() {
  const dias = gerarDias();
  return (
    <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-texto">Adesão</div>
          <div className="text-base text-texto font-semibold">Heatmap de registros</div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-texto">30 dias</span>
      </div>
      <div className="grid grid-cols-14 gap-2">
        {dias.map((dia) => (
          <div
            key={dia.data}
            title={`${dia.data} • ${dia.total} registros`}
            className={`w-4 h-4 rounded ${corPorIntensidade(dia.intensidade)} border border-borda`}
          />
        ))}
      </div>
      <div className="text-xs text-texto">
        Verde mais forte indica maior consistência de registros.
      </div>
    </Card>
  );
}

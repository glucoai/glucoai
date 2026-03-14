import { Card } from '@gluco/ui';
import { Bot } from 'lucide-react';

export function ResumoIA() {
  return (
    <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-texto flex items-center gap-2">
          <span className="text-primaria">
            <Bot size={18} />
          </span>
          <span>Resumo do Dia</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-texto">IA</span>
      </div>
      <div className="text-sm text-texto leading-relaxed">
        Hoje a maioria dos pacientes manteve a glicemia dentro da meta. Houve 2 casos críticos nas
        últimas horas e 4 pacientes com tendência de elevação após o almoço.
      </div>
      <div className="text-xs text-texto">Texto gerado pelo GPT-5.1 1x/dia</div>
    </Card>
  );
}

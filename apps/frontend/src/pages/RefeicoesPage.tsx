import { Card } from '@gluco/ui';
import { Camera, Bot, Sparkles } from 'lucide-react';

const analise = {
  alimentos: ['Arroz integral', 'Frango grelhado', 'Brócolis'],
  calorias: 520,
  carboidratos: 48,
  indiceGlicemico: 52,
  cargaGlicemica: 14,
  recomendacao:
    'Boa escolha! Para manter a glicemia estável, prefira adicionar mais fibras ou uma salada. Se sentir fome mais tarde, escolha um lanche leve.',
  indiceLabel: 'Baixo',
};

function AnaliseHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-xl bg-superficie border border-borda flex items-center justify-center text-primaria">
        <Camera size={22} />
      </div>
      <div>
        <div className="text-sm font-semibold text-texto">Almoço analisado</div>
        <div className="text-xs text-texto">{analise.alimentos.join(', ')}</div>
      </div>
      <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-texto">IA</span>
    </div>
  );
}

function AnaliseMacros() {
  return (
    <div className="grid grid-cols-4 gap-3 text-center">
      <div className="bg-superficie rounded-xl border border-borda py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-texto">Kcal</div>
        <div className="text-sm font-semibold text-texto">{analise.calorias}</div>
      </div>
      <div className="bg-superficie rounded-xl border border-borda py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-texto">Carboidratos</div>
        <div className="text-sm font-semibold text-texto">{analise.carboidratos}g</div>
      </div>
      <div className="bg-superficie rounded-xl border border-borda py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-texto">IG</div>
        <div className="text-sm font-semibold text-texto">{analise.indiceGlicemico}</div>
      </div>
      <div className="bg-superficie rounded-xl border border-borda py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-texto">CG</div>
        <div className="text-sm font-semibold text-texto">{analise.cargaGlicemica}</div>
      </div>
    </div>
  );
}

function AnaliseIndice() {
  return (
    <div className="flex items-center gap-2 text-xs text-texto">
      <Sparkles size={14} className="text-primaria" />
      Índice glicêmico: <span className="font-semibold text-sucesso">{analise.indiceLabel}</span>
    </div>
  );
}

function AnaliseMensagem() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-primaria/10 text-primaria flex items-center justify-center">
        <Bot size={16} />
      </div>
      <div className="bg-superficie border border-borda rounded-2xl px-4 py-3 text-sm text-texto">
        {analise.recomendacao}
      </div>
    </div>
  );
}

function CardAnaliseIA() {
  return (
    <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-4">
      <AnaliseHeader />
      <AnaliseMacros />
      <AnaliseIndice />
      <AnaliseMensagem />
    </Card>
  );
}

export function RefeicoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-display font-semibold text-texto">Refeições</div>
        <div className="text-sm text-texto">
          Envie uma foto e receba uma análise simples e encorajadora.
        </div>
      </div>
      <Card className="border border-borda bg-fundo/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primaria/10 text-primaria flex items-center justify-center">
          <Camera size={22} />
        </div>
        <div className="text-sm font-semibold text-texto">Enviar foto da refeição</div>
        <div className="text-xs text-texto">Toque para abrir a câmera</div>
      </Card>
      <CardAnaliseIA />
    </div>
  );
}

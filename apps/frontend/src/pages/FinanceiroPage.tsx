import { CheckoutPixAutomaticoCard } from '../features/financeiro/components/CheckoutPixAutomaticoCard';

export function FinanceiroPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-2xl font-display font-semibold text-texto">Financeiro</div>
        <div className="text-sm text-texto/80 mt-2">
          Integração financeira em andamento. Use o formulário abaixo para testar a criação do Pix Automático.
        </div>
      </div>
      <CheckoutPixAutomaticoCard />
    </div>
  );
}

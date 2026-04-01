type CheckoutPixAutomaticoForm = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  valor: string;
  comentario: string;
  diaGeracao: string;
  diaVencimento: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
};

type WooviSubscriptionResponse = {
  subscription?: {
    value?: number;
    dayGenerateCharge?: number;
    status?: string;
    correlationID?: string;
    paymentLinkUrl?: string;
    globalID?: string;
    pixRecurring?: {
      recurrencyId?: string;
      emv?: string;
      journey?: string;
      status?: string;
    };
  };
};

type WooviSubscriptionResponseLista = WooviSubscriptionResponse[];

export type { CheckoutPixAutomaticoForm, WooviSubscriptionResponse, WooviSubscriptionResponseLista };

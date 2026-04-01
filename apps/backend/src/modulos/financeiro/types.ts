type EnderecoCheckout = {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
};

type CheckoutPixAutomaticoPayload = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  valor: number;
  comentario?: string | null;
  diaGeracao: number;
  diaVencimento: number;
  endereco?: EnderecoCheckout | null;
  correlationId?: string | null;
};

type WebhookWooviPayload = {
  event: string;
  correlationID?: string | null;
  paymentSubscriptionGlobalID?: string | null;
  globalID?: string | null;
  pixRecurring?: {
    recurrencyId?: string | null;
    status?: string | null;
    journey?: string | null;
  } | null;
};

type WooviAssinaturaResposta = {
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

type WooviAssinaturaRespostaLista = WooviAssinaturaResposta[];

export type {
  CheckoutPixAutomaticoPayload,
  EnderecoCheckout,
  WebhookWooviPayload,
  WooviAssinaturaResposta,
  WooviAssinaturaRespostaLista,
};

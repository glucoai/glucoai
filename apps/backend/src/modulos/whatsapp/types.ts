type WebhookMensagem = {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  image?: { id?: string };
};

type WebhookChange = {
  value?: {
    messages?: WebhookMensagem[];
  };
};

type WebhookEntry = {
  changes?: WebhookChange[];
};

type WebhookPayload = {
  entry?: WebhookEntry[];
};

type MensagemEntrada = {
  id: string;
  telefone: string;
  tipo: 'text' | 'image' | 'unknown';
  texto?: string;
  imagemId?: string;
};

type RotaMensagem =
  | 'LEITURA_GLICEMIA'
  | 'FOTO_REFEICAO'
  | 'MENU'
  | 'HISTORICO'
  | 'PERFIL'
  | 'DESCONHECIDO';

export type { WebhookPayload, MensagemEntrada, RotaMensagem };

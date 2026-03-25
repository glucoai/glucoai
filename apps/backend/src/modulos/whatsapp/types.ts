type WebhookMensagem = {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  image?: { id?: string };
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string };
    list_reply?: { id?: string; title?: string };
    nfm_reply?: { response_json?: string; body?: unknown; name?: string };
  };
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
  tipo: 'text' | 'image' | 'interactive' | 'unknown';
  texto?: string;
  imagemId?: string;
  interactiveTipo?: string;
  flowResponseJson?: string;
};

type RotaMensagem =
  | 'LEITURA_GLICEMIA'
  | 'FOTO_REFEICAO'
  | 'MENU'
  | 'HISTORICO'
  | 'PERFIL'
  | 'DESCONHECIDO';

export type { WebhookPayload, MensagemEntrada, RotaMensagem };

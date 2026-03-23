import { useEffect, useMemo, useState } from 'react';
import {
  BotaoPerigo,
  BotaoPrimario,
  BotaoSecundario,
  CampoTexto,
  Card,
} from '@gluco/ui';
import {
  Bell,
  Copy,
  CreditCard,
  Palette,
  Shield,
  Smartphone,
  User,
} from 'lucide-react';
import { apiUrl } from '../config/api';
import { useAuthStore } from '../stores/useAuthStore';

type SecaoId = 'perfil' | 'notificacoes' | 'whatsapp' | 'aparencia' | 'seguranca' | 'financeiro';

type Secao = {
  id: SecaoId;
  titulo: string;
  descricao: string;
  icone: JSX.Element;
};

type FormWhatsApp = {
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  ativo: boolean;
};

type ConfigWhatsApp = {
  id: string;
  clinicaId: string;
  idNumero: string;
  numeroExibicao: string;
  businessId: string;
  tokenVerificacao: string;
  webhookUrl: string;
  ativo: boolean;
  criadoEm: string;
};

type RespostaConfiguracao = {
  configuracao: ConfigWhatsApp | null;
};

const secoes: Secao[] = [
  {
    id: 'perfil',
    titulo: 'Perfil',
    descricao: 'Informações pessoais e preferências da conta',
    icone: <User size={18} />,
  },
  {
    id: 'notificacoes',
    titulo: 'Notificações',
    descricao: 'Configure como e quando receber alertas',
    icone: <Bell size={18} />,
  },
  {
    id: 'whatsapp',
    titulo: 'WhatsApp',
    descricao: 'Integração e configurações do canal',
    icone: <Smartphone size={18} />,
  },
  {
    id: 'aparencia',
    titulo: 'Aparência',
    descricao: 'Tema, cores e personalização visual',
    icone: <Palette size={18} />,
  },
  {
    id: 'seguranca',
    titulo: 'Segurança',
    descricao: 'Senha, autenticação e privacidade',
    icone: <Shield size={18} />,
  },
  {
    id: 'financeiro',
    titulo: 'Configurações Financeiras',
    descricao: 'Moeda, categorias padrão e limites',
    icone: <CreditCard size={18} />,
  },
];

function gerarTokenVerificacao(businessId: string) {
  const normalizado = businessId.replace(/\s+/g, '');
  const base = normalizado.slice(-6) || 'gluco';
  return `gluco-${base}`.toLowerCase();
}

function criarWebhookUrl(idNumero: string) {
  const baseUrl =
    import.meta.env.VITE_URL_WEBHOOK ??
    import.meta.env.VITE_API_URL ??
    apiUrl ??
    'http://localhost:3000';
  const baseNormalizada = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const sufixo = idNumero ? `/${idNumero}` : '';
  return `${baseNormalizada}/whatsapp/webhook${sufixo}`;
}

function headersAutorizacao(token?: string | null) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ?? ''}`,
  };
}

async function buscarConfiguracaoWhatsapp(token?: string | null) {
  const resposta = await fetch(`${apiUrl}/whatsapp/configuracoes`, {
    headers: headersAutorizacao(token),
  });
  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    const mensagem = payload?.message ?? 'Erro ao carregar configuração do WhatsApp.';
    throw new Error(mensagem);
  }
  const payload = (await resposta.json()) as RespostaConfiguracao;
  return payload.configuracao;
}

async function criarConfiguracaoWhatsapp(token: string | null, dados: FormWhatsApp) {
  const resposta = await fetch(`${apiUrl}/whatsapp/configuracoes`, {
    method: 'POST',
    headers: headersAutorizacao(token),
    body: JSON.stringify({
      idNumero: dados.idNumero,
      numeroExibicao: dados.numeroExibicao,
      businessId: dados.businessId,
      ativo: dados.ativo,
      webhookUrl: criarWebhookUrl(dados.idNumero),
    }),
  });
  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    const mensagem = payload?.message ?? 'Erro ao salvar configuração do WhatsApp.';
    throw new Error(mensagem);
  }
  const payload = (await resposta.json()) as RespostaConfiguracao;
  if (!payload.configuracao) {
    throw new Error('Configuração não retornada pela API.');
  }
  return payload.configuracao;
}

async function excluirConfiguracaoWhatsapp(token: string | null, id: string) {
  const resposta = await fetch(`${apiUrl}/whatsapp/configuracoes/${id}`, {
    method: 'DELETE',
    headers: headersAutorizacao(token),
  });
  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    const mensagem = payload?.message ?? 'Erro ao excluir configuração do WhatsApp.';
    throw new Error(mensagem);
  }
  return true;
}

function CabecalhoConfiguracoes() {
  return (
    <div>
      <div className="text-2xl font-display font-semibold text-texto">Configurações</div>
      <div className="text-sm text-texto mt-2">
        Personalize sua experiência e configure integrações.
      </div>
    </div>
  );
}

type SidebarProps = {
  secaoAtiva: SecaoId;
  onSelecionar: (secao: SecaoId) => void;
};

function SidebarConfiguracoes({ secaoAtiva, onSelecionar }: SidebarProps) {
  return (
    <Card className="border border-borda bg-fundo/90 p-4">
      <div className="flex flex-col gap-2">
        {secoes.map((secao) => {
          const ativo = secao.id === secaoAtiva;
          return (
            <button
              key={secao.id}
              type="button"
              onClick={() => onSelecionar(secao.id)}
              className={`flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                ativo
                  ? 'bg-primaria/10 border-primaria text-primaria'
                  : 'border-transparent text-texto hover:border-borda hover:bg-superficie'
              }`}
            >
              <span
                className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                  ativo ? 'bg-primaria/10 text-primaria' : 'bg-superficie text-texto'
                }`}
              >
                {secao.icone}
              </span>
              <div>
                <div className="text-sm font-semibold">{secao.titulo}</div>
                <div className="text-xs text-texto/70">{secao.descricao}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

type PainelEmBreveProps = {
  titulo: string;
  descricao: string;
};

function PainelEmBreve({ titulo, descricao }: PainelEmBreveProps) {
  return (
    <Card className="border border-borda bg-fundo/90">
      <div className="text-xl font-display font-semibold text-texto">{titulo}</div>
      <div className="text-sm text-texto mt-2">{descricao}</div>
      <div className="mt-6 text-sm text-texto/70">Essa área será liberada em breve.</div>
    </Card>
  );
}

type CopiaProps = {
  rotulo: string;
  valor: string;
  onCopiar: (valor: string) => void;
};

function LinhaCopiavel({ rotulo, valor, onCopiar }: CopiaProps) {
  return (
    <div className="flex flex-col gap-1 text-sm text-texto">
      <span className="text-xs text-texto/70">{rotulo}</span>
      <div className="flex items-center gap-3">
        <span className="break-all">{valor}</span>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-borda text-texto hover:bg-superficie"
          onClick={() => onCopiar(valor)}
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
}

type ResumoProps = {
  config: ConfigWhatsApp;
  onCopiar: (valor: string) => void;
  onAlternarAtivo: () => void;
  onExcluir: () => void;
  excluindo: boolean;
};

function ResumoWhatsApp({ config, onCopiar, onAlternarAtivo, onExcluir, excluindo }: ResumoProps) {
  const criadoEm = new Date(config.criadoEm).toLocaleDateString('pt-BR');
  return (
    <Card className="border border-borda bg-fundo/90">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-lg font-semibold text-texto">{config.numeroExibicao}</div>
            <div className="text-sm text-texto/70">ID: {config.idNumero}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <BotaoSecundario className="px-4 py-2">Editar</BotaoSecundario>
            <BotaoSecundario className="px-4 py-2">Regenerar Token</BotaoSecundario>
            <BotaoPerigo className="px-4 py-2" onClick={onExcluir} disabled={excluindo}>
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </BotaoPerigo>
          </div>
        </div>
        <LinhaCopiavel rotulo="Webhook" valor={config.webhookUrl} onCopiar={onCopiar} />
        <LinhaCopiavel
          rotulo="Token de Verificação"
          valor={config.tokenVerificacao}
          onCopiar={onCopiar}
        />
        <div className="text-sm text-texto/70">Criado em: {criadoEm}</div>
        <label className="flex items-center gap-3 text-sm text-texto">
          <input
            type="checkbox"
            checked={config.ativo}
            onChange={onAlternarAtivo}
            className="h-5 w-9 rounded-full accent-primaria"
          />
          Ativo
        </label>
      </div>
    </Card>
  );
}

type ConfirmacaoProps = {
  aberto: boolean;
  titulo: string;
  descricao: string;
  confirmando: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

function ConfirmacaoExcluir({
  aberto,
  titulo,
  descricao,
  confirmando,
  onCancelar,
  onConfirmar,
}: ConfirmacaoProps) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/70 backdrop-blur-sm">
      <Card className="w-full max-w-md border border-borda bg-superficie p-6 shadow-modal">
        <div className="space-y-4">
          <div className="text-lg font-semibold text-texto">{titulo}</div>
          <div className="text-sm text-texto/70">{descricao}</div>
          <div className="flex justify-end gap-3">
            <BotaoSecundario className="px-4 py-2" onClick={onCancelar} disabled={confirmando}>
              Cancelar
            </BotaoSecundario>
            <BotaoPerigo className="px-4 py-2" onClick={onConfirmar} disabled={confirmando}>
              {confirmando ? 'Excluindo...' : 'Excluir'}
            </BotaoPerigo>
          </div>
        </div>
      </Card>
    </div>
  );
}

type FormProps = {
  form: FormWhatsApp;
  erro: string;
  sucesso: string;
  carregando: boolean;
  carregandoInicial: boolean;
  onAtualizar: (campo: keyof FormWhatsApp, valor: string | boolean) => void;
  onCancelar: () => void;
  onSubmit: () => void | Promise<void>;
};

function FormularioWhatsApp({
  form,
  erro,
  sucesso,
  carregando,
  carregandoInicial,
  onAtualizar,
  onCancelar,
  onSubmit,
}: FormProps) {
  return (
    <Card className="border border-borda bg-fundo/90">
      <div className="text-lg font-semibold text-texto">Nova Configuração</div>
      <div className="mt-4 grid gap-4">
        {carregandoInicial ? (
          <div className="text-sm text-texto/70">Carregando configuração salva...</div>
        ) : null}
        <CampoTexto
          rotulo="ID do Número"
          value={form.idNumero}
          onChange={(evento) => onAtualizar('idNumero', evento.target.value)}
        />
        <CampoTexto
          rotulo="Número de Exibição"
          value={form.numeroExibicao}
          onChange={(evento) => onAtualizar('numeroExibicao', evento.target.value)}
        />
        <CampoTexto
          rotulo="Business ID"
          value={form.businessId}
          onChange={(evento) => onAtualizar('businessId', evento.target.value)}
        />
        <label className="flex items-center gap-3 text-sm text-texto">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(evento) => onAtualizar('ativo', evento.target.checked)}
            className="h-5 w-9 rounded-full accent-primaria"
          />
          Ativo
        </label>
        {erro ? <div className="text-sm text-perigo">{erro}</div> : null}
        {sucesso ? <div className="text-sm text-sucesso">{sucesso}</div> : null}
        <div className="flex justify-end gap-3">
          <BotaoSecundario className="px-4 py-2" onClick={onCancelar}>
            Cancelar
          </BotaoSecundario>
          <BotaoPrimario className="px-4 py-2" onClick={onSubmit} disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar'}
          </BotaoPrimario>
        </div>
      </div>
    </Card>
  );
}

function useMensagemCopia() {
  const [mensagemCopia, setMensagemCopia] = useState('');

  async function copiar(valor: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setMensagemCopia('Copiado para a área de transferência.');
      setTimeout(() => setMensagemCopia(''), 2000);
    } catch {
      setMensagemCopia('Não foi possível copiar.');
      setTimeout(() => setMensagemCopia(''), 2000);
    }
  }

  return { mensagemCopia, copiar };
}

function useWhatsAppForm(token?: string | null) {
  const [form, setForm] = useState<FormWhatsApp>({
    idNumero: '',
    numeroExibicao: '',
    businessId: '',
    ativo: true,
  });
  const [config, setConfig] = useState<ConfigWhatsApp | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const webhookPreview = useMemo(() => criarWebhookUrl(form.idNumero), [form.idNumero]);
  const tokenVerificacaoPreview = useMemo(
    () => (form.businessId ? gerarTokenVerificacao(form.businessId) : ''),
    [form.businessId],
  );

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      setCarregandoInicial(true);
      setErro('');
      try {
        const existente = await buscarConfiguracaoWhatsapp(token);
        if (ativo && existente) {
          setConfig(existente);
          setForm({
            idNumero: existente.idNumero,
            numeroExibicao: existente.numeroExibicao,
            businessId: existente.businessId,
            ativo: existente.ativo,
          });
        }
      } catch (error) {
        if (ativo) {
          setErro((error as Error).message);
        }
      } finally {
        if (ativo) {
          setCarregandoInicial(false);
        }
      }
    };
    if (token) {
      carregar();
    }
    return () => {
      ativo = false;
    };
  }, [token]);

  function atualizar(campo: keyof FormWhatsApp, valor: string | boolean) {
    setForm((estado) => ({ ...estado, [campo]: valor }));
  }

  function alternarAtivo() {
    setForm((estado) => ({ ...estado, ativo: !estado.ativo }));
    setConfig((estado) => (estado ? { ...estado, ativo: !estado.ativo } : estado));
  }

  function cancelar() {
    if (config) {
      setForm({
        idNumero: config.idNumero,
        numeroExibicao: config.numeroExibicao,
        businessId: config.businessId,
        ativo: config.ativo,
      });
    } else {
      setForm({
        idNumero: '',
        numeroExibicao: '',
        businessId: '',
        ativo: true,
      });
    }
    setErro('');
    setSucesso('');
  }

  async function criar() {
    setErro('');
    setSucesso('');
    if (!form.idNumero.trim()) {
      setErro('Informe o ID do número para continuar.');
      return;
    }
    if (!form.numeroExibicao.trim()) {
      setErro('Informe o número de exibição para continuar.');
      return;
    }
    if (!form.businessId.trim()) {
      setErro('Informe o Business ID para continuar.');
      return;
    }
    if (!token) {
      setErro('Sessão expirada. Faça login novamente.');
      return;
    }
    setCarregando(true);
    try {
      const criado = await criarConfiguracaoWhatsapp(token, form);
      setConfig(criado);
      setSucesso('Configuração atualizada com sucesso.');
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  function abrirConfirmacaoExclusao() {
    if (!config) return;
    setConfirmarExclusao(true);
  }

  function fecharConfirmacaoExclusao() {
    setConfirmarExclusao(false);
  }

  async function confirmarExclusaoWhatsApp() {
    if (!config) return;
    if (!token) {
      setErro('Sessão expirada. Faça login novamente.');
      return;
    }
    setExcluindo(true);
    setErro('');
    setSucesso('');
    try {
      await excluirConfiguracaoWhatsapp(token, config.id);
      setConfig(null);
      setForm({
        idNumero: '',
        numeroExibicao: '',
        businessId: '',
        ativo: true,
      });
      setSucesso('Configuração removida com sucesso.');
      setConfirmarExclusao(false);
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setExcluindo(false);
    }
  }

  return {
    form,
    webhookPreview,
    tokenVerificacaoPreview,
    config,
    erro,
    sucesso,
    carregando,
    carregandoInicial,
    excluindo,
    confirmarExclusao,
    atualizar,
    alternarAtivo,
    cancelar,
    criar,
    abrirConfirmacaoExclusao,
    fecharConfirmacaoExclusao,
    confirmarExclusaoWhatsApp,
  };
}

function CabecalhoWhatsApp() {
  return (
    <Card className="border border-borda bg-fundo/90">
      <div className="text-xl font-display font-semibold text-texto">WhatsApp</div>
      <div className="text-sm text-texto mt-2">
        Gerencie credenciais e webhook para integrar o canal de mensagens.
      </div>
    </Card>
  );
}

type MensagemCopiaProps = {
  mensagem: string;
};

function MensagemCopia({ mensagem }: MensagemCopiaProps) {
  if (!mensagem) return null;
  return <div className="text-sm text-sucesso">{mensagem}</div>;
}

function PainelWhatsApp() {
  const token = useAuthStore((state) => state.token);
  const {
    form,
    erro,
    sucesso,
    carregando,
    carregandoInicial,
    config,
    excluindo,
    confirmarExclusao,
    atualizar,
    cancelar,
    criar,
    abrirConfirmacaoExclusao,
    fecharConfirmacaoExclusao,
    confirmarExclusaoWhatsApp,
    alternarAtivo,
  } = useWhatsAppForm(token);
  const { mensagemCopia, copiar } = useMensagemCopia();

  return (
    <div className="space-y-6">
      <CabecalhoWhatsApp />
      <FormularioWhatsApp
        form={form}
        erro={erro}
        sucesso={sucesso}
        carregando={carregando}
        carregandoInicial={carregandoInicial}
        onAtualizar={atualizar}
        onCancelar={cancelar}
        onSubmit={criar}
      />
      <MensagemCopia mensagem={mensagemCopia} />
      {config ? (
        <ResumoWhatsApp
          config={config}
          onCopiar={copiar}
          onAlternarAtivo={alternarAtivo}
          onExcluir={abrirConfirmacaoExclusao}
          excluindo={excluindo}
        />
      ) : null}
      <ConfirmacaoExcluir
        aberto={confirmarExclusao}
        titulo="Excluir configuração"
        descricao="Essa ação remove a configuração do WhatsApp e não poderá ser desfeita."
        confirmando={excluindo}
        onCancelar={fecharConfirmacaoExclusao}
        onConfirmar={confirmarExclusaoWhatsApp}
      />
    </div>
  );
}

type PainelProps = {
  secaoAtiva: SecaoId;
};

function PainelSecao({ secaoAtiva }: PainelProps) {
  if (secaoAtiva === 'whatsapp') return <PainelWhatsApp />;
  const secao = secoes.find((item) => item.id === secaoAtiva) ?? secoes[0];
  if (!secao) {
    return <PainelEmBreve titulo="Em breve" descricao="Configuração em preparação." />;
  }
  return <PainelEmBreve titulo={secao.titulo} descricao={secao.descricao} />;
}

export function ConfiguracoesPage() {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoId>('whatsapp');

  return (
    <div className="space-y-6">
      <CabecalhoConfiguracoes />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <SidebarConfiguracoes secaoAtiva={secaoAtiva} onSelecionar={setSecaoAtiva} />
        <PainelSecao secaoAtiva={secaoAtiva} />
      </div>
    </div>
  );
}

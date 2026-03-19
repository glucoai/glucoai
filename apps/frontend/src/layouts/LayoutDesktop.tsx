import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  X,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { apiUrl } from '../config/api';

type Props = {
  children: ReactNode;
};

type Item = {
  id: string;
  rotulo: string;
  href: string;
  icone: ReactNode;
};

type Alerta = {
  id: string;
  valor: number;
  unidade: string;
  registradoEm: string;
  paciente: { nome: string };
};

const itens: Item[] = [
  {
    id: 'painel',
    rotulo: 'Painel',
    href: '/painel',
    icone: <LayoutDashboard size={18} />,
  },
  {
    id: 'pacientes',
    rotulo: 'Pacientes',
    href: '/pacientes',
    icone: <Users size={18} />,
  },
  {
    id: 'mensagens',
    rotulo: 'Mensagens',
    href: '/mensagens',
    icone: <MessageCircle size={18} />,
  },
  {
    id: 'financeiro',
    rotulo: 'Financeiro',
    href: '/financeiro',
    icone: <CreditCard size={18} />,
  },
  {
    id: 'configuracoes',
    rotulo: 'Configurações',
    href: '/configuracoes',
    icone: <Settings size={18} />,
  },
];

export function LayoutDesktop({ children }: Props) {
  const usuario = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const limparSessao = useAuthStore((state) => state.limparSessao);
  const location = useLocation();
  const navigate = useNavigate();
  const rotaAtual = location.pathname;
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregandoAlertas, setCarregandoAlertas] = useState(false);
  const [menuNotificacoesAberto, setMenuNotificacoesAberto] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);
  const [tema, setTema] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const temaSalvo = localStorage.getItem('gluco-tema');
    if (temaSalvo === 'dark' || temaSalvo === 'light') return temaSalvo;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });
  const [saindo, setSaindo] = useState(false);
  const [erroSaida, setErroSaida] = useState('');
  const dropdownNotificacoesRef = useRef<HTMLDivElement | null>(null);
  const dropdownUsuarioRef = useRef<HTMLDivElement | null>(null);

  function formatarTempo(iso: string) {
    const data = new Date(iso);
    const minutos = Math.floor((Date.now() - data.getTime()) / 60000);
    if (minutos < 1) return 'agora';
    if (minutos < 60) return `há ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    return `há ${horas}h`;
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('gluco-tema', tema);
  }, [tema]);

  useEffect(() => {
    let ativo = true;
    async function carregarAlertas() {
      setCarregandoAlertas(true);
      try {
        const resposta = await fetch(`${apiUrl}/painel/alertas`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        if (!resposta.ok) {
          if (ativo) setCarregandoAlertas(false);
          return;
        }
        const payload = (await resposta.json()) as { alertas: Alerta[] };
        if (ativo) {
          setAlertas(payload.alertas);
        }
      } finally {
        if (ativo) setCarregandoAlertas(false);
      }
    }
    carregarAlertas();
    const timer = setInterval(carregarAlertas, 60000);
    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, [token]);

  useEffect(() => {
    if (!menuNotificacoesAberto && !menuUsuarioAberto) return;
    function fecharAoClicar(evento: MouseEvent) {
      const alvo = evento.target as Node | null;
      if (
        menuNotificacoesAberto &&
        dropdownNotificacoesRef.current &&
        alvo &&
        !dropdownNotificacoesRef.current.contains(alvo)
      ) {
        setMenuNotificacoesAberto(false);
      }
      if (
        menuUsuarioAberto &&
        dropdownUsuarioRef.current &&
        alvo &&
        !dropdownUsuarioRef.current.contains(alvo)
      ) {
        setMenuUsuarioAberto(false);
      }
    }
    document.addEventListener('mousedown', fecharAoClicar);
    return () => document.removeEventListener('mousedown', fecharAoClicar);
  }, [menuNotificacoesAberto, menuUsuarioAberto]);

  async function sair() {
    if (saindo) return;
    setErroSaida('');
    setSaindo(true);
    try {
      if (!refreshToken) {
        limparSessao();
        navigate('/entrar');
        return;
      }
      const resposta = await fetch(`${apiUrl}/autenticacao/sair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!resposta.ok) {
        setErroSaida('Não foi possível encerrar a sessão. Tente novamente.');
        return;
      }
      limparSessao();
      navigate('/entrar');
    } catch {
      setErroSaida('Não foi possível encerrar a sessão. Tente novamente.');
    } finally {
      setSaindo(false);
    }
  }

  return (
    <div className="min-h-screen bg-superficie flex">
      <aside className="hidden lg:flex flex-col w-64 bg-fundo border-r border-borda">
        <div className="h-16 flex items-center px-6">
          <img
            src="/LOGO GLUCO AI.svg"
            alt="Gluco IA"
            className="h-7 w-auto"
          />
        </div>
        <div className="border-b border-borda" />
        <nav className="mt-6 flex flex-col gap-2 text-sm px-6">
          {itens.map((item) => {
            const ativo = rotaAtual.startsWith(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  ativo ? 'bg-primaria/10 text-primaria font-semibold' : 'text-texto'
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    ativo ? 'bg-primaria/10 text-primaria' : 'bg-superficie text-texto'
                  }`}
                >
                  {item.icone}
                </span>
                <span>{item.rotulo}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-xl bg-superficie px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-primaria/10 flex items-center justify-center text-primaria">
            {usuario?.nome?.charAt(0) ?? 'G'}
          </div>
          <div>
            <div className="text-sm font-medium text-texto">{usuario?.nome ?? 'Administrador'}</div>
            <div className="text-xs text-texto">Conta Clínica</div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        {alertas.length ? (
          <div className="bg-perigo text-white text-sm px-6 py-2">
            {alertas.length} alerta{alertas.length > 1 ? 's' : ''} crítico
            {alertas.length > 1 ? 's' : ''} aguardando resposta.
          </div>
        ) : null}
        <header className="h-16 bg-fundo border-b border-borda flex items-center justify-between px-6">
          <div className="font-display text-lg text-texto flex items-center gap-2">
            <Sun className="text-atencao" size={18} />
            <span>Bom dia, {usuario?.nome ?? 'Doutor'}!</span>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-superficie px-4 py-2 rounded-full border border-borda w-80">
            <Search className="text-texto" size={16} />
            <input
              className="flex-1 bg-transparent text-sm text-texto focus:outline-none"
              placeholder="Buscar pacientes, relatórios..."
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-borda bg-superficie text-texto flex items-center justify-center"
              onClick={() => {
                const novoTema = tema === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', novoTema);
                localStorage.setItem('gluco-tema', novoTema);
                setTema(novoTema);
              }}
              aria-label="Alternar tema"
            >
              {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="relative text-texto"
              onClick={() => {
                setMenuNotificacoesAberto((estado) => !estado);
                setMenuUsuarioAberto(false);
              }}
            >
              <Bell size={20} />
              {alertas.length ? (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-perigo rounded-full animate-pulse" />
              ) : null}
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-borda bg-superficie text-texto"
              onClick={() => {
                setMenuUsuarioAberto((estado) => !estado);
                setMenuNotificacoesAberto(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primaria/10 flex items-center justify-center text-primaria text-sm font-semibold">
                {usuario?.nome?.charAt(0) ?? 'G'}
              </div>
              <span className="hidden lg:block text-sm font-medium">
                {usuario?.nome ?? 'Administrador'}
              </span>
            </button>
            {menuNotificacoesAberto ? (
              <div
                ref={dropdownNotificacoesRef}
                className="absolute right-6 top-14 w-80 bg-fundo border border-borda rounded-2xl shadow-card p-4 z-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-texto">Notificações</div>
                  <button
                    type="button"
                    className="text-texto hover:text-primaria"
                    onClick={() => setMenuNotificacoesAberto(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                {carregandoAlertas ? (
                  <div className="text-xs text-texto">Carregando alertas...</div>
                ) : alertas.length ? (
                  <div className="space-y-3">
                    {alertas.slice(0, 6).map((alerta) => (
                      <div
                        key={alerta.id}
                        className="flex items-center justify-between border border-borda rounded-xl px-3 py-2 bg-superficie/60"
                      >
                        <div>
                          <div className="text-xs font-semibold text-texto">
                            {alerta.paciente.nome}
                          </div>
                          <div className="text-[10px] text-texto">
                            glicemia crítica: {Math.round(alerta.valor)}{' '}
                            {alerta.unidade.replace('_', '/')}
                          </div>
                        </div>
                        <div className="text-[10px] text-texto">
                          {formatarTempo(alerta.registradoEm)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-texto">Nenhum alerta crítico no momento.</div>
                )}
              </div>
            ) : null}
            {menuUsuarioAberto ? (
              <div
                ref={dropdownUsuarioRef}
                className="absolute right-6 top-14 w-64 bg-fundo border border-borda rounded-2xl shadow-card p-4 z-50"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-texto">
                    {usuario?.nome ?? 'Administrador'}
                  </div>
                  <div className="text-xs text-texto">
                    {usuario?.email ?? 'Conta clínica'}
                  </div>
                </div>
                <div className="border-t border-borda my-3" />
                <Link
                  to="/configuracoes"
                  className="flex items-center gap-2 text-sm text-texto hover:text-primaria"
                  onClick={() => setMenuUsuarioAberto(false)}
                >
                  <Settings size={16} />
                  <span>Configurações</span>
                </Link>
                <button
                  type="button"
                  className="mt-3 w-full flex items-center gap-2 text-sm text-perigo hover:text-perigo"
                  onClick={sair}
                  disabled={saindo}
                >
                  <LogOut size={16} />
                  <span>{saindo ? 'Saindo...' : 'Sair'}</span>
                </button>
                {erroSaida ? (
                  <div className="mt-3 text-xs text-perigo">{erroSaida}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

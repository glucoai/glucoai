import { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../config/api';
import { useAuthStore } from '../stores/useAuthStore';
import { usePacientes } from '../features/pacientes/hooks/usePacientes';

type Mensagem = {
  id: string;
  conteudo: string;
  remetente: 'PACIENTE' | 'SISTEMA' | 'IA' | 'PROFISSIONAL';
  tipo: 'TEXTO' | 'IMAGEM' | 'TEMPLATE';
  criadoEm: string;
};

type HeatmapDia = {
  data: string;
  total: number;
  media: number;
};

type Toast = {
  id: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'atencao';
  mensagem: string;
};

function formatarHorario(iso: string) {
  const data = new Date(iso);
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function corHeatmap(total: number) {
  if (total === 0) return 'bg-borda';
  if (total === 1) return 'bg-info/30';
  if (total <= 3) return 'bg-sucesso/60';
  return 'bg-otimo';
}

export function MensagensPage() {
  const token = useAuthStore((state) => state.token);
  const { dados, carregando, erro } = usePacientes({ busca: '', pagina: 1, token });
  const pacientes = dados?.dados ?? [];
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [paginaMensagens, setPaginaMensagens] = useState(1);
  const [totalMensagens, setTotalMensagens] = useState(0);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [carregandoEnvio, setCarregandoEnvio] = useState(false);
  const [texto, setTexto] = useState('');
  const [heatmap, setHeatmap] = useState<HeatmapDia[]>([]);
  const [carregandoHeatmap, setCarregandoHeatmap] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!pacienteSelecionado && pacientes.length) {
      setPacienteSelecionado(pacientes[0]!.id);
    }
  }, [pacientes, pacienteSelecionado]);

  const pacienteAtual = useMemo(
    () => pacientes.find((paciente) => paciente.id === pacienteSelecionado) ?? null,
    [pacientes, pacienteSelecionado],
  );

  async function adicionarToast(tipo: Toast['tipo'], mensagem: string) {
    const id = crypto.randomUUID();
    setToasts((estado) => [...estado, { id, tipo, mensagem }]);
    setTimeout(() => {
      setToasts((estado) => estado.filter((item) => item.id !== id));
    }, 5000);
  }

  async function carregarMensagens(pacienteId: string, pagina: number) {
    setCarregandoMensagens(true);
    try {
      const resposta = await fetch(
        `${apiUrl}/pacientes/${pacienteId}/mensagens?pagina=${pagina}&limite=30`,
        {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        },
      );
      if (!resposta.ok) {
        const payload = await resposta.json().catch(() => null);
        throw new Error(payload?.message ?? 'Não foi possível carregar mensagens.');
      }
      const payload = (await resposta.json()) as {
        total: number;
        dados: Mensagem[];
      };
      setTotalMensagens(payload.total);
      setMensagens((estado) => {
        if (pagina === 1) {
          return payload.dados;
        }
        return [...estado, ...payload.dados];
      });
      setPaginaMensagens(pagina);
    } catch (erro) {
      await adicionarToast('erro', (erro as Error).message);
    } finally {
      setCarregandoMensagens(false);
    }
  }

  async function carregarHeatmap(pacienteId: string) {
    setCarregandoHeatmap(true);
    try {
      const resposta = await fetch(`${apiUrl}/pacientes/${pacienteId}/heatmap?meses=3`, {
        headers: { Authorization: `Bearer ${token ?? ''}` },
      });
      if (!resposta.ok) {
        const payload = await resposta.json().catch(() => null);
        throw new Error(payload?.message ?? 'Não foi possível carregar o heatmap.');
      }
      const payload = (await resposta.json()) as { dias: HeatmapDia[] };
      setHeatmap(payload.dias);
    } catch (erro) {
      await adicionarToast('erro', (erro as Error).message);
    } finally {
      setCarregandoHeatmap(false);
    }
  }

  useEffect(() => {
    if (!pacienteSelecionado) return;
    carregarMensagens(pacienteSelecionado, 1);
    carregarHeatmap(pacienteSelecionado);
  }, [pacienteSelecionado]);

  async function enviarMensagem() {
    if (!pacienteSelecionado || !texto.trim()) return;
    setCarregandoEnvio(true);
    try {
      const resposta = await fetch(`${apiUrl}/pacientes/${pacienteSelecionado}/mensagens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ conteudo: texto.trim() }),
      });
      if (!resposta.ok) {
        const payload = await resposta.json().catch(() => null);
        throw new Error(payload?.message ?? 'Não foi possível enviar a mensagem.');
      }
      const payload = (await resposta.json()) as { mensagem: Mensagem };
      setMensagens((estado) => [payload.mensagem, ...estado]);
      setTexto('');
      await adicionarToast('sucesso', 'Mensagem enviada com sucesso.');
    } catch (erro) {
      await adicionarToast('erro', (erro as Error).message);
    } finally {
      setCarregandoEnvio(false);
    }
  }

  async function baixarRelatorio() {
    if (!pacienteSelecionado) return;
    try {
      const resposta = await fetch(`${apiUrl}/pacientes/${pacienteSelecionado}/relatorio`, {
        headers: { Authorization: `Bearer ${token ?? ''}` },
      });
      if (!resposta.ok) {
        const payload = await resposta.json().catch(() => null);
        throw new Error(payload?.message ?? 'Não foi possível gerar o relatório.');
      }
      const blob = await resposta.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'relatorio-paciente.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      await adicionarToast('sucesso', 'Relatório gerado com sucesso.');
    } catch (erro) {
      await adicionarToast('erro', (erro as Error).message);
    }
  }

  const mensagensOrdenadas = useMemo(() => [...mensagens].reverse(), [mensagens]);

  return (
    <div className="bg-fundo border border-borda rounded-2xl shadow-card overflow-hidden relative">
      <div className="flex flex-col lg:flex-row h-[70vh]">
        <aside className="w-full lg:max-w-[280px] border-b lg:border-b-0 lg:border-r border-borda bg-fundo/80">
          <div className="p-4 border-b border-borda">
            <div className="text-lg font-display font-semibold text-texto">Mensagens</div>
            <div className="text-xs text-texto">Pacientes recentes</div>
          </div>
          {carregando ? (
            <div className="p-4 text-sm text-texto">Carregando pacientes...</div>
          ) : erro ? (
            <div className="p-4 text-sm text-perigo">{erro}</div>
          ) : (
            <div className="divide-y divide-borda max-h-[30vh] lg:max-h-full overflow-y-auto">
              {pacientes.map((paciente) => (
                <button
                  key={paciente.id}
                  type="button"
                  className={`w-full text-left px-4 py-3 hover:bg-superficie transition ${
                    pacienteSelecionado === paciente.id ? 'bg-primaria/10' : ''
                  }`}
                  onClick={() => setPacienteSelecionado(paciente.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-texto">{paciente.nome}</div>
                    <div className="text-xs text-texto">
                      {paciente.glicemias?.[0]?.registradoEm
                        ? formatarHorario(paciente.glicemias[0].registradoEm)
                        : '--:--'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-texto line-clamp-1">
                      {paciente.glicemias?.[0]?.valor
                        ? `Última glicemia: ${Math.round(paciente.glicemias[0].valor)} mg/dL`
                        : 'Sem registros recentes'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="flex-1 flex flex-col bg-superficie">
          <header className="h-16 px-6 flex items-center justify-between border-b border-borda bg-fundo">
            <div>
              <div className="text-sm font-semibold text-texto">
                {pacienteAtual?.nome ?? 'Selecione um paciente'}
              </div>
              <div className="text-xs text-texto">Atendimento WhatsApp</div>
            </div>
            <button
              type="button"
              className="text-xs text-primaria border border-primaria rounded-full px-3 py-1 hover:bg-primaria/10"
              onClick={baixarRelatorio}
              disabled={!pacienteSelecionado}
            >
              Gerar relatório PDF
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {carregandoMensagens ? (
              <div className="text-sm text-texto">Carregando mensagens...</div>
            ) : mensagensOrdenadas.length ? (
              mensagensOrdenadas.map((mensagem) => {
                const isPaciente = mensagem.remetente === 'PACIENTE';
                const isSistema = mensagem.remetente === 'SISTEMA' || mensagem.remetente === 'IA';
                const alinhamento = isPaciente ? 'items-end' : 'items-start';
                const cor =
                  mensagem.remetente === 'PACIENTE'
                    ? 'bg-primaria/10 text-texto'
                    : mensagem.remetente === 'PROFISSIONAL'
                      ? 'bg-sucesso/10 text-texto'
                      : 'bg-fundo text-texto';
                const badge =
                  mensagem.remetente === 'PROFISSIONAL'
                    ? 'Profissional'
                    : isSistema
                      ? 'IA'
                      : null;
                return (
                  <div key={mensagem.id} className={`flex flex-col ${alinhamento} gap-1`}>
                    {badge ? (
                      <span className="text-[10px] text-texto uppercase tracking-wide">
                        {badge}
                      </span>
                    ) : null}
                    <div
                      className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${cor}`}
                    >
                      {mensagem.conteudo}
                    </div>
                    <span className="text-[10px] text-texto">{formatarHorario(mensagem.criadoEm)}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-texto">Nenhuma mensagem ainda.</div>
            )}
            {mensagens.length < totalMensagens ? (
              <button
                type="button"
                className="text-xs text-primaria border border-primaria rounded-full px-4 py-1"
                onClick={() => pacienteSelecionado && carregarMensagens(pacienteSelecionado, paginaMensagens + 1)}
                disabled={carregandoMensagens}
              >
                Carregar mais mensagens
              </button>
            ) : null}
          </div>

          <footer className="border-t border-borda bg-fundo px-4 py-3 flex items-center gap-3">
            <input
              className="flex-1 bg-superficie border border-borda rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Digite uma mensagem..."
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              disabled={!pacienteSelecionado || carregandoEnvio}
            />
            <button
              type="button"
              className="bg-primaria text-white text-sm rounded-full px-5 py-2 hover:bg-primaria-escura transition disabled:opacity-60"
              onClick={enviarMensagem}
              disabled={!texto.trim() || carregandoEnvio || !pacienteSelecionado}
            >
              {carregandoEnvio ? 'Enviando...' : 'Enviar'}
            </button>
          </footer>
        </section>

        <aside className="hidden xl:flex flex-col w-[320px] border-l border-borda bg-fundo/80">
          <div className="p-5 border-b border-borda">
            <div className="text-sm font-semibold text-texto">Heatmap de adesão</div>
            <div className="text-xs text-texto">Últimos 3 meses</div>
          </div>
          <div className="p-5 space-y-4">
            {carregandoHeatmap ? (
              <div className="text-sm text-texto">Carregando heatmap...</div>
            ) : heatmap.length ? (
              <div className="grid grid-cols-12 gap-2">
                {heatmap.map((dia) => (
                  <div
                    key={dia.data}
                    title={`${dia.data}: ${dia.total} registros, média ${dia.media} mg/dL`}
                    className={`w-3 h-3 rounded ${corHeatmap(dia.total)} border border-borda`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-texto">Sem dados suficientes.</div>
            )}
            <div className="flex items-center justify-between text-[10px] text-texto uppercase tracking-[0.2em]">
              <span>Menos</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-borda border border-borda" />
                <span className="w-3 h-3 rounded bg-info/30 border border-borda" />
                <span className="w-3 h-3 rounded bg-sucesso/60 border border-borda" />
                <span className="w-3 h-3 rounded bg-otimo border border-borda" />
              </div>
              <span>Mais</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-4 py-3 text-sm shadow-modal border ${
              toast.tipo === 'sucesso'
                ? 'bg-sucesso text-white border-sucesso'
                : toast.tipo === 'erro'
                  ? 'bg-perigo text-white border-perigo'
                  : toast.tipo === 'atencao'
                    ? 'bg-atencao text-white border-atencao'
                    : 'bg-fundo text-texto border-borda'
            }`}
          >
            {toast.mensagem}
          </div>
        ))}
      </div>
    </div>
  );
}

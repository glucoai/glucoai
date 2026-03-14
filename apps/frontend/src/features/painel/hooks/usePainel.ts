import { useEffect, useState } from 'react';
import { apiUrl } from '../../../config/api';
import type { PainelAlerta, PainelEstatisticas, PainelSerieGlicemia } from '../types';

type RespostaAlertas = { alertas: PainelAlerta[] };
type RespostaSerie = { serie: PainelSerieGlicemia[] };

type Params = {
  token?: string | null;
};

function headersAutorizacao(token?: string | null) {
  return { Authorization: `Bearer ${token ?? ''}` };
}

async function buscarJson<T>(url: string, token?: string | null) {
  const resposta = await fetch(url, { headers: headersAutorizacao(token) });
  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    const mensagem = payload?.message ?? 'Erro ao carregar dados do painel.';
    throw new Error(mensagem);
  }
  return (await resposta.json()) as T;
}

function usePainel({ token }: Params) {
  const [estatisticas, setEstatisticas] = useState<PainelEstatisticas | null>(null);
  const [alertas, setAlertas] = useState<PainelAlerta[]>([]);
  const [serie, setSerie] = useState<PainelSerieGlicemia[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      setCarregando(true);
      setErro('');
      try {
        const [estatisticasResp, alertasResp, serieResp] = await Promise.all([
          buscarJson<PainelEstatisticas>(`${apiUrl}/painel/estatisticas`, token),
          buscarJson<RespostaAlertas>(`${apiUrl}/painel/alertas`, token),
          buscarJson<RespostaSerie>(`${apiUrl}/painel/graficos/glicemia`, token),
        ]);
        if (ativo) {
          setEstatisticas(estatisticasResp);
          setAlertas(alertasResp.alertas);
          setSerie(serieResp.serie);
        }
      } catch (error) {
        if (ativo) {
          setErro((error as Error).message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
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

  return { estatisticas, alertas, serie, carregando, erro };
}

export { usePainel };

import { useEffect, useState } from 'react';
import { apiUrl } from '../../../config/api';
import type { PacientesResposta, TipoDiabetes } from '../types';

type Params = {
  busca: string;
  tipo?: TipoDiabetes;
  pagina: number;
  token?: string | null;
};

function montarQuery({ busca, tipo, pagina }: Params) {
  const params = new URLSearchParams();
  if (busca) {
    params.set('busca', busca);
  }
  if (tipo) {
    params.set('tipo', tipo);
  }
  params.set('pagina', String(pagina));
  params.set('limite', '20');
  return params.toString();
}

async function buscarPacientes(params: Params) {
  const query = montarQuery(params);
  const resposta = await fetch(`${apiUrl}/pacientes?${query}`, {
    headers: {
      Authorization: `Bearer ${params.token ?? ''}`,
    },
  });
  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    const mensagem = payload?.message ?? 'Não foi possível carregar pacientes.';
    throw new Error(mensagem);
  }
  return (await resposta.json()) as PacientesResposta;
}

function usePacientes(params: Params) {
  const [dados, setDados] = useState<PacientesResposta | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      setCarregando(true);
      setErro('');
      try {
        const payload = await buscarPacientes(params);
        if (ativo) {
          setDados(payload);
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
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.busca, params.pagina, params.tipo, params.token]);

  return { dados, carregando, erro };
}

export { usePacientes };

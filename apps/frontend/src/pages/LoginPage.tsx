import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { useAuthStore } from '../stores/useAuthStore';
import { BotaoPrimario, Card } from '@gluco/ui';
import { Eye, EyeOff, Mail, Lock, AlertTriangle } from 'lucide-react';

type RespostaLogin = {
  token: string;
  refreshToken: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: 'ADMINISTRADOR' | 'PROFISSIONAL' | 'PACIENTE';
    clinicaId?: string;
  };
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const setSessao = useAuthStore((state) => state.setSessao);

  async function entrar() {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch(`${apiUrl}/autenticacao/entrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (!resposta.ok) {
        const payload = await resposta.json();
        setErro(payload?.message ?? 'Não foi possível entrar.');
        return;
      }
      const dados = (await resposta.json()) as RespostaLogin;
      setSessao({ usuario: dados.usuario, token: dados.token, refreshToken: dados.refreshToken });
      const destino = dados.usuario.perfil === 'PACIENTE' ? '/inicio' : '/painel';
      window.location.href = destino;
    } catch {
      setErro('Erro ao conectar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-superficie flex items-center justify-center p-6">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <img
            src="/logo-gluco-ai-para-fundo-escuro.png"
            alt="Gluco IA"
            className="h-10 w-auto logo-tema-escuro"
          />
          <img
            src="/logo-gluco-ai-para-fundo-claro.png"
            alt="Gluco IA"
            className="h-10 w-auto logo-tema-claro"
          />
          <p className="text-texto">Tecnologia cuidando da sua glicemia.</p>
        </div>
        {erro ? (
          <div className="bg-perigo text-white text-sm rounded-md px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{erro}</span>
          </div>
        ) : null}
        <div className="space-y-4">
          <label className="flex flex-col gap-2 text-sm text-texto">
            <span className="font-medium">E-mail</span>
            <div className="flex items-center border border-borda rounded-md px-4 py-3 bg-fundo">
              <Mail size={16} className="text-texto" />
              <input
                className="flex-1 pl-3 focus:outline-none bg-transparent"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm text-texto">
            <span className="font-medium">Senha</span>
            <div className="flex items-center border border-borda rounded-md bg-fundo px-4 py-3">
              <Lock size={16} className="text-texto" />
              <input
                className="flex-1 pl-3 focus:outline-none bg-transparent"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="text-primaria"
                onClick={() => setMostrarSenha((valor) => !valor)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
        </div>
        <div className="flex justify-end">
          <Link to="/esqueci-senha" className="text-sm text-primaria">
            Esqueceu sua senha?
          </Link>
        </div>
        <BotaoPrimario className="w-full" onClick={entrar} disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </BotaoPrimario>
      </Card>
    </div>
  );
}

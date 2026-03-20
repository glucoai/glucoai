import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { BotaoPrimario, Card } from '@gluco/ui';
import { AlertTriangle, CheckCircle, Lock, ArrowLeft } from 'lucide-react';

export function RedefinirSenhaPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function redefinir() {
    setCarregando(true);
    setErro('');
    setSucesso('');
    if (!token) {
      setErro('Token inválido ou ausente.');
      setCarregando(false);
      return;
    }
    try {
      const resposta = await fetch(`${apiUrl}/autenticacao/redefinir-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha, confirmarSenha }),
      });
      const payload = await resposta.json();
      if (!resposta.ok) {
        setErro(payload?.message ?? 'Não foi possível redefinir a senha.');
        return;
      }
      setSucesso(payload?.message ?? 'Senha redefinida com sucesso.');
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
          <div className="flex justify-center">
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
          </div>
          <p className="text-texto">Defina uma nova senha.</p>
        </div>
        {erro ? (
          <div className="bg-perigo text-white text-sm rounded-md px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{erro}</span>
          </div>
        ) : null}
        {sucesso ? (
          <div className="bg-sucesso text-white text-sm rounded-md px-4 py-3 flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{sucesso}</span>
          </div>
        ) : null}
        <div className="space-y-4">
          <label className="flex flex-col gap-2 text-sm text-texto">
            <span className="font-medium">Nova senha</span>
            <div className="flex items-center border border-borda rounded-md bg-fundo px-4 py-3">
              <Lock size={16} className="text-texto" />
              <input
                className="flex-1 pl-3 focus:outline-none bg-transparent"
                type="password"
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm text-texto">
            <span className="font-medium">Confirmar nova senha</span>
            <div className="flex items-center border border-borda rounded-md bg-fundo px-4 py-3">
              <Lock size={16} className="text-texto" />
              <input
                className="flex-1 pl-3 focus:outline-none bg-transparent"
                type="password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                placeholder="Digite a confirmação da senha"
              />
            </div>
          </label>
        </div>
        <BotaoPrimario className="w-full" onClick={redefinir} disabled={carregando}>
          {carregando ? 'Salvando...' : 'Redefinir senha'}
        </BotaoPrimario>
        <Link
          to="/entrar"
          className="flex items-center justify-center gap-2 text-sm text-primaria"
        >
          <ArrowLeft size={16} />
          Voltar para o login
        </Link>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { BotaoPrimario, Card } from '@gluco/ui';
import { Mail, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

export function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function enviar() {
    setCarregando(true);
    setErro('');
    setSucesso('');
    try {
      const resposta = await fetch(`${apiUrl}/autenticacao/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resposta.ok) {
        const payload = await resposta.json();
        setErro(payload?.message ?? 'Não foi possível enviar o link.');
        return;
      }
      const payload = await resposta.json();
      setSucesso(payload?.message ?? 'Se o e-mail estiver cadastrado, enviaremos um link.');
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
            className="h-10 w-auto mx-auto logo-tema-escuro"
          />
          <img
            src="/logo-gluco-ai-para-fundo-claro.png"
            alt="Gluco IA"
            className="h-10 w-auto mx-auto logo-tema-claro"
          />
          <p className="text-texto">Recupere o acesso à sua conta.</p>
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
        </div>
        <BotaoPrimario className="w-full" onClick={enviar} disabled={carregando}>
          {carregando ? 'Enviando...' : 'Enviar link'}
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

import { Card, CampoTexto, BotaoPrimario, BotaoSecundario } from '@gluco/ui';
import { formatarMoeda } from '@gluco/utils';
import { useMemo, useState } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useCheckoutPixAutomatico } from '../hooks/useCheckoutPixAutomatico';
import type { CheckoutPixAutomaticoForm } from '../types';

function ResultadoWoovi({
  link,
  emv,
  status,
  valor,
  diaGeracao,
  mensagem,
}: {
  link?: string;
  emv?: string;
  status?: string;
  valor?: number;
  diaGeracao?: number;
  mensagem?: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const exibir = Boolean(link || emv || status || valor);
  const valorFormatado = typeof valor === 'number' ? formatarMoeda(valor) : null;
  const copiarEmv = async () => {
    if (!emv) return;
    await navigator.clipboard.writeText(emv);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };
  if (!exibir) return null;
  return (
    <div className="mt-8 border border-borda rounded-xl p-6 bg-superficie/80 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-texto/70">Assinatura Pix Automático</div>
          <div className="text-xl font-display font-semibold text-texto mt-1">
            {valorFormatado ?? 'Valor não informado'}
          </div>
          {diaGeracao ? (
            <div className="text-xs text-texto/60 mt-1">Geração da cobrança: dia {diaGeracao}</div>
          ) : null}
          {status ? <div className="text-xs text-sucesso mt-2">Status: {status}</div> : null}
        </div>
        {link ? (
          <BotaoPrimario onClick={() => window.open(link, '_blank', 'noreferrer')}>
            Abrir página de pagamento
          </BotaoPrimario>
        ) : null}
      </div>
      {mensagem ? <div className="text-sm text-texto/80 mt-4">{mensagem}</div> : null}
      {emv ? (
        <div className="mt-5">
          <div className="text-sm text-texto/80">Pix copia e cola</div>
          <div className="mt-2 border border-borda rounded-md p-3 text-xs text-texto/70 break-all bg-fundo">
            {emv}
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <BotaoSecundario onClick={copiarEmv}>{copiado ? 'Copiado!' : 'Copiar código'}</BotaoSecundario>
            {link ? (
              <a className="text-sm text-primaria self-center" href={link} target="_blank" rel="noreferrer">
                Ver link da assinatura
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type FormularioProps = {
  form: CheckoutPixAutomaticoForm;
  atualizarCampo: (campo: keyof CheckoutPixAutomaticoForm, valor: string) => void;
};

function CamposBasicos({ form, atualizarCampo }: FormularioProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <CampoTexto rotulo="Nome completo" value={form.nome} onChange={(e) => atualizarCampo('nome', e.target.value)} />
      <CampoTexto rotulo="E-mail" type="email" value={form.email} onChange={(e) => atualizarCampo('email', e.target.value)} />
      <CampoTexto rotulo="Telefone" value={form.telefone} onChange={(e) => atualizarCampo('telefone', e.target.value)} />
      <CampoTexto rotulo="CPF" value={form.cpf} onChange={(e) => atualizarCampo('cpf', e.target.value)} />
      <CampoTexto rotulo="Valor (R$)" value={form.valor} onChange={(e) => atualizarCampo('valor', e.target.value)} />
      <CampoTexto rotulo="Comentário" value={form.comentario} onChange={(e) => atualizarCampo('comentario', e.target.value)} />
      <CampoTexto rotulo="Dia de geração" value={form.diaGeracao} onChange={(e) => atualizarCampo('diaGeracao', e.target.value)} />
      <CampoTexto rotulo="Dia de vencimento" value={form.diaVencimento} onChange={(e) => atualizarCampo('diaVencimento', e.target.value)} />
    </div>
  );
}

function CamposEndereco({ form, atualizarCampo }: FormularioProps) {
  return (
    <>
      <div className="mt-6 text-sm font-semibold text-texto">Endereço</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <CampoTexto rotulo="CEP" value={form.cep} onChange={(e) => atualizarCampo('cep', e.target.value)} />
        <CampoTexto rotulo="Rua" value={form.rua} onChange={(e) => atualizarCampo('rua', e.target.value)} />
        <CampoTexto rotulo="Número" value={form.numero} onChange={(e) => atualizarCampo('numero', e.target.value)} />
        <CampoTexto rotulo="Bairro" value={form.bairro} onChange={(e) => atualizarCampo('bairro', e.target.value)} />
        <CampoTexto rotulo="Cidade" value={form.cidade} onChange={(e) => atualizarCampo('cidade', e.target.value)} />
        <CampoTexto rotulo="Estado" value={form.estado} onChange={(e) => atualizarCampo('estado', e.target.value)} />
        <CampoTexto rotulo="Complemento" value={form.complemento} onChange={(e) => atualizarCampo('complemento', e.target.value)} />
      </div>
    </>
  );
}

type AcoesProps = {
  carregando: boolean;
  erro: string;
  sucesso: string;
  enviarCheckout: () => Promise<void>;
  resetarFormulario: () => void;
};

function AcoesCheckout({ carregando, erro, sucesso, enviarCheckout, resetarFormulario }: AcoesProps) {
  return (
    <>
      {erro ? <div className="text-sm text-perigo mt-4">{erro}</div> : null}
      {sucesso ? <div className="text-sm text-sucesso mt-4">{sucesso}</div> : null}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <BotaoPrimario onClick={enviarCheckout} disabled={carregando}>
          {carregando ? 'Criando...' : 'Criar assinatura'}
        </BotaoPrimario>
        <BotaoSecundario onClick={resetarFormulario} disabled={carregando}>
          Limpar
        </BotaoSecundario>
      </div>
    </>
  );
}

function CheckoutPixAutomaticoCard() {
  const token = useAuthStore((state) => state.token);
  const { form, atualizarCampo, enviarCheckout, carregando, erro, sucesso, resultado, resetarFormulario } =
    useCheckoutPixAutomatico(token);
  const status = resultado?.subscription?.status;
  const link = resultado?.subscription?.paymentLinkUrl;
  const emv = resultado?.subscription?.pixRecurring?.emv;
  const valor = resultado?.subscription?.value ?? (form.valor ? Number(form.valor) : undefined);
  const diaGeracao = resultado?.subscription?.dayGenerateCharge ?? (form.diaGeracao ? Number(form.diaGeracao) : undefined);
  const mensagem = useMemo(() => {
    const comentario = form.comentario.trim();
    if (comentario.length > 0) return comentario;
    return 'Confirme a assinatura do Pix Automático no aplicativo do banco.';
  }, [form.comentario]);

  return (
    <Card className="border border-borda bg-fundo/90 backdrop-blur-md">
      <div className="text-lg font-display font-semibold text-texto">Pix Automático (Woovi)</div>
      <div className="text-sm text-texto/80 mt-1">
        Preencha os dados para gerar a assinatura do Pix Automático.
      </div>
      <CamposBasicos form={form} atualizarCampo={atualizarCampo} />
      <CamposEndereco form={form} atualizarCampo={atualizarCampo} />
      <AcoesCheckout
        carregando={carregando}
        erro={erro}
        sucesso={sucesso}
        enviarCheckout={enviarCheckout}
        resetarFormulario={resetarFormulario}
      />

      <ResultadoWoovi
        link={link}
        emv={emv}
        status={status}
        valor={valor}
        diaGeracao={diaGeracao}
        mensagem={mensagem}
      />
    </Card>
  );
}

export { CheckoutPixAutomaticoCard };

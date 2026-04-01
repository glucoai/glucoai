import { useState } from 'react';
import { apiUrl } from '../../../config/api';
import type {
  CheckoutPixAutomaticoForm,
  WooviSubscriptionResponse,
  WooviSubscriptionResponseLista,
} from '../types';

const formularioInicial: CheckoutPixAutomaticoForm = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  valor: '',
  comentario: '',
  diaGeracao: '10',
  diaVencimento: '3',
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  complemento: '',
};

function montarPayload(form: CheckoutPixAutomaticoForm) {
  const enderecoValores = [
    form.cep,
    form.rua,
    form.numero,
    form.bairro,
    form.cidade,
    form.estado,
    form.complemento,
  ].map((valor) => valor.trim());
  const temEndereco = enderecoValores.some((valor) => valor.length > 0);
  return {
    nome: form.nome.trim(),
    email: form.email.trim(),
    telefone: form.telefone.trim(),
    cpf: form.cpf.trim(),
    valor: Number(form.valor),
    comentario: form.comentario.trim() || null,
    diaGeracao: Number(form.diaGeracao),
    diaVencimento: Number(form.diaVencimento),
    endereco: temEndereco
      ? {
          cep: form.cep.trim(),
          rua: form.rua.trim(),
          numero: form.numero.trim(),
          bairro: form.bairro.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          complemento: form.complemento.trim() || null,
        }
      : null,
  };
}

function useCheckoutPixAutomatico(token?: string | null) {
  const [form, setForm] = useState(formularioInicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [resultado, setResultado] = useState<WooviSubscriptionResponse | null>(null);

  const atualizarCampo = (campo: keyof CheckoutPixAutomaticoForm, valor: string) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const limparMensagens = () => {
    setErro('');
    setSucesso('');
  };

  const enviarCheckout = async () => {
    try {
      limparMensagens();
      setCarregando(true);
      const endpoint = token
        ? `${apiUrl}/financeiro/checkout/pix-automatico`
        : `${apiUrl}/financeiro/checkout/pix-automatico-publico`;
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(montarPayload(form)),
      });
      const texto = await resposta.text();
      const contentType = resposta.headers.get('content-type') ?? '';
      let payload:
        | WooviSubscriptionResponse
        | WooviSubscriptionResponseLista
        | { message?: string }
        | null = null;
      if (texto && contentType.includes('application/json')) {
        try {
          payload = JSON.parse(texto) as WooviSubscriptionResponse | { message?: string };
        } catch {
          payload = null;
        }
      }
      if (!resposta.ok) {
        const mensagem =
          (payload && 'message' in payload && payload.message) ||
          (contentType.includes('application/json')
            ? 'Erro ao criar assinatura Pix Automático.'
            : 'Erro ao criar assinatura Pix Automático. Resposta inválida do servidor.');
        throw new Error(mensagem);
      }
      const resultado = Array.isArray(payload) ? payload[0] : payload;
      if (!resultado || !('subscription' in resultado)) {
        throw new Error('Resposta inválida ao criar assinatura Pix Automático.');
      }
      setResultado(resultado);
      setSucesso('Assinatura Pix Automático criada com sucesso.');
      return;
    } catch (error) {
      const mensagemErro = (error as Error).message || 'Erro ao criar assinatura Pix Automático.';
      if (mensagemErro.includes('Unexpected token')) {
        setErro('Erro ao criar assinatura Pix Automático. Resposta inválida do servidor.');
        return;
      }
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  const resetarFormulario = () => {
    setForm(formularioInicial);
    setResultado(null);
    limparMensagens();
  };

  return {
    form,
    resultado,
    carregando,
    erro,
    sucesso,
    atualizarCampo,
    enviarCheckout,
    resetarFormulario,
  };
}

export { useCheckoutPixAutomatico };

import { Link } from 'react-router-dom';
import { BotaoPrimario, BotaoSecundario, Card } from '@gluco/ui';
import { Bot, HeartPulse, LineChart, ShieldCheck } from 'lucide-react';

const beneficios = [
  { titulo: 'Acompanhamento inteligente', descricao: 'IA clínica com mensagens claras e suporte via WhatsApp.', icone: <Bot size={20} /> },
  { titulo: 'Painel em tempo real', descricao: 'KPIs, alertas críticos e evolução glicêmica em uma única visão.', icone: <LineChart size={20} /> },
  { titulo: 'Segurança e controle', descricao: 'Fluxo seguro, perfis de acesso e dados protegidos.', icone: <ShieldCheck size={20} /> },
  { titulo: 'Experiência humanizada', descricao: 'Interface clara e linguagem simples para a equipe.', icone: <HeartPulse size={20} /> },
];

const planos = [
  { nome: 'Essencial', preco: 'R$ 149/mês', descricao: 'Para profissionais autônomos iniciando o acompanhamento.', recursos: ['Até 60 pacientes', 'Alertas básicos', 'Relatórios simples', 'Suporte por e-mail'] },
  { nome: 'Profissional', preco: 'R$ 299/mês', descricao: 'Clínicas em crescimento com necessidade de escala.', recursos: ['Até 250 pacientes', 'Alertas avançados', 'Painel de IA diário', 'Integração WhatsApp'], destaque: true },
  { nome: 'Clínica', preco: 'R$ 549/mês', descricao: 'Times maiores com múltiplos profissionais.', recursos: ['Pacientes ilimitados', 'Relatórios premium', 'Suporte prioritário', 'Treinamento'] },
];

function HeroVenda() {
  return (
    <section className="bg-gradient-to-br from-primaria/10 via-fundo to-sucesso/10">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-14">
        <header className="flex items-center justify-between">
          <img src="/LOGO GLUCO AI.svg" alt="Gluco IA" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <Link to="/entrar" className="text-sm text-texto font-medium">Entrar</Link>
            <BotaoSecundario className="text-sm px-4 py-2">Falar com especialista</BotaoSecundario>
          </div>
        </header>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.3em] text-primaria font-semibold">Plataforma clínica com IA</div>
            <h1 className="text-4xl lg:text-5xl font-display font-semibold text-texto leading-tight">Transforme o acompanhamento da diabetes em uma experiência simples e eficaz.</h1>
            <p className="text-base text-texto leading-relaxed">O Gluco IA conecta equipe clínica e pacientes com dados, alertas e mensagens personalizadas. Tudo em português, com foco em adesão e resultados mensuráveis.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <BotaoPrimario className="px-6 py-3">Solicitar demonstração</BotaoPrimario>
              <BotaoSecundario className="px-6 py-3">Ver planos</BotaoSecundario>
            </div>
            <div className="text-xs text-texto">Planos mockados temporários — valores finais serão publicados no lançamento.</div>
          </div>
          <div className="grid gap-4">
            <Card className="border border-borda bg-fundo/90 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.25em] text-texto">Visão do dia</div>
              <div className="mt-3 text-2xl font-semibold text-texto">92% dentro da meta</div>
              <div className="text-sm text-texto mt-2">Alertas críticos reduzidos com acompanhamento ativo.</div>
            </Card>
            <Card className="border border-borda bg-fundo/90 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.25em] text-texto">Resultados</div>
              <div className="mt-3 text-2xl font-semibold text-texto">Adesão 3x maior</div>
              <div className="text-sm text-texto mt-2">Rotinas simples e mensagens empáticas geram engajamento.</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeneficiosVenda() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-primaria font-semibold">Benefícios</div>
          <h2 className="text-3xl font-display font-semibold text-texto">Design premium para resultados clínicos reais.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((item) => (
            <Card key={item.titulo} className="border border-borda bg-fundo/90 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primaria/10 text-primaria flex items-center justify-center">{item.icone}</div>
              <div className="text-base font-semibold text-texto">{item.titulo}</div>
              <div className="text-sm text-texto leading-relaxed">{item.descricao}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanosCards() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-3">
      {planos.map((plano) => (
        <Card key={plano.nome} className={`border ${plano.destaque ? 'border-primaria shadow-hover' : 'border-borda'} bg-fundo/90 backdrop-blur-md`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-texto">{plano.nome}</div>
              {plano.destaque ? <span className="text-[10px] uppercase tracking-[0.25em] text-primaria font-semibold">Mais escolhido</span> : null}
            </div>
            <div className="text-3xl font-display font-semibold text-texto">{plano.preco}</div>
            <div className="text-sm text-texto">{plano.descricao}</div>
            <ul className="space-y-2 text-sm text-texto">
              {plano.recursos.map((recurso) => (
                <li key={recurso} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sucesso" />
                  <span>{recurso}</span>
                </li>
              ))}
            </ul>
            <BotaoPrimario className="w-full">Quero este plano</BotaoPrimario>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CtaPlano() {
  return (
    <Card className="mt-8 border border-primaria bg-gradient-to-r from-primaria to-primaria-escura text-white">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] text-white/80 font-semibold">Comece agora</div>
          <div className="text-2xl font-display font-semibold">Implantação rápida com suporte dedicado.</div>
          <div className="text-sm text-white/90">Onboarding completo e acompanhamento da equipe Gluco IA.</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <BotaoPrimario className="bg-white text-primaria hover:bg-white/90">Agendar demonstração</BotaoPrimario>
          <BotaoSecundario className="border-white text-white hover:bg-white/10">Falar com especialista</BotaoSecundario>
        </div>
      </div>
    </Card>
  );
}

function PlanosVenda() {
  return (
    <section className="py-16 bg-fundo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-primaria font-semibold">Planos</div>
          <h2 className="text-3xl font-display font-semibold text-texto">Escolha o plano ideal para sua operação.</h2>
          <p className="text-sm text-texto">Valores mockados temporários, sujeitos a ajustes até o lançamento.</p>
        </div>
        <PlanosCards />
        <CtaPlano />
      </div>
    </section>
  );
}

function RodapeVenda() {
  return (
    <footer className="bg-fundo border-t border-borda">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <img src="/LOGO GLUCO AI.svg" alt="Gluco IA" className="h-6 w-auto" />
          <div className="text-sm text-texto">Tecnologia cuidando da sua glicemia.</div>
        </div>
        <div className="text-sm text-texto">CNPJ: 34.326.640/0001-08</div>
      </div>
    </footer>
  );
}

export function VendaPage() {
  return (
    <div className="min-h-screen bg-superficie">
      <HeroVenda />
      <BeneficiosVenda />
      <PlanosVenda />
      <RodapeVenda />
    </div>
  );
}

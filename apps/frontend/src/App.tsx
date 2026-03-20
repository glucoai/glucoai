import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { EsqueciSenhaPage } from './pages/EsqueciSenhaPage';
import { RedefinirSenhaPage } from './pages/RedefinirSenhaPage';
import { PainelPage } from './pages/PainelPage';
import { InicioPage } from './pages/InicioPage';
import { RefeicoesPage } from './pages/RefeicoesPage';
import { PacientesPage } from './features/pacientes';
import { MensagensPage } from './pages/MensagensPage';
import { FinanceiroPage } from './pages/FinanceiroPage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import { VendaPage } from './pages/VendaPage';
import { LayoutDesktop } from './layouts/LayoutDesktop';
import { LayoutMobile } from './layouts/LayoutMobile';
import { useAuthStore } from './stores/useAuthStore';

function RotaProtegida({ children, perfis }: { children: JSX.Element; perfis: string[] }) {
  const usuario = useAuthStore((state) => state.usuario);
  if (!usuario) {
    return <Navigate to="/entrar" replace />;
  }
  if (!perfis.includes(usuario.perfil)) {
    return <Navigate to="/entrar" replace />;
  }
  return children;
}

function RotasComSeo() {
  const { pathname } = useLocation();
  const baseUrl = 'https://glucoia.com';
  const ogImage = `${baseUrl}/gluco-ai-imagem.png`;
  const ogImageAlt = 'Gluco IA — Plataforma clínica com IA';
  const seoPublico: Record<string, { titulo: string; descricao: string; canonical: string }> = {
    '/': {
      titulo: 'Gluco IA — Acompanhamento inteligente para clínicas',
      descricao:
        'Plataforma clínica com IA para acompanhar pacientes com diabetes via WhatsApp, painel e análises inteligentes.',
      canonical: `${baseUrl}/`,
    },
    '/venda': {
      titulo: 'Planos Gluco IA — Plataforma clínica com IA',
      descricao:
        'Conheça os planos do Gluco IA e leve acompanhamento inteligente para sua clínica de diabetes.',
      canonical: `${baseUrl}/venda`,
    },
    '/entrar': {
      titulo: 'Entrar — Gluco IA',
      descricao: 'Acesse sua conta clínica para acompanhar pacientes com diabetes.',
      canonical: `${baseUrl}/entrar`,
    },
  };
  const seo = seoPublico[pathname];
  const mostrarJsonLd = pathname === '/' || pathname === '/venda';
  const jsonLdOrganizacao = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gluco IA',
    url: baseUrl,
    logo: `${baseUrl}/logo-gluco-ai-para-fundo-claro.png`,
    image: ogImage,
  };
  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gluco IA',
    url: baseUrl,
  };

  return (
    <>
      <Helmet>
        <title>{seo?.titulo ?? 'Gluco IA'}</title>
        {seo ? <meta name="description" content={seo.descricao} /> : null}
        {seo ? <link rel="canonical" href={seo.canonical} /> : null}
        <meta name="robots" content={seo ? 'index, follow' : 'noindex, nofollow'} />
        {seo ? (
          <>
            <meta property="og:title" content={seo.titulo} />
            <meta property="og:description" content={seo.descricao} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={seo.canonical} />
            <meta property="og:site_name" content="Gluco IA" />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={ogImageAlt} />
            <meta property="og:locale" content="pt_BR" />
            <meta name="theme-color" content="#08090F" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.titulo} />
            <meta name="twitter:description" content={seo.descricao} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={ogImageAlt} />
          </>
        ) : null}
        {mostrarJsonLd ? (
          <>
            <script type="application/ld+json">{JSON.stringify(jsonLdOrganizacao)}</script>
            <script type="application/ld+json">{JSON.stringify(jsonLdWebsite)}</script>
          </>
        ) : null}
      </Helmet>
      <Routes>
        <Route path="/" element={<VendaPage />} />
        <Route path="/venda" element={<VendaPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        <Route
          path="/painel"
          element={
            <RotaProtegida perfis={['ADMINISTRADOR', 'PROFISSIONAL']}>
              <LayoutDesktop>
                <PainelPage />
              </LayoutDesktop>
            </RotaProtegida>
          }
        />
        <Route
          path="/pacientes"
          element={
            <RotaProtegida perfis={['ADMINISTRADOR', 'PROFISSIONAL']}>
              <LayoutDesktop>
                <PacientesPage />
              </LayoutDesktop>
            </RotaProtegida>
          }
        />
        <Route
          path="/mensagens"
          element={
            <RotaProtegida perfis={['ADMINISTRADOR', 'PROFISSIONAL']}>
              <LayoutDesktop>
                <MensagensPage />
              </LayoutDesktop>
            </RotaProtegida>
          }
        />
        <Route
          path="/financeiro"
          element={
            <RotaProtegida perfis={['ADMINISTRADOR', 'PROFISSIONAL']}>
              <LayoutDesktop>
                <FinanceiroPage />
              </LayoutDesktop>
            </RotaProtegida>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <RotaProtegida perfis={['ADMINISTRADOR', 'PROFISSIONAL']}>
              <LayoutDesktop>
                <ConfiguracoesPage />
              </LayoutDesktop>
            </RotaProtegida>
          }
        />
        <Route
          path="/inicio"
          element={
            <RotaProtegida perfis={['PACIENTE']}>
              <LayoutMobile>
                <InicioPage />
              </LayoutMobile>
            </RotaProtegida>
          }
        />
        <Route
          path="/refeicoes"
          element={
            <RotaProtegida perfis={['PACIENTE']}>
              <LayoutMobile>
                <RefeicoesPage />
              </LayoutMobile>
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  useEffect(() => {
    const temaSalvo = localStorage.getItem('gluco-tema');
    if (temaSalvo === 'dark' || temaSalvo === 'light') {
      document.documentElement.setAttribute('data-theme', temaSalvo);
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <BrowserRouter>
      <RotasComSeo />
    </BrowserRouter>
  );
}

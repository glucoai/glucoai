import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarraNavegacaoInferior } from '@gluco/ui';
import { Home, Droplet, Utensils, BarChart3, User } from 'lucide-react';

type Props = {
  children: ReactNode;
};

export function LayoutMobile({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const rotaAtual = location.pathname;

  const itens = [
    { id: 'inicio', rotulo: 'Início', href: '/inicio', icone: <Home size={18} /> },
    { id: 'glicemia', rotulo: 'Glicemia', href: '/glicemia', icone: <Droplet size={18} /> },
    { id: 'refeicoes', rotulo: 'Refeições', href: '/refeicoes', icone: <Utensils size={18} /> },
    { id: 'historico', rotulo: 'Histórico', href: '/historico', icone: <BarChart3 size={18} /> },
    { id: 'perfil', rotulo: 'Perfil', href: '/perfil', icone: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-superficie pb-16">
      <main className="p-4">{children}</main>
      <BarraNavegacaoInferior
        itens={itens.map((item) => ({
          ...item,
          ativo: rotaAtual.startsWith(item.href),
          aoClicar: item.href === '/inicio' || item.href === '/refeicoes' ? () => navigate(item.href) : undefined,
        }))}
      />
    </div>
  );
}

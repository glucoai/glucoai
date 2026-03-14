import type { ReactNode } from 'react';

type Item = {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  ativo?: boolean;
  aoClicar?: () => void;
};

type Props = {
  itens: Item[];
};

export function BarraNavegacaoInferior({ itens }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-fundo border-t border-borda h-16">
      <ul className="h-full flex items-center justify-around text-xs">
        {itens.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.aoClicar}
              className={`flex flex-col items-center gap-1 ${
                item.ativo ? 'text-primaria font-medium' : 'text-texto'
              }`}
            >
              {item.icone}
              <span>{item.rotulo}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

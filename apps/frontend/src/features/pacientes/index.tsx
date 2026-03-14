import { useState } from 'react';
import { BotaoPrimario, Card } from '@gluco/ui';
import { Search, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePacientes } from './hooks/usePacientes';
import type { TipoDiabetes } from './types';
import { PacientesTable } from './components/PacientesTable';

type Filtro = {
  rotulo: string;
  valor?: TipoDiabetes;
};

const filtros: Filtro[] = [
  { rotulo: 'Todos' },
  { rotulo: 'Tipo 1', valor: 'TIPO_1' },
  { rotulo: 'Tipo 2', valor: 'TIPO_2' },
  { rotulo: 'Gestacional', valor: 'GESTACIONAL' },
  { rotulo: 'Pré', valor: 'PRE' },
];

export function PacientesPage() {
  const token = useAuthStore((state) => state.token);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState<TipoDiabetes | undefined>(undefined);
  const [pagina, setPagina] = useState(1);
  const { dados, carregando, erro } = usePacientes({ busca, tipo, pagina, token });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xl font-display font-semibold text-texto">Pacientes</div>
          <div className="text-sm text-texto">Gerencie a base de pacientes da clínica.</div>
        </div>
        <BotaoPrimario className="flex items-center gap-2">
          <UserPlus size={18} />
          Novo paciente
        </BotaoPrimario>
      </div>

      <Card className="border border-borda bg-fundo/90 backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 bg-superficie px-4 py-2 rounded-full border border-borda w-full lg:w-80">
            <Search size={16} className="text-texto" />
            <input
              className="flex-1 bg-transparent text-sm text-texto focus:outline-none"
              placeholder="Buscar por nome ou telefone"
              value={busca}
              onChange={(event) => {
                setPagina(1);
                setBusca(event.target.value);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro.rotulo}
                type="button"
                onClick={() => {
                  setPagina(1);
                  setTipo(filtro.valor);
                }}
                className={`px-3 py-1 rounded-full text-xs border ${
                  tipo === filtro.valor ? 'bg-primaria text-white border-primaria' : 'border-borda'
                }`}
              >
                {filtro.rotulo}
              </button>
            ))}
          </div>
        </div>

        {carregando ? (
          <div className="text-sm text-texto">Carregando pacientes...</div>
        ) : erro ? (
          <div className="text-sm text-perigo">{erro}</div>
        ) : dados?.dados?.length ? (
          <PacientesTable pacientes={dados.dados} />
        ) : (
          <div className="text-sm text-texto">Nenhum paciente encontrado.</div>
        )}
      </Card>
    </div>
  );
}

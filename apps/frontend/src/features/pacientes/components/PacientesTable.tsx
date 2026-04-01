import { BadgeStatusGlicemia, BadgeTipoDiabetes } from '@gluco/ui';
import type { PacienteItem } from '../types';
import { SparklineMini } from './SparklineMini';

type StatusGlicemia = 'NORMAL' | 'ELEVADA' | 'CRITICA';

type Props = {
  pacientes: PacienteItem[];
};

function classificarGlicemia(valor: number): StatusGlicemia {
  if (valor < 70) {
    return 'CRITICA';
  }
  if (valor <= 140) {
    return 'NORMAL';
  }
  if (valor <= 180) {
    return 'ELEVADA';
  }
  return 'CRITICA';
}

function obterValoresSparkline(paciente: PacienteItem) {
  const valores = paciente.glicemias?.map((item) => item.valor).slice(0, 7).reverse();
  return valores?.length ? valores : [110, 120, 115, 130, 118, 125, 112];
}

function formatarNivelScore(nivel?: string | null) {
  if (!nivel) return '';
  if (nivel === 'BAIXO') return 'Baixo';
  if (nivel === 'MODERADO') return 'Moderado';
  if (nivel === 'ALTO') return 'Alto';
  if (nivel === 'CRITICO') return 'Crítico';
  return nivel;
}

function LinhaPaciente({ paciente }: { paciente: PacienteItem }) {
  const ultima = paciente.glicemias?.[0];
  const valores = obterValoresSparkline(paciente);
  const scoreTexto =
    paciente.scoreTotal != null && paciente.scoreNivel
      ? `${paciente.scoreTotal} · ${formatarNivelScore(paciente.scoreNivel)}`
      : '-';
  return (
    <tr className="text-texto">
      <td className="py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primaria/10 text-primaria flex items-center justify-center">
          {paciente.nome.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{paciente.nome}</div>
          <div className="text-xs text-texto">
            Meta {paciente.metaGlicemicaMin ?? 70}-{paciente.metaGlicemicaMax ?? 140}
          </div>
        </div>
      </td>
      <td className="py-4">{paciente.telefone}</td>
      <td className="py-4">
        <BadgeTipoDiabetes tipo={paciente.tipoDiabetes} />
      </td>
      <td className="py-4">{ultima?.valor ? `${ultima.valor} mg/dL` : '-'}</td>
      <td className="py-4">
        {ultima?.valor ? (
          <BadgeStatusGlicemia status={classificarGlicemia(ultima.valor)} />
        ) : (
          '-'
        )}
      </td>
      <td className="py-4">{scoreTexto}</td>
      <td className="py-4">
        <SparklineMini valores={valores} />
      </td>
    </tr>
  );
}

export function PacientesTable({ pacientes }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.2em] text-texto">
          <tr>
            <th className="py-3">Paciente</th>
            <th className="py-3">Telefone</th>
            <th className="py-3">Tipo</th>
            <th className="py-3">Glicemia</th>
            <th className="py-3">Status</th>
            <th className="py-3">Escore</th>
            <th className="py-3">Tendência</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borda">
          {pacientes.map((paciente) => (
            <LinhaPaciente key={paciente.id} paciente={paciente} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

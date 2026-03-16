import { prisma } from '../../infra/prisma.js';
import type { PainelAlerta, PainelEstatisticas, PainelSerieGlicemia } from './types.js';

async function obterEstatisticasPainel(clinicaId: string): Promise<PainelEstatisticas> {
  const agora = new Date();
  const inicio24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
  const inicio7d = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [pacientesTotal, glicemias24h, alertasCriticos24h, pacientesComGlicemia7d] =
    await Promise.all([
      prisma.paciente.count({ where: { clinicaId, ativo: true } }),
      prisma.glicemia.count({
        where: {
          registradoEm: { gte: inicio24h },
          paciente: { clinicaId, ativo: true },
        },
      }),
      prisma.glicemia.count({
        where: {
          registradoEm: { gte: inicio24h },
          OR: [{ valor: { lt: 70 } }, { valor: { gt: 180 } }],
          paciente: { clinicaId, ativo: true },
        },
      }),
      prisma.glicemia.findMany({
        where: {
          registradoEm: { gte: inicio7d },
          paciente: { clinicaId, ativo: true },
        },
        distinct: ['pacienteId'],
        select: { pacienteId: true },
      }),
    ]);

  const adesaoPercentual7d =
    pacientesTotal > 0 ? Math.round((pacientesComGlicemia7d.length / pacientesTotal) * 100) : 0;

  return {
    pacientesTotal,
    alertasCriticos24h,
    glicemias24h,
    adesaoPercentual7d,
  };
}

export { obterEstatisticasPainel };

async function obterAlertasCriticos(clinicaId: string): Promise<PainelAlerta[]> {
  const agora = new Date();
  const inicio24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

  return prisma.glicemia.findMany({
    where: {
      registradoEm: { gte: inicio24h },
      OR: [{ valor: { lt: 70 } }, { valor: { gt: 180 } }],
      paciente: { clinicaId, ativo: true },
    },
    orderBy: { registradoEm: 'desc' },
    take: 50,
    select: {
      id: true,
      valor: true,
      unidade: true,
      contexto: true,
      registradoEm: true,
      paciente: {
        select: {
          id: true,
          nome: true,
          telefone: true,
        },
      },
    },
  });
}

export { obterAlertasCriticos };

async function obterSerieGlicemia30Dias(clinicaId: string): Promise<PainelSerieGlicemia[]> {
  const agora = new Date();
  const inicio30d = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

  const registros = await prisma.glicemia.findMany({
    where: {
      registradoEm: { gte: inicio30d },
      paciente: { clinicaId, ativo: true },
    },
    select: {
      valor: true,
      registradoEm: true,
    },
    orderBy: { registradoEm: 'asc' },
  });

  const porDia = new Map<string, { total: number; soma: number; minimo: number; maximo: number }>();
  registros.forEach((registro) => {
    const data = registro.registradoEm.toISOString().slice(0, 10);
    const atual = porDia.get(data);
    if (!atual) {
      porDia.set(data, {
        total: 1,
        soma: registro.valor,
        minimo: registro.valor,
        maximo: registro.valor,
      });
      return;
    }
    atual.total += 1;
    atual.soma += registro.valor;
    atual.minimo = Math.min(atual.minimo, registro.valor);
    atual.maximo = Math.max(atual.maximo, registro.valor);
  });

  return Array.from(porDia.entries())
    .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
    .map(([data, valores]) => ({
      data,
      total: valores.total,
      minimo: Number(valores.minimo.toFixed(1)),
      maximo: Number(valores.maximo.toFixed(1)),
      media: Number((valores.soma / valores.total).toFixed(1)),
    }));
}

export { obterSerieGlicemia30Dias };

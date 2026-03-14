import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

type TipoDiabetes = 'TIPO_1' | 'TIPO_2' | 'GESTACIONAL';
type UnidadeGlicemia = 'MG_DL' | 'MMOL_L';
type ContextoGlicemia = 'JEJUM' | 'APOS_CAFE' | 'APOS_ALMOCO' | 'APOS_JANTA' | 'DORMIR';
type OrigemRegistro = 'WHATSAPP' | 'DASHBOARD' | 'API';
type PacienteCriado = { id: string };

const prisma = new PrismaClient();

const contextos: ContextoGlicemia[] = ['JEJUM', 'APOS_CAFE', 'APOS_ALMOCO', 'APOS_JANTA', 'DORMIR'];

function gerarDataDiasAtras(dias: number) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data;
}

async function garantirAdmin(clinicaId: string, senhaHash: string) {
  const existente = await prisma.usuario.findFirst({
    where: { clinicaId, email: 'admin@glucoia.com' },
    select: { id: true },
  });

  if (existente) {
    await prisma.usuario.update({
      where: { id: existente.id },
      data: { senhaHash, nome: 'Administrador', perfil: 'ADMINISTRADOR', ativo: true },
    });
    return;
  }

  await prisma.usuario.create({
    data: {
      clinicaId,
      nome: 'Administrador',
      email: 'admin@glucoia.com',
      senhaHash,
      perfil: 'ADMINISTRADOR',
      ativo: true,
    },
  });
}

async function criarClinica() {
  const senhaHash = await argon2.hash('Admin@123');
  const clinica = await prisma.clinica.findFirst({
    where: { slug: 'clinica-demo-gluco-ia' },
    select: { id: true },
  });

  if (clinica) {
    await garantirAdmin(clinica.id, senhaHash);
    return clinica;
  }

  const criada = await prisma.clinica.create({
    data: {
      nome: 'Clínica Demo Gluco IA',
      slug: 'clinica-demo-gluco-ia',
      plano: 'demo',
    },
  });

  await garantirAdmin(criada.id, senhaHash);
  return criada;
}

async function criarPacientes(clinicaId: string): Promise<PacienteCriado[]> {
  const pacientes: Array<{ nome: string; telefone: string; tipoDiabetes: TipoDiabetes }> = [
    { nome: 'Ana Souza', telefone: '11999990001', tipoDiabetes: 'TIPO_1' },
    { nome: 'Bruno Lima', telefone: '11999990002', tipoDiabetes: 'TIPO_2' },
    { nome: 'Carla Mendes', telefone: '11999990003', tipoDiabetes: 'GESTACIONAL' },
  ];

  const criados = await Promise.all(
    pacientes.map((paciente) =>
      prisma.paciente.upsert({
        where: {
          clinicaId_telefone: {
            clinicaId,
            telefone: paciente.telefone,
          },
        },
        update: {
          nome: paciente.nome,
          tipoDiabetes: paciente.tipoDiabetes,
          cidade: 'São Paulo',
          pais: 'Brasil',
          metaGlicemicaMin: 70,
          metaGlicemicaMax: 140,
          ativo: true,
        },
        create: {
          clinicaId,
          nome: paciente.nome,
          telefone: paciente.telefone,
          tipoDiabetes: paciente.tipoDiabetes,
          cidade: 'São Paulo',
          pais: 'Brasil',
          metaGlicemicaMin: 70,
          metaGlicemicaMax: 140,
        },
      }),
    ),
  );

  return criados.map(({ id }) => ({ id }));
}

async function criarGlicemias(pacienteId: string) {
  const registros: Array<{
    pacienteId: string;
    valor: number;
    unidade: UnidadeGlicemia;
    contexto: ContextoGlicemia;
    origem: OrigemRegistro;
    registradoEm: Date;
  }> = Array.from({ length: 30 }).map((_, indice) => {
    const valor = 80 + Math.floor(Math.random() * 160);
    const contexto = contextos[indice % contextos.length] ?? 'JEJUM';
    return {
      pacienteId,
      valor,
      unidade: 'MG_DL',
      contexto,
      origem: 'DASHBOARD',
      registradoEm: gerarDataDiasAtras(29 - indice),
    };
  });

  return prisma.glicemia.createMany({ data: registros });
}

async function main() {
  const clinica = await criarClinica();
  const pacientes = await criarPacientes(clinica.id);
  await Promise.all(pacientes.map((paciente) => criarGlicemias(paciente.id)));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (erro) => {
    await prisma.$disconnect();
    throw erro;
  });

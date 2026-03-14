-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMINISTRADOR', 'PROFISSIONAL');

-- CreateEnum
CREATE TYPE "TipoDiabetes" AS ENUM ('TIPO_1', 'TIPO_2', 'GESTACIONAL', 'PRE');

-- CreateEnum
CREATE TYPE "UnidadeGlicemia" AS ENUM ('MG_DL', 'MMOL_L');

-- CreateEnum
CREATE TYPE "ContextoGlicemia" AS ENUM ('JEJUM', 'APOS_CAFE', 'APOS_ALMOCO', 'APOS_JANTA', 'DORMIR', 'OUTRO');

-- CreateEnum
CREATE TYPE "OrigemRegistro" AS ENUM ('WHATSAPP', 'DASHBOARD', 'API');

-- CreateEnum
CREATE TYPE "RemetenteMensagem" AS ENUM ('PACIENTE', 'SISTEMA', 'IA', 'PROFISSIONAL');

-- CreateEnum
CREATE TYPE "TipoMensagem" AS ENUM ('TEXTO', 'IMAGEM', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVA', 'INADIMPLENTE', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PlanoAssinatura" AS ENUM ('INICIAL', 'PROFISSIONAL', 'CLINICA');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PAGO', 'PENDENTE', 'FALHOU');

-- CreateEnum
CREATE TYPE "GatewayPagamento" AS ENUM ('STRIPE', 'MERCADO_PAGO');

-- CreateTable
CREATE TABLE "Clinica" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plano" TEXT NOT NULL,
    "logotipo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "genero" TEXT,
    "cidade" TEXT,
    "pais" TEXT,
    "tipoDiabetes" "TipoDiabetes" NOT NULL,
    "anosdiagnostico" INTEGER,
    "medicamentos" TEXT,
    "metaGlicemicaMin" INTEGER,
    "metaGlicemicaMax" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Glicemia" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "unidade" "UnidadeGlicemia" NOT NULL,
    "contexto" "ContextoGlicemia" NOT NULL,
    "origem" "OrigemRegistro" NOT NULL,
    "notas" TEXT,
    "analiseIA" TEXT,
    "registradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Glicemia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refeicao" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "urlImagem" TEXT NOT NULL,
    "analise" JSONB,
    "alimentos" TEXT[],
    "calorias" INTEGER,
    "carboidratos" INTEGER,
    "indiceGlicemico" INTEGER,
    "cargaGlicemica" INTEGER,
    "recomendacaoIA" TEXT,
    "origem" "OrigemRegistro" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refeicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "remetente" "RemetenteMensagem" NOT NULL,
    "tipo" "TipoMensagem" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "plano" "PlanoAssinatura" NOT NULL,
    "status" "StatusAssinatura" NOT NULL,
    "fimPeriodoAtual" TIMESTAMP(3),
    "stripeAssinaturaId" TEXT,
    "cancelarNoFim" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL,
    "assinaturaId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "status" "StatusPagamento" NOT NULL,
    "gateway" "GatewayPagamento" NOT NULL,
    "gatewayId" TEXT,
    "urlFatura" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinica_slug_key" ON "Clinica"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_clinicaId_telefone_key" ON "Paciente"("clinicaId", "telefone");

-- CreateIndex
CREATE INDEX "Glicemia_pacienteId_registradoEm_idx" ON "Glicemia"("pacienteId", "registradoEm");

-- CreateIndex
CREATE INDEX "Mensagem_pacienteId_criadoEm_idx" ON "Mensagem"("pacienteId", "criadoEm");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glicemia" ADD CONSTRAINT "Glicemia_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refeicao" ADD CONSTRAINT "Refeicao_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_assinaturaId_fkey" FOREIGN KEY ("assinaturaId") REFERENCES "Assinatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

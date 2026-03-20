-- AlterTable
ALTER TABLE "Paciente"
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "idade" INTEGER,
ADD COLUMN IF NOT EXISTS "alturaCm" INTEGER,
ADD COLUMN IF NOT EXISTS "pesoKg" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "ultimaGlicemia" INTEGER,
ADD COLUMN IF NOT EXISTS "sintomasComplicacoes" BOOLEAN,
ADD COLUMN IF NOT EXISTS "termosAceitos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "onboardingStatus" TEXT,
ADD COLUMN IF NOT EXISTS "onboardingEtapa" TEXT,
ADD COLUMN IF NOT EXISTS "onboardingDados" JSONB,
ADD COLUMN IF NOT EXISTS "riscoEscala" TEXT,
ADD COLUMN IF NOT EXISTS "macrosDiarios" JSONB;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ConfiguracaoWhatsapp" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "idNumero" TEXT NOT NULL,
    "numeroExibicao" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "tokenVerificacao" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracaoWhatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ConfiguracaoWhatsapp_clinicaId_idNumero_key" ON "ConfiguracaoWhatsapp"("clinicaId", "idNumero");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ConfiguracaoWhatsapp_clinicaId_criadoEm_idx" ON "ConfiguracaoWhatsapp"("clinicaId", "criadoEm");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ConfiguracaoWhatsapp"
  ADD CONSTRAINT "ConfiguracaoWhatsapp_clinicaId_fkey"
  FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

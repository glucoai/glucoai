-- AlterTable
ALTER TABLE "Paciente"
ADD COLUMN IF NOT EXISTS "semGlicosimetro" BOOLEAN NOT NULL DEFAULT false;

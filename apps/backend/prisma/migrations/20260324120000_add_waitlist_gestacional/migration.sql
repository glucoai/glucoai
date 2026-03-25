-- AlterTable
ALTER TABLE "Paciente"
ADD COLUMN IF NOT EXISTS "waitlistGestacional" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('confirmado', 'pendente', 'cancelado', 'em espera', 'a caminho', 'atrasado');

-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('primeira consulta', 'retorno', 'exame', 'urgência');

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" SERIAL NOT NULL,
    "nome_paciente" TEXT NOT NULL,
    "data_agendamento" TIMESTAMPTZ NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'pendente',
    "tipo" "TipoAgendamento" NOT NULL DEFAULT 'primeira consulta',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

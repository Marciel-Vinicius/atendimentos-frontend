/*
  Warnings:

  - You are about to drop the `Chamado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chamado";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "atendente" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "loja" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "ocorrencia" TEXT NOT NULL
);

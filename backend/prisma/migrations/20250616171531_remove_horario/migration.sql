/*
  Warnings:

  - You are about to drop the column `horario` on the `Atendimento` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Atendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "atendente" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "loja" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "ocorrencia" TEXT NOT NULL
);
INSERT INTO "new_Atendimento" ("atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia") SELECT "atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia" FROM "Atendimento";
DROP TABLE "Atendimento";
ALTER TABLE "new_Atendimento" RENAME TO "Atendimento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

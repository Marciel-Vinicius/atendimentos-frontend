/*
  Warnings:

  - You are about to drop the `CodigoVerificacao` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `usuarioId` on table `Atendimento` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clerkId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CodigoVerificacao";
PRAGMA foreign_keys=on;

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
    "ocorrencia" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Atendimento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Atendimento" ("atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia", "usuarioId") SELECT "atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia", "usuarioId" FROM "Atendimento";
DROP TABLE "Atendimento";
ALTER TABLE "new_Atendimento" RENAME TO "Atendimento";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);
INSERT INTO "new_Usuario" ("email", "id", "nome", "tipo") SELECT "email", "id", "nome", "tipo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_clerkId_key" ON "Usuario"("clerkId");
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

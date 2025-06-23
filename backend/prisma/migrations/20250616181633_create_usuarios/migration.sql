-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

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
    "usuarioId" INTEGER,
    CONSTRAINT "Atendimento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Atendimento" ("atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia") SELECT "atendente", "contato", "data", "horaFim", "horaInicio", "id", "loja", "ocorrencia" FROM "Atendimento";
DROP TABLE "Atendimento";
ALTER TABLE "new_Atendimento" RENAME TO "Atendimento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

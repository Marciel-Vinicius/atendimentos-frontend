-- CreateTable
CREATE TABLE "Chamado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "atendente" TEXT NOT NULL,
    "dia" DATETIME NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "loja" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "ocorrencia" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

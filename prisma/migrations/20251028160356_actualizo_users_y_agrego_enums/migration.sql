/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioAntiguo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Usuario_numero_documento_key";

-- DropIndex
DROP INDEX "UsuarioAntiguo_numero_documento_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Usuario";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UsuarioAntiguo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentNumber" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'nationalId',
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthDate" DATETIME,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "address" TEXT,
    "cellphone" TEXT,
    "whatsapp" BOOLEAN DEFAULT false,
    "wants_to_buy" BOOLEAN DEFAULT false,
    "has_differences" BOOLEAN DEFAULT false,
    "differences" TEXT,
    "origin" TEXT,
    "documentFrontImage" TEXT,
    "documentBackImage" TEXT,
    "status" TEXT DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users_original" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentNumber" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'nationalId',
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthDate" DATETIME,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "address" TEXT,
    "cellphone" TEXT,
    "whatsapp" BOOLEAN DEFAULT false,
    "wants_to_buy" BOOLEAN DEFAULT false,
    "has_differences" BOOLEAN DEFAULT false,
    "differences" TEXT,
    "origin" TEXT,
    "documentFrontImage" TEXT,
    "documentBackImage" TEXT,
    "status" TEXT DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_afectado_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha_de_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Historial_usuario_afectado_id_fkey" FOREIGN KEY ("usuario_afectado_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Historial" ("fecha_de_creacion", "id", "motivo", "titulo", "usuario_afectado_id") SELECT "fecha_de_creacion", "id", "motivo", "titulo", "usuario_afectado_id" FROM "Historial";
DROP TABLE "Historial";
ALTER TABLE "new_Historial" RENAME TO "Historial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Users_documentNumber_key" ON "Users"("documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_original_documentNumber_key" ON "users_original"("documentNumber");

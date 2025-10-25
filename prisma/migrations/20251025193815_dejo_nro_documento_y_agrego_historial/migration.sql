/*
  Warnings:

  - You are about to drop the column `numero_id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to alter the column `numero_documento` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `numero_id` on the `UsuarioAntiguo` table. All the data in the column will be lost.
  - You are about to alter the column `numero_documento` on the `UsuarioAntiguo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "Historial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha_de_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_de_nacimiento" DATETIME NOT NULL,
    "numero_documento" INTEGER NOT NULL,
    "domicilio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'NONE'
);
INSERT INTO "new_Usuario" ("apellido", "celular", "domicilio", "email", "estado", "fecha_de_nacimiento", "id", "nombre", "numero_documento") SELECT "apellido", "celular", "domicilio", "email", "estado", "fecha_de_nacimiento", "id", "nombre", "numero_documento" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_numero_documento_key" ON "Usuario"("numero_documento");
CREATE TABLE "new_UsuarioAntiguo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_de_nacimiento" DATETIME NOT NULL,
    "numero_documento" INTEGER NOT NULL,
    "domicilio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'NONE'
);
INSERT INTO "new_UsuarioAntiguo" ("apellido", "celular", "domicilio", "email", "estado", "fecha_de_nacimiento", "id", "nombre", "numero_documento") SELECT "apellido", "celular", "domicilio", "email", "estado", "fecha_de_nacimiento", "id", "nombre", "numero_documento" FROM "UsuarioAntiguo";
DROP TABLE "UsuarioAntiguo";
ALTER TABLE "new_UsuarioAntiguo" RENAME TO "UsuarioAntiguo";
CREATE UNIQUE INDEX "UsuarioAntiguo_numero_documento_key" ON "UsuarioAntiguo"("numero_documento");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

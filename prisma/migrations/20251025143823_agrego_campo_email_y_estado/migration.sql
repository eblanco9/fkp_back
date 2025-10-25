/*
  Warnings:

  - Added the required column `email` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_de_nacimiento" DATETIME NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'NONE'
);
INSERT INTO "new_Usuario" ("apellido", "celular", "domicilio", "fecha_de_nacimiento", "id", "nombre", "numero_documento") SELECT "apellido", "celular", "domicilio", "fecha_de_nacimiento", "id", "nombre", "numero_documento" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

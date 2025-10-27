/*
  Warnings:

  - Added the required column `usuario_afectado_id` to the `Historial` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_afectado_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha_de_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Historial_usuario_afectado_id_fkey" FOREIGN KEY ("usuario_afectado_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Historial" ("fecha_de_creacion", "id", "motivo", "titulo") SELECT "fecha_de_creacion", "id", "motivo", "titulo" FROM "Historial";
DROP TABLE "Historial";
ALTER TABLE "new_Historial" RENAME TO "Historial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

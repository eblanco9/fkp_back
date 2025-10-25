-- CreateTable
CREATE TABLE "UsuarioAntiguo" (
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

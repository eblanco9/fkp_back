import { z } from "zod";
import { Estado } from "../../generated/prisma/index.js";

export const obtenerUsuarioAntiguoSchema = {
  params: z.object({
    id_usuario: z
      .string()
      .refine((id) => !isNaN(id), {
        message: (obj) =>
          `El param id_usuario: ${obj?.input} debe ser un string numérico`,
      }),
  }),
};

export const obtenerUsuarioNuevoSchema = {
  params: z.object({
    id_usuario: z
      .string()
      .refine((id) => !isNaN(id), {
        message: (obj) =>
          `El param id_usuario: ${obj?.input} debe ser un string numérico`,
      }),
  }),
};

export const obtenerUsuariosSchema = {
  // { page = 1, limit = 10, estado }
  query: z.object({
    page: z
      .string()
      .optional()
      .refine((id) => id === undefined || !isNaN(id), {
        message: (obj) =>
          `La query page: ${obj?.input} debe ser un string numérico`,
      })
      .transform((id) => (id !== undefined ? parseInt(id) : undefined)),

    limit: z
      .string()
      .optional()
      .refine((id) => id === undefined || !isNaN(id), {
        message: (obj) =>
          `La query limit: ${obj?.input} debe ser un string numérico`,
      })
      .transform((id) => (id !== undefined ? parseInt(id) : undefined)),

    estado: z
      // .string()
      .enum(Estado, { message: `La query estado debe ser un estado valido: ${Object.values(Estado).join(", ")}` })
      .optional()
      // .refine(val => val === undefined || ["APPROVE", "PENDING", "REJECT"].includes(val), {

      //   message: (obj) =>
      //     `La query estado: ${obj?.input} no es un estado valido`,
      // })
      
  })
};

export const aprobarUsuarioSchema = {
  params: z.object({
    id_usuario: z
      .string()
      .refine((id) => !isNaN(id), {
        message: (obj) =>
          `El param id_usuario: ${obj?.input} debe ser un string numérico`,
      }),
  }),
};

export const rechazarUsuarioSchema = {
  params: z.object({
    id_usuario: z
      .string()
      .refine((id) => !isNaN(id), {
        message: (obj) =>
          `El param id_usuario: ${obj?.input} debe ser un string numérico`,
      })
      .transform((id) => parseInt(id)),
  }),
  body: z.object({
    motivo: z.string({ error: "El motivo es requerido" }),
  }),
};

export const crearUsuarioSchema = {
  body: z.object({

    nombre: z.string({ error: "El nombre es requerido" }),
    apellido: z.string({ error: "El apellido es requerido" }),
    fecha_de_nacimiento: z
      .string({ error: "La fecha de nacimiento es requerida con formato AAAA-MM-DD" })
      .refine((val) => {
        const fecha = new Date(val);
        return !isNaN(fecha.getTime()); // verifica que sea una fecha válida
      }, {
        message: "Fecha de nacimiento en formato invalido",
      })
      .refine((val) => {
        const fecha = new Date(val);
        if(isNaN(fecha.getTime())) return true // si es fecha invalida, ya mostrara el mensaje anterior
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mesDiff = hoy.getMonth() - fecha.getMonth();
        const diaDiff = hoy.getDate() - fecha.getDate();
        if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) edad--;
        return edad >= 18;
      }, {
        message: "El usuario debe ser mayor de 18 años",
      }),
    numero_documento: z
      .string({ error: "El numero_documento es requerido" })
      .refine((id) => !isNaN(id), {
        message: (obj) =>
          `El numero_documento: ${obj?.input} debe ser un string numérico`,
      }),
    domicilio: z.string({ error: "El domicilio es requerido" }),
    email: z.email({ error: "El email es requerido" }),
    celular: z.string({ error: "El celular es requerido" }),
    whatsapp: z
      .refine((w) => ["true", "false"].includes(w), {
        message: (obj) =>
          `El whatsapp: ${obj?.input} debe ser un string booleano`,
      })
      .transform((val) => val === "true"),
    wants_to_buy: z
      .enum(["true", "false"], { error: `El wants_to_buy debe ser true o false` })
      .transform((val) => val === "true"),
  }),
  files: z.object({
    dni_frente: z
      .array(z.any(), { error: "Debe enviar una foto de dni frente" })
      .min(1, 'Debe enviar una foto de dni frente')
      .max(1, 'Solo se permite una foto de dni frente')
      .refine(
        (arr) => arr.every(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.mimetype)),
        { message: 'Formato de dni frente no válido' } // aquí ya sabes que es foto_perfil
      )
      .refine(
        (arr) => arr.every(f => f.size <= 5 * 1024 * 1024),
        { message: 'dni frente no puede superar 5MB' } // aquí ya sabes que es documento_identidad
      ),
    dni_dorso: z
      .array(z.any(),{ error: "Debe enviar una foto de dni dorso" })
      .min(1, 'Debe enviar una foto de dni dorso')
      .max(1, 'Solo se permite una foto de dni dorso')
      .refine(
        (arr) => arr.every(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.mimetype)),
        { message: 'Formato de dni dorso no válido' } // aquí ya sabes que es foto_perfil
      )
      .refine(
        (arr) => arr.every(f => f.size <= 5 * 1024 * 1024),
        { message: 'dni dorso no puede superar 5MB' } // aquí ya sabes que es documento_identidad
      ),
  }),
}


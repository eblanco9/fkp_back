import { z } from "zod";
import { UserAdminRole } from "../../generated/prisma/index.js";

export const crearUserAdminSchema = {
    body: z.object({
        username: z.string({ error: "El username es requerido" }),
        email: z.email({ error: "El email es requerido y debe ser valido" }),
        password: z.string({ error: "El password es requerido" }),
        role: z.enum(
            Object.values(UserAdminRole).filter(role => role !== UserAdminRole.superAdmin),  
            { 
                error: `El role debe ser alguna de estas opciones: ${Object.values(UserAdminRole).filter(role => role !== UserAdminRole.superAdmin).join(", ")}` 
            }
        ),
    }),
};
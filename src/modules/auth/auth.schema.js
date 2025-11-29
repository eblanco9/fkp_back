import { z } from "zod";

export const loginSchema = {
    body: z.object({
        username: z.string({ error: "El username es requerido" }),
        password: z.string({ error: "El password es requerido" }),
    }),
};
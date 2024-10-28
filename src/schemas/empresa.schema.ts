import { z } from "zod";

export const empresaSchema = z.object({
    ruc: z.string().length(11),
    nombre: z.string(),
    estado: z.enum(["activo", "inactivo"])
})

export type Empresa = z.infer<typeof empresaSchema>
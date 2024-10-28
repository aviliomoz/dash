import { z } from 'zod'

export const empleadoSchema = z.object({
    documento: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    empresa_ruc: z.string().length(11, "El RUC debe contener 11 dígitos"),
    estado: z.enum(["activo", "inactivo"]).default("activo")
})

export type Empleado = z.infer<typeof empleadoSchema>
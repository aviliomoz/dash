import { z } from "zod"

export const insumoSchema = z.object({
    nombre: z.string()
})

export type Insumo = z.infer<typeof insumoSchema>
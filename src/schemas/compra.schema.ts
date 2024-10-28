import { string, z } from "zod";

export const compraSchema = z.object({
    fecha: z.date().or(string()),
    documento: z.string(),
    ruc: z.string(),
    razon_social: z.string(),
    insumo: z.string(),
    categoria: z.string(),
    um: z.string(),
    cantidad: z.number().or(string()),
    precio: z.number().or(string()),
    total: z.number().or(string()),
    local: z.string().optional()
})

export const compraAgrupadaSchema = z.object({
    fecha: z.date().or(string()),
    documento: z.string(),
    ruc: z.string(),
    razon_social: z.string(),
    total: z.number().or(string()),
    local: z.string()
})

export type Compra = z.infer<typeof compraSchema>
export type CompraAgrupada = z.infer<typeof compraAgrupadaSchema>

export type CompraPorSemana = {
    semana: string,
    total: number
}

export type CompraPorInsumo = {
    insumo: string,
    total: number,
    cantidad: number,
    precio: number
}

export type CompraPorProveedor = {
    fecha: string,
    total: number,
    cantidad: number,
    precio: number
}

export type HistoricoPorInsumo = {
    fecha: string,
    cantidad: number,
    precio: number,
    total: number,
    razon_social: string
}
import { z } from "zod";
import { CompraPorProveedor } from "./compra.schema";

export const proveedorSchema = z.object({
    ruc: z.string(),
    razon_social: z.string(),
})

export type Proveedor = z.infer<typeof proveedorSchema>

export type ProveedorConCompras = Proveedor & {
    compras?: CompraPorProveedor[]
}

export type PrecioPorProveedor = {
    insumo: string,
    fecha: string,
    cantidad: string,
    precio: string
}
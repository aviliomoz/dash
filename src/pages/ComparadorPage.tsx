import toast from "react-hot-toast"
import { useState } from "react"
import { ProveedorSearch } from "../components/ProveedorSearch"
import { PrecioPorProveedor, Proveedor, ProveedorConCompras } from "../schemas/proveedor.schema"
import { FiltroLocal } from "../components/FiltroLocal"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { LoaderCircle } from "lucide-react"
import { format } from "date-fns"
import { api } from "../lib/axios"

export const ComparadorPage = () => {

    const { local } = useFilters()
    const [proveedores, setProveedores] = useState<[ProveedorConCompras | undefined, ProveedorConCompras | undefined]>([undefined, undefined])
    const [comparativo, setComparativo] = useState<string[][]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const setProveedor = (letra: "A" | "B", proveedor: Proveedor) => {
        if (letra === "A") {
            setProveedores([{ ...proveedor, compras: [] }, proveedores[1]])
        } else {
            setProveedores([proveedores[0], { ...proveedor, compras: [] }])
        }
    }

    const generarComparativo = async () => {

        setLoading(true)

        try {

            if (!proveedores[0] || !proveedores[1]) throw new Error("Debes seleccionar ambos proveedores");

            const { data: comprasPA } = await api.get<ApiResponse<PrecioPorProveedor[]>>(`/proveedores/precios?local=${local}&ruc=${proveedores[0].ruc}`)

            if (comprasPA.error && !comprasPA.data) {
                return toast.error(comprasPA.error)
            }

            const { data: comprasPB } = await api.get<ApiResponse<PrecioPorProveedor[]>>(`/proveedores/precios?local=${local}&ruc=${proveedores[1].ruc}`)

            if (comprasPB.error && !comprasPB.data) {
                return toast.error(comprasPB.error)
            }

            const listaInsumosPA: string[] = comprasPA.data?.map(compra => compra.insumo)!
            const listaInsumosPB: string[] = comprasPB.data?.map(compra => compra.insumo)!

            let listaInsumos: string[] = []

            listaInsumosPA.forEach(insumo => {
                if (!listaInsumos.includes(insumo)) {
                    listaInsumos.push(insumo)
                }
            });

            listaInsumosPB.forEach(insumo => {
                if (!listaInsumos.includes(insumo)) {
                    listaInsumos.push(insumo)
                }
            });

            listaInsumos = listaInsumos.sort((a, b) => a.localeCompare(b))

            setComparativo(listaInsumos.map(insumo => {

                const insumoPA = comprasPA.data?.find(compra => compra.insumo === insumo)
                const insumoPB = comprasPB.data?.find(compra => compra.insumo === insumo)

                return [
                    insumo,
                    insumoPA?.fecha && format(new Date(insumoPA?.fecha.slice(0, 10)), "dd/MM/yyyy") || "-",
                    insumoPA?.precio && `S/ ${insumoPA?.precio}` || "-",
                    insumoPB?.fecha && format(new Date(insumoPB?.fecha.slice(0, 10)), "dd/MM/yyyy") || "-",
                    insumoPB && `S/ ${insumoPB?.precio}` || "-"]
            }))


        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Comparador de proveedores</h3>
            <div className="flex items-center gap-6">
                <FiltroLocal />
            </div>
        </div>
        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4">
            <p className="font-semibold mb-2">Selección de proveedores:</p>
            <ProveedorSearch titulo="Proveedor A" onSelect={(proveedor) => setProveedor("A", proveedor)} />
            <ProveedorSearch titulo="Proveedor B" onSelect={(proveedor) => setProveedor("B", proveedor)} />
            <button onClick={generarComparativo} disabled={!proveedores[0] || !proveedores[1]} className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 flex w-fit mt-4 disabled:cursor-not-allowed">{loading ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Generando</p> : "Generar comparativo"}</button>
        </div>
        {comparativo.length > 0 && <div className="mt-6">
            <h5 className="font-semibold mb-4">Comparativo:</h5>
            <div className="border rounded-md p-4">
                <table className="text-sm w-full">
                    <thead>
                        <tr className="h-10">
                            <th rowSpan={2} className="text-start pl-4" >Insumos</th>
                            <th className="text-start truncate max-w-80 pr-10" colSpan={2} >{proveedores[0]?.razon_social}</th>
                            <th className="text-start truncate max-w-80 pr-10" colSpan={2} >{proveedores[1]?.razon_social}</th>
                        </tr>
                        <tr className="h-10">
                            <th className="text-start">Última compra</th>
                            <th className="text-start">Precio</th>
                            <th className="text-start">Última compra</th>
                            <th className="text-start">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparativo.map(insumo => <TableRow>
                            <TableData espacio tam="lg">{insumo[0]}</TableData>
                            <TableData>{insumo[1]}</TableData>
                            <TableData>{insumo[2]}</TableData>
                            <TableData>{insumo[3]}</TableData>
                            <TableData>{insumo[4]}</TableData>
                        </TableRow>)}
                    </tbody>
                </table>
            </div>
        </div>}
    </section>
}
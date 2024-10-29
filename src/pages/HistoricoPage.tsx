import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { FiltroLocal } from "../components/FiltroLocal"
import { ChevronDown, ChevronUp, LoaderCircle, X } from "lucide-react"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { format } from "date-fns"
import { api } from "../lib/axios"
import { HistoricoPorInsumo } from "../schemas/compra.schema"
import { Insumo } from "../schemas/insumo.schema"

export const HistoricoPage = () => {

    const { local } = useFilters()
    const [search, setSearch] = useState<string>("")
    const [insumo, setInsumo] = useState<Insumo>()
    const [resultados, setResultados] = useState<Insumo[]>([])
    const [historico, setHistorico] = useState<HistoricoPorInsumo[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const calcularVariacion = (precioAnterior: number, precioSiguiente: number) => {

        const precioAnteriorFormateado = Number(precioAnterior)
        const precioSiguienteFormateado = Number(precioSiguiente)

        if (precioSiguienteFormateado === precioAnteriorFormateado) {
            return <p>-</p>
        } else if (precioSiguienteFormateado > precioAnteriorFormateado) {
            return <p className="text-red-600 flex items-center gap-2"><ChevronUp className="size-4 stroke-red-600" />{`S/ ${(precioSiguienteFormateado - precioAnteriorFormateado).toFixed(2)}`}</p>
        } else {
            return <p className="text-green-600 flex items-center gap-2"><ChevronDown className="size-4 stroke-green-600" />{`S/ ${(precioAnteriorFormateado - precioSiguienteFormateado).toFixed(2)}`}</p>
        }

    }

    const generarHistorico = async () => {
        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<HistoricoPorInsumo[]>>(`/compras/historico-por-insumo?insumo=${insumo?.nombre}&local=${local}`)

            if (data.ok && data.data) {
                setHistorico(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }

        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (insumo: Insumo) => {
        setInsumo(insumo)
        setResultados([])
        setSearch("")
    }

    useEffect(() => {

        if (search === "") {
            setResultados([])
            return
        }

        const buscarInsumo = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Insumo[]>>(`/insumos?nombre=${search}&local=${local}`)

            if (data.ok && data.data) {
                setResultados(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(buscarInsumo)
        }
    }, [search])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Histórico de compras por insumo</h3>
            <div className="flex items-center gap-6">
                <FiltroLocal />
            </div>
        </div>
        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4">
            <p className="font-semibold mb-2">Seleccina un insumo:</p>
            <label className="flex items-center gap-3 relative">
                <p className="font-medium min-w-fit">Insumo:</p>

                {insumo
                    ? <div className="flex items-center gap-4 text-sm"><p>{insumo.nombre}</p><X className="size-5 cursor-pointer bg-gray-300 stroke-[3] stroke-gray-700 rounded-full p-1" onClick={(() => setInsumo(undefined))} /></div>
                    : <input className="outline-none border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                }

                {resultados.length > 0 && <ul className="absolute top-full mt-2 left-24 z-20 bg-white border rounded-md p-2 flex flex-col gap-1">
                    {resultados.map(insumo => <li onClick={() => handleSelect(insumo)} className="hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:font-medium" key={insumo.nombre}>
                        {insumo.nombre}
                    </li>)}
                </ul>}
            </label>
            <button onClick={generarHistorico} disabled={!insumo} className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 flex w-fit mt-4 disabled:cursor-not-allowed">{loading ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Generando</p> : "Generar histórico"}</button>
        </div>
        {historico.length > 0 && <div className="mt-6">
            <h5 className="font-semibold mb-4">Histórico:</h5>
            <Table titulos={["Fecha", "Proveedor", "Cantidad", "Precio", "Total", "Variación"]}>
                {historico.map((compra, index) => <TableRow>
                    <TableData espacio>{format(compra.fecha, "dd/MM/yyyy")}</TableData>
                    <TableData tam="lg">{compra.razon_social}</TableData>
                    <TableData>{compra.cantidad}</TableData>
                    <TableData>{`S/ ${compra.precio}`}</TableData>
                    <TableData>{`S/ ${compra.total}`}</TableData>
                    <TableData>{index === historico.length - 1 ? "-" : calcularVariacion(historico[index + 1].precio, compra.precio)}</TableData>
                </TableRow>)}
            </Table>
        </div>}
    </section>
}
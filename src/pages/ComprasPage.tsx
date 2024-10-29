import toast from "react-hot-toast"
import { DatabaseBackup, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ApiResponse } from "../utils/types"
import { CompraPorDocumento } from "../schemas/compra.schema"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { format } from 'date-fns'
import { useFilters } from "../contexts/FiltersContext"
import { FiltroLocal } from "../components/FiltroLocal"
import { RangeDatePicker } from "../components/RangeDatePicker"
import { api } from "../lib/axios"

export const ComprasPage = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [compras, setCompras] = useState<CompraPorDocumento[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getCompras = async () => {
        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraPorDocumento[]>>(`/compras?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)

            if (data.ok && data.data) {
                setCompras(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener los empleados")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCompras()
    }, [local, fechaInicial, fechaFinal])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Compras</h3>
            <div className="flex items-center gap-6">
                <FiltroLocal />
                <RangeDatePicker />
                <Link to="/compras/actualizar" className="bg-gray-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-gray-800 flex items-center gap-2"><DatabaseBackup className="size-4 stroke-white" />Actualizar compras</Link>
            </div>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando compras</p> :
            <Table titulos={["Fecha", "Local", "Documento", "RUC", "Razón social", "Total"]}>
                {compras.sort((a, b) => {
                    // Primero, ordenamos por fecha
                    const dateA = new Date(a.fecha);
                    const dateB = new Date(b.fecha);
                    if (dateA < dateB) return -1;
                    if (dateA > dateB) return 1;

                    // Si las fechas son iguales, ordenamos por documento
                    return a.documento.localeCompare(b.documento);
                }).map(compra => <TableRow key={compra.documento}>
                    <TableData espacio>{format(compra.fecha, "dd/MM/yyyy")}</TableData>
                    <TableData>{compra.local}</TableData>
                    <TableData tam="md">{compra.documento}</TableData>
                    <TableData>{compra.ruc}</TableData>
                    <TableData tam="lg">{compra.razon_social}</TableData>
                    <TableData>{`S/ ${compra.total.toString()}`}</TableData>
                </TableRow>)}
            </Table>
        }
    </section>
}
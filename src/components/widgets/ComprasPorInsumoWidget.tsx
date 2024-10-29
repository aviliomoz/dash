import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { CompraPorInsumo } from "../../schemas/compra.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { Table } from "../ui/Table"
import { TableRow } from "../ui/TableRow"
import { TableData } from "../ui/TableData"
import { api } from "../../lib/axios"

export const ComprasPorInsumoWidget = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [compras, setCompras] = useState<CompraPorInsumo[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getCompras = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraPorInsumo[]>>(`/compras/por-insumo?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)
            if (data.ok && data.data) {
                setCompras(data.data.sort((a, b) => b.total - a.total))
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCompras()
    }, [local, fechaInicial, fechaFinal])

    return <Widget titulo="Compras por insumo" y_scroll loading={loading}>
        <Table titulos={["Insumo", "Cantidad", "Precio más alto", "Facturado"]}>
            {compras.map(compra => <TableRow key={compra.insumo}>
                <TableData espacio>{compra.insumo}</TableData>
                <TableData >{Number(compra.cantidad).toLocaleString()}</TableData>
                <TableData >{`S/ ${Number(compra.precio).toLocaleString()}`}</TableData>
                <TableData >{`S/ ${Number(compra.total).toLocaleString()}`}</TableData>
            </TableRow>)}
        </Table>
    </Widget>
}
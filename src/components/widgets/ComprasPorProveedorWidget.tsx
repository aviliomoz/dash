import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { CompraAgrupadaPorProveedor } from "../../schemas/compra.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { Table } from "../ui/Table"
import { TableRow } from "../ui/TableRow"
import { TableData } from "../ui/TableData"
import { api } from "../../lib/axios"

export const ComprasPorProveedorWidget = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [compras, setCompras] = useState<CompraAgrupadaPorProveedor[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getCompras = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraAgrupadaPorProveedor[]>>(`/compras/por-proveedor?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)
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

    return <Widget titulo="Compras por proveedor" y_scroll loading={loading}>
        <Table titulos={["Proveedor", "Facturado"]}>
            {compras.map(compra => <TableRow key={compra.razon_social}>
                <TableData espacio tam="xl">{compra.razon_social}</TableData>
                <TableData >{`S/ ${Number(compra.total).toFixed(2)}`}</TableData>
            </TableRow>)}
        </Table>
    </Widget>
}
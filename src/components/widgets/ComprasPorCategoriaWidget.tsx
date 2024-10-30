import toast from "react-hot-toast"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { CompraPorCategoria } from "../../schemas/compra.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { api } from "../../lib/axios"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts"

export const ComprasPorCategoriaWidget = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [compras, setCompras] = useState<CompraPorCategoria[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getCompras = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraPorCategoria[]>>(`/compras/por-categoria?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)
            if (data.ok && data.data) {

                setCompras(data.data.map(compra => ({ ...compra, total: Number(compra.total) })))
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

    return <Widget titulo="Compras por categoria" center loading={loading}>
        {compras.length > 0 && <RadarChart
            width={500} height={500}
            outerRadius="60%" data={compras}>
            <PolarGrid />
            <PolarAngleAxis dataKey="categoria" fontSize={10} fontWeight={600} width={100} />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar name="Compras" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>}
    </Widget>
}
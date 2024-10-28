import toast from "react-hot-toast"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Widget } from "../ui/Widget"
import { useEffect, useState } from "react"
import { CompraPorSemana } from "../../schemas/compra.schema"
import { useFilters } from "../../contexts/FiltersContext"
import { format } from "date-fns"
import { ApiResponse } from "../../utils/types"
import { api } from "../../lib/axios"

export const ComprasPorSemanaWidget = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [compras, setCompras] = useState<CompraPorSemana[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const obtenerCompras = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraPorSemana[]>>(`/compras/por-semana?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)

            if (data.ok && data.data) {
                setCompras(data.data.sort((a, b) => Number(a.semana.split("-")[0].slice(1)) - Number(b.semana.split("-")[0].slice(1))))
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const obtenerLimite = () => {

        if (compras.length < 1) return 0

        const limite = [...compras].sort((a, b) => b.total - a.total)[0].total;
        return Math.ceil(limite / 1000) * 1000;
    };

    useEffect(() => {
        obtenerCompras()
    }, [local, fechaInicial, fechaFinal])

    return <Widget titulo="Compras por semana" loading={loading} x_scroll>
        <LineChart
            width={500 + (compras.length * 70)}
            height={200}
            data={compras}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis fontSize={11} fontWeight={"bold"} dataKey="semana" />
            <YAxis domain={[0, obtenerLimite()]} />
            <Tooltip labelFormatter={(label) => `Semana ${label}`} />
            {/* <Legend /> */}
            <Line type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} strokeWidth={2}/>
        </LineChart>
    </Widget>
}
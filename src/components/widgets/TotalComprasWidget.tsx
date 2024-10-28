import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { Widget } from "../ui/Widget"
import { useFilters } from "../../contexts/FiltersContext"
import { ApiResponse } from "../../utils/types"
import { format } from "date-fns"
import { CompraPorSemana } from "../../schemas/compra.schema"
import { api } from "../../lib/axios"

export const TotalComprasWidget = () => {

    const { local, fechaInicial, fechaFinal } = useFilters()
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    const getTotal = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<CompraPorSemana[]>>(`/compras/por-semana?local=${local}&fechaInicial=${format(fechaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaFinal, "yyyy-MM-dd")}`)

            if (data.ok) {
                if (data.data) {
                    const total = data.data.reduce((acc, current) => acc + Number(current.total), 0)
                    setTotal(total)
                }
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getTotal()
    }, [local, fechaInicial, fechaFinal])

    return <Widget titulo="Total de compras" loading={loading}>
        <p className="text-xl font-bold">{`S/ ${total.toLocaleString()}`}</p>
    </Widget>
}
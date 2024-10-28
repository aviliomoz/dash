import toast from "react-hot-toast"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { add, format, getMonth, getYear, lastDayOfMonth, parseISO } from 'date-fns'
import { LOCALES, MESES } from "../utils/constants"
import { ApiResponse, Local } from "../utils/types"
import { CheckCircle, LoaderCircle } from "lucide-react"
import { Compra } from "../schemas/compra.schema"
import { useFilters } from "../contexts/FiltersContext"
import { api } from "../lib/axios"

type Accion = {
    descripcion: string,
    listo: boolean,
    actualizando: boolean
}

export const ComprasForm = () => {

    const navigate = useNavigate()

    const {local, setLocal, fechaInicial, setFechaInicial, fechaFinal, setFechaFinal} = useFilters()

    const [acciones, setAcciones] = useState<Accion[]>([])
    const [updating, setUpdating] = useState<boolean>(false)

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault()

        setAcciones([])
        setUpdating(true)

        try {

            let fechaDescargaInicial = fechaInicial;

            let acciones: Accion[] = []

            while (fechaDescargaInicial < fechaFinal) {

                const accion = { descripcion: `Actualizando data de ${MESES[getMonth(fechaDescargaInicial)]} ${getYear(fechaDescargaInicial)}`, actualizando: true, listo: false }
                acciones.push(accion)
                setAcciones(acciones)

                let fechaDescargaFinal = getMonth(fechaDescargaInicial) === getMonth(fechaFinal) ? fechaFinal : lastDayOfMonth(fechaDescargaInicial)

                const { data } = await api.put<ApiResponse<Compra[]>>(`/compras?local=${local}&fechaInicial=${format(fechaDescargaInicial, "yyyy-MM-dd")}&fechaFinal=${format(fechaDescargaFinal, "yyyy-MM-dd")}`)

                if (data.ok) {
                    toast.success(data.message)
                } else if (data.error) {
                    setAcciones([])
                    throw new Error(data.error);
                }

                acciones = acciones.map(acc => acc.descripcion === accion.descripcion ? { ...accion, actualizando: false, listo: true } : acc)
                setAcciones(acciones)

                fechaDescargaInicial = add(lastDayOfMonth(fechaDescargaInicial), { days: 1 })
            }

            const accion = { descripcion: `Listo`, actualizando: false, listo: true }
            acciones.push(accion)
            setAcciones(acciones)

            toast.success("Actualización completa")

        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setUpdating(false)
        }
    }

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Actualizar compras</h3>
            <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
        <div className="flex gap-4 w-full">
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit h-fit">
                <label className="flex flex-col gap-2">
                    <p className="font-medium text-sm">Local:</p>
                    <select className={"border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none"} value={local} onChange={(e) => setLocal(e.target.value as Local)} >
                        {LOCALES.map(local => <option key={local} value={local}>{local}</option>)}
                    </select>
                </label>
                <label className="flex flex-col gap-2">
                    <p className="font-medium text-sm">Fecha inicial:</p>
                    <input className={"border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none"} max={format(fechaFinal, "yyyy-MM-dd")} onKeyDown={(e) => e.preventDefault()} type="date" value={format(fechaInicial, "yyyy-MM-dd")} onChange={(e) => setFechaInicial(parseISO(e.target.value))} />
                </label>
                <label className="flex flex-col gap-2">
                    <p className="font-medium text-sm">Fecha final:</p>
                    <input className={"border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none"} min={format(fechaInicial, "yyyy-MM-dd")} onKeyDown={(e) => e.preventDefault()} type="date" value={format(fechaFinal, "yyyy-MM-dd")} onChange={(e) => setFechaFinal(parseISO(e.target.value))} />
                </label>
                <button className="bg-gray-900 text-white text-sm px-10 py-2 rounded-md w-fit mt-6" type="submit">{updating ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Actualizando</p> : "Actualizar"}</button>
            </form>
            {acciones.length > 0 && <div className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit min-w-96 h-fit">
                <h5 className="font-medium">Actualizando compras</h5>
                <ul className="flex flex-col gap-3">
                    {acciones.map(accion => <li className="flex items-center gap-3 text-sm" key={accion.descripcion}>
                        {accion.actualizando && <LoaderCircle className="size-4 animate-spin" />}
                        {accion.listo && <CheckCircle className="size-4 stroke-green-600" />}
                        {accion.descripcion}
                    </li>)}
                </ul>
            </div>}
        </div>
    </section>
}

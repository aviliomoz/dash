import { format, parseISO } from "date-fns"
import { useFilters } from "../contexts/FiltersContext"

export const RangeDatePicker = () => {

    const {fechaInicial, setFechaInicial, fechaFinal, setFechaFinal} = useFilters()

    return <div className="flex items-center gap-3 text-sm">
        <p className="font-medium">Fechas: </p>
        <input type="date" className="border rounded-md shadow-sm px-3 py-1.5" onKeyDown={(e) => e.preventDefault()} value={format(fechaInicial, "yyyy-MM-dd")} max={format(fechaFinal, "yyyy-MM-dd")} onChange={(e) => setFechaInicial(parseISO(e.target.value))} />
        <p>-</p>
        <input type="date" className="border rounded-md shadow-sm px-3 py-1.5" onKeyDown={(e) => e.preventDefault()} value={format(fechaFinal, "yyyy-MM-dd")} min={format(fechaInicial, "yyyy-MM-dd")} onChange={(e) => setFechaFinal(parseISO(e.target.value))}/>
    </div>
}
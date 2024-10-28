import { useFilters } from "../contexts/FiltersContext"
import { LOCALES } from "../utils/constants"
import { Local } from "../utils/types"

export const FiltroLocal = () => {
    const { local, setLocal } = useFilters()

    return <label className="flex items-center gap-3">
        <p className="text-sm font-medium">Local: </p>
        <select className="outline-none border rounded-md px-3 py-2 text-sm cursor-pointer" value={local} onChange={(e) => setLocal(e.target.value as Local)}>
            {LOCALES.map(local => <option key={local} value={local}>{local}</option>)}
        </select>
    </label>
}
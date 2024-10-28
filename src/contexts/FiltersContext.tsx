import { createContext, useContext, useState } from "react"
import { LOCALES } from "../utils/constants"
import { Local } from "../utils/types"
import { startOfMonth, sub } from 'date-fns'

type FiltersContextType = {
    local: Local,
    setLocal: (local: Local) => void
    fechaInicial: Date,
    setFechaInicial: (fecha: Date) => void,
    fechaFinal: Date,
    setFechaFinal: (fecha: Date) => void,
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export const FiltersContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [local, setLocal] = useState<Local>(LOCALES[0])
    const [fechaFinal, setFechaFinal] = useState<Date>(new Date())
    const [fechaInicial, setFechaInicial] = useState<Date>(sub(startOfMonth(fechaFinal), { months: 1 }))

    return <FiltersContext.Provider value={{ local, setLocal, fechaInicial, setFechaInicial, fechaFinal, setFechaFinal }}>
        {children}
    </FiltersContext.Provider>
}

export const useFilters = () => {
    const context = useContext(FiltersContext)
    if (!context) throw new Error("El useFilter debe estar dentro de FiltersContextProvider");
    return context
}
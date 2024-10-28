import { useEffect, useState } from "react"
import { Proveedor } from "../schemas/proveedor.schema"
import { ApiResponse } from "../utils/types"
import { useFilters } from "../contexts/FiltersContext"
import { X } from "lucide-react"
import { api } from "../lib/axios"

type Props = {
    titulo: string,
    onSelect: (proveedor: Proveedor) => void
}

export const ProveedorSearch = ({ titulo, onSelect }: Props) => {

    const { local } = useFilters()
    const [nombre, setNombre] = useState<string>("")
    const [proveedor, setProveedor] = useState<Proveedor>()
    const [resultados, setResultados] = useState<Proveedor[]>([])

    useEffect(() => {

        if (nombre === "") {
            setResultados([])
            return
        }

        const buscarProveedor = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Proveedor[]>>(`/proveedores?search=${nombre}&local=${local}`)

            if (data.ok && data.data) {
                setResultados(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(buscarProveedor)
        }
    }, [nombre])


    const handleSelect = (proveedor: Proveedor) => {
        setProveedor(proveedor)
        setNombre("")
        setResultados([])
        onSelect(proveedor)
    }

    return <label className="flex items-center gap-3 relative">
        <p className="font-medium min-w-fit">{titulo}:</p>

        {proveedor
            ? <div className="flex items-center gap-4 text-sm"><p>{proveedor.razon_social}</p><X className="size-5 cursor-pointer bg-gray-300 stroke-[3] stroke-gray-700 rounded-full p-1" onClick={(() => setProveedor(undefined))} /></div>
            : <input className="outline-none border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        }

        {resultados.length > 0 && <ul className="absolute top-full mt-2 left-24 z-20 bg-white border rounded-md p-2 flex flex-col gap-1">
            {resultados.map(proveedor => <li onClick={() => handleSelect(proveedor)} className="hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:font-medium" key={proveedor.ruc}>
                {`${proveedor.ruc} - ${proveedor.razon_social}`}
            </li>)}
        </ul>}
    </label>
}
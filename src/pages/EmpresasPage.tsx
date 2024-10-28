import toast from "react-hot-toast"
import { LoaderCircle, Plus, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ApiResponse } from "../utils/types"
import { Empresa } from "../schemas/empresa.schema"
import { StatusTag } from "../components/ui/StatusTag"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { SearchBar } from "../components/SearchBar"
import { api } from "../lib/axios"

export const EmpresasPage = () => {

    const [searchParams] = useSearchParams()

    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getEmpresas = async () => {

        const search = searchParams.get("search") || ""

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<Empresa[]>>(`/empresas?search=${search}`)

            if (data.ok && data.data) {
                setEmpresas(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener las empresas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEmpresas()
    }, [searchParams])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Empresas</h3>
            <div className="flex items-center gap-4">
                <SearchBar />
                <Link to="/club/empresas/nueva" className="bg-gray-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-gray-800 flex items-center gap-2"><Plus className="size-4 stroke-white" />Nueva empresa</Link>
            </div>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando empresas</p> :
            <Table titulos={["RUC", "Nombre", "Estado", "Opciones"]}>
                {empresas.map(empresa => <TableRow key={empresa.ruc}>
                    <TableData espacio>{empresa.ruc}</TableData>
                    <TableData>{empresa.nombre}</TableData>
                    <TableData><StatusTag status={empresa.estado} letraFinal="a" /></TableData>
                    <TableData>
                        <Link className="flex items-center gap-2 border rounded-md px-3 py-1.5 my-auto bg-white w-fit" to={`/club/empresas/${empresa.ruc}`}><SquarePen className="size-4" />Editar empresa</Link>
                    </TableData>
                </TableRow>)}
            </Table>
        }
    </section>
}
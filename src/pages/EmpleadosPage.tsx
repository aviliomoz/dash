import toast from "react-hot-toast"
import { LoaderCircle, Plus, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ApiResponse } from "../utils/types"
import { EmpleadoConRazonSocial } from "../schemas/empleado.schema"
import { StatusTag } from "../components/ui/StatusTag"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { SearchBar } from "../components/SearchBar"
import { api } from "../lib/axios"

export const EmpleadosPage = () => {

    const [searchParams] = useSearchParams()

    const [empleados, setEmpleados] = useState<EmpleadoConRazonSocial[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getEmpleados = async () => {

        const search = searchParams.get("search") || ""

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<EmpleadoConRazonSocial[]>>(`/empleados?search=${search}`)

            if (data.ok && data.data) {
                setEmpleados(data.data)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener los empleados")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEmpleados()
    }, [searchParams])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Empleados</h3>
            <div className="flex items-center gap-4">
                <SearchBar />
                <Link to="/club/empleados/nuevo" className="bg-gray-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-gray-800 flex items-center gap-2"><Plus className="size-4 stroke-white" />Nuevo empleado</Link>
            </div>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando empleados</p> :
            <Table titulos={["Documento", "Nombre", "Apellido", "Empresa", "Estado", "Opciones"]}>
                {empleados.map(empleado => <TableRow key={empleado.documento}>
                    <TableData espacio>{empleado.documento}</TableData>
                    <TableData>{empleado.nombre}</TableData>
                    <TableData>{empleado.apellido}</TableData>
                    <TableData tam="md">{empleado.razon_social}</TableData>
                    <TableData><StatusTag status={empleado.estado} /></TableData>
                    <TableData>
                        <Link className="flex items-center gap-2 border rounded-md px-3 py-1.5 my-auto bg-white w-fit" to={`/club/empleados/${empleado.documento}`}><SquarePen className="size-4" />Editar empleado</Link>
                    </TableData>
                </TableRow>)}
            </Table>
        }
    </section>
}
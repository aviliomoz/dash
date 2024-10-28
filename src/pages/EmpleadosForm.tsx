import toast from "react-hot-toast"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ApiResponse, Status } from "../utils/types"
import { Empleado } from "../schemas/empleado.schema"
import { LoaderCircle } from "lucide-react"
import { ImportadorEmpleados } from "../components/ImportadorEmpleados"
import { api } from "../lib/axios"

export const EmpleadosForm = () => {

    const navigate = useNavigate()
    const { n } = useParams()

    const mode: "crear" | "editar" = n === "nuevo" ? "crear" : "editar"

    const [documento, setDocumento] = useState<string>("")
    const [nombre, setNombre] = useState<string>("")
    const [apellido, setApellido] = useState<string>("")
    const [ruc, setRuc] = useState<string>("")
    const [estado, setEstado] = useState<Status>("activo")

    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)

    const getEmpleado = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<Empleado>>(`/empleados/${n}`)

            if (data.ok && data.data) {
                setDocumento(data.data.documento)
                setNombre(data.data.nombre)
                setApellido(data.data.apellido)
                setRuc(data.data.empresa_ruc)
                setEstado(data.data.estado)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener el empleado")
        } finally {
            setLoading(false)
        }
    }

    const registrarEmpleado = async () => {

        setSaving(true)

        try {
            const { data } = await api.post<ApiResponse<Empleado>>(`/empleados`, {
                documento,
                nombre,
                apellido,
                empresa_ruc: ruc,
                estado
            })

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empleados")
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al registrar el empleado")
        } finally {
            setSaving(false)
        }

    }

    const editarEmpleado = async () => {

        setSaving(true)

        try {
            const { data } = await api.put<ApiResponse<Empleado>>(`/empleados/${documento}`, {
                documento,
                nombre,
                apellido,
                empresa_ruc: ruc,
                estado
            })

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empleados")
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al editar el empleado")
        } finally {

            setSaving(false)
        }

    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (documento.length < 8 || documento.length > 12) return toast.error("Ingresa un documento válido")

        if (mode === "editar") {
            await editarEmpleado()
        } else if (mode === "crear") {
            await registrarEmpleado()
        }
    }

    useEffect(() => {
        if (mode === "editar") {
            getEmpleado()
        }
    }, [mode])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">{mode === "crear" ? "Nuevo empleado" : "Editar empleado"}</h3>
            <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando datos del empleado</p> :
            <div className="flex gap-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit h-fit">
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">N° de documento</p>
                        <input disabled={mode === "editar"} className={`border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none ${mode === "editar" && "cursor-not-allowed"}`} type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">Nombre</p>
                        <input className="border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">Apellido</p>
                        <input className="border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">RUC de la empresa</p>
                        <input className="border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none" type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} max={11} />
                    </label>
                    {mode === "editar" && <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">Estado</p>
                        <select className="border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none" value={estado} onChange={(e) => setEstado(e.target.value as Status)}>
                            <option value={"activo"}>Activo</option>
                            <option value={"inactivo"}>Inactivo</option>
                        </select>
                    </label>}
                    <button className="bg-gray-900 text-white text-sm px-10 py-2 rounded-md w-fit mt-6" type="submit">{saving ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Guardando</p> : "Guardar"}</button>
                </form>
                {mode === "crear" && <ImportadorEmpleados />}
            </div>}
    </section>
}
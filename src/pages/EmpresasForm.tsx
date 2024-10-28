import { FormEvent, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ApiResponse, Status } from "../utils/types"
import { Empresa } from "../schemas/empresa.schema"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { ImportadorEmpresas } from "../components/ImportadorEmpresas"
import { api } from "../lib/axios"

export const EmpresasForm = () => {

    const navigate = useNavigate()
    const { n } = useParams()

    const mode: "crear" | "editar" = n === "nueva" ? "crear" : "editar"

    const [ruc, setRuc] = useState<string>("")
    const [nombre, setNombre] = useState<string>("")
    const [estado, setEstado] = useState<Status>("activo")

    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)

    const getEmpresa = async () => {

        setLoading(true)

        try {
            const { data } = await api.get<ApiResponse<Empresa>>(`/empresas/${n}`)

            if (data.ok && data.data) {
                setRuc(data.data.ruc)
                setNombre(data.data.nombre)
                setEstado(data.data.estado)
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al obtener las empresas")
        } finally {
            setLoading(false)
        }
    }

    const registrarEmpresa = async () => {

        setSaving(true)

        try {
            const { data } = await api.post<ApiResponse<Empresa>>(`/empresas`, {
                ruc,
                nombre,
            })

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empresas")
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al registrar la empresa")
        } finally {
            setSaving(false)
        }

    }

    const editarEmpresa = async () => {

        setSaving(true)

        try {
            const { data } = await api.put<ApiResponse<Empresa>>(`/empresas/${ruc}`, {
                ruc,
                nombre,
                estado
            })

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empresas")
            } else if (data.error) {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al editar la empresa")
        } finally {

            setSaving(false)
        }

    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (ruc.length !== 11) return toast.error("Ingresa un RUC válido")

        if (mode === "editar") {
            await editarEmpresa()
        } else if (mode === "crear") {
            await registrarEmpresa()
        }
    }

    useEffect(() => {
        if (mode === "editar") {
            getEmpresa()
        }
    }, [mode])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">{mode === "crear" ? "Nueva empresa" : "Editar empresa"}</h3>
            <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
        {loading ? <p className="text-gray-500 text-sm flex items-center gap-2"> <LoaderCircle className="size-4 animate-spin" />Cargando datos de la empresa</p> :
            <div className="flex gap-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 border rounded-md p-8 shadow-md bg-gray-100 w-fit h-fit">
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">RUC</p>
                        <input disabled={mode === "editar"} className={`border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none ${mode === "editar" && "cursor-not-allowed"}`} type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-2">
                        <p className="font-medium text-sm">Nombre</p>
                        <input className="border rounded-md px-3 py-2 text-sm w-80 shadow-sm outline-none" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
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
                {mode === "crear" && <ImportadorEmpresas />}
            </div>}
    </section>
}
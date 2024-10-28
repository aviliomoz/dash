import toast from "react-hot-toast"
import ExcelJS from 'exceljs'
import { FormEvent, useEffect, useState } from "react"
import { Empleado, empleadoSchema } from "../schemas/empleado.schema"
import { ApiResponse } from "../utils/types"
import { useNavigate } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { Table } from "./ui/Table"
import { TableRow } from "./ui/TableRow"
import { TableData } from "./ui/TableData"
import { z } from "zod"
import { api } from "../lib/axios"

export const ImportadorEmpleados = () => {

    const navigate = useNavigate()

    const [empleados, setEmpleados] = useState<Empleado[]>([])
    const [validated, setValidated] = useState<boolean>(true)
    const [saving, setSaving] = useState<boolean>(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = async (e: ProgressEvent<FileReader>) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;

                const workbook = new ExcelJS.Workbook()
                await workbook.xlsx.load(arrayBuffer);

                const worksheet = workbook.getWorksheet(1);

                const jsonData: Empleado[] = [];

                try {
                    worksheet?.eachRow((row, rowNum) => {
                        if (rowNum > 1) {
                            const values = row.values as [undefined, number, string, string, number];

                            if (values.length !== 5) throw new Error("Estructura inválida");

                            jsonData.push({
                                documento: values[1].toString(),
                                nombre: values[2],
                                apellido: values[3],
                                empresa_ruc: values[4].toString(),
                                estado: "activo"
                            })
                        }
                    })

                    setEmpleados(jsonData)
                } catch (error) {
                    setValidated(false)
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setSaving(true)

        if (empleados.length > 0 && validated) {
            const { data } = await api.post<ApiResponse<Empleado[]>>("/empleados/lote", empleados)

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empleados")
            } else if (data.error) {
                toast.error(data.error)
            }
        }

        setSaving(false)
    }

    useEffect(() => {
        if (empleados.length > 0) {
            const validated = z.array(empleadoSchema).safeParse(empleados)

            if (validated.success) {
                setValidated(true)
            }
        }
    }, [empleados])

    return <form onSubmit={handleSubmit} className="border bg-gray-100 rounded-lg p-8 h-fit shadow-md flex flex-col gap-4">
        <h4 className="font-semibold">Registro en lote</h4>
        <input className="text-sm" type="file" accept=".xlsx, .xls" onChange={handleUpload} />
        {!validated && <span className="text-sm text-red-700">Los datos del archivo no tienen la estructura válida</span>}
        {empleados.length > 0 && validated && <div className="border p-6 rounded-md shadow-sm bg-white">
            <h5 className="font-medium mb-4">Datos a importar:</h5>
            <Table titulos={["RUC", "Nombre", "Apellido", "RUC Empresa"]}>
                {empleados.map(empleado => <TableRow key={empleado.documento}>
                    <TableData espacio>{empleado.documento}</TableData>
                    <TableData>{empleado.nombre}</TableData>
                    <TableData>{empleado.apellido}</TableData>
                    <TableData>{empleado.empresa_ruc}</TableData>
                </TableRow>)}
            </Table>
            <button className="bg-gray-900 hover:bg-gray-800 px-6 py-2 text-sm rounded-md shadow-md text-white mt-8">{saving ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Importando</p> : "Importar"}</button>
        </div>}
    </form>
}
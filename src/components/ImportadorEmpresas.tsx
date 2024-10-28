import toast from "react-hot-toast"
import ExcelJS from 'exceljs'
import { FormEvent, useEffect, useState } from "react"
import { Empresa, empresaSchema } from "../schemas/empresa.schema"
import { ApiResponse } from "../utils/types"
import { useNavigate } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { Table } from "./ui/Table"
import { TableRow } from "./ui/TableRow"
import { TableData } from "./ui/TableData"
import { z } from "zod"
import { api } from "../lib/axios"

export const ImportadorEmpresas = () => {

    const navigate = useNavigate()

    const [empresas, setEmpresas] = useState<Empresa[]>([])
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

                const jsonData: Empresa[] = [];

                try {
                    worksheet?.eachRow((row, rowNum) => {
                        if (rowNum > 1) {
                            const values = row.values as [undefined, number, string];

                            if (values.length !== 3) throw new Error("Estructura inválida")

                            jsonData.push({
                                ruc: values[1].toString(),
                                nombre: values[2],
                                estado: "activo"
                            })
                        }
                    })

                    setEmpresas(jsonData)
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

        if (empresas.length > 0 && validated) {
            const { data } = await api.post<ApiResponse<Empresa[]>>("/empresas/lote", empresas)

            if (data.ok && data.data) {
                toast.success(data.message)
                navigate("/club/empresas")
            } else if (data.error) {
                toast.error(data.error)
            }
        }

        setSaving(false)
    }

    useEffect(() => {
        if (empresas.length > 0) {
            const validated = z.array(empresaSchema).safeParse(empresas)
            if (validated.success) {
                setValidated(true)
            }
        }
    }, [empresas])

    return <form onSubmit={handleSubmit} className="border bg-gray-100 rounded-lg p-8 h-fit shadow-md flex flex-col gap-4">
        <h4 className="font-semibold">Registro en lote</h4>
        <input className="text-sm" type="file" accept=".xlsx, .xls" onChange={handleUpload} />
        {!validated && <span className="text-sm text-red-700">Los datos del archivo no tienen la estructura válida</span>}
        {empresas.length > 0 && validated && <div className="border p-6 rounded-md shadow-sm bg-white">
            <h5 className="font-medium mb-4">Datos a importar:</h5>
            <Table titulos={["RUC", "Nombre"]}>
                {empresas.map(empresa => <TableRow key={empresa.ruc}>
                    <TableData espacio>{empresa.ruc}</TableData>
                    <TableData>{empresa.nombre}</TableData>
                </TableRow>)}
            </Table>
            <button className="bg-gray-900 hover:bg-gray-800 px-6 py-2 text-sm rounded-md shadow-md text-white mt-8">{saving ? <p className="flex items-center gap-2"><LoaderCircle className="size-4 animate-spin stroke-white" />Importando</p> : "Importar"}</button>
        </div>}
    </form>
}
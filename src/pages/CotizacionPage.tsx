import { useEffect, useState } from "react"
import { Insumo } from "../schemas/insumo.schema"
import { FiltroLocal } from "../components/FiltroLocal"
import { useFilters } from "../contexts/FiltersContext"
import { Table } from "../components/ui/Table"
import { TableRow } from "../components/ui/TableRow"
import { TableData } from "../components/ui/TableData"
import { Download, Trash, X } from "lucide-react"
import { ApiResponse } from "../utils/types"
import { api } from "../lib/axios"
import toast from "react-hot-toast"
import ExcelJS from 'exceljs'

type Cotizacion = {
    insumo: Insumo,
    cantidad: number,
    precio: number,
}[]

export const CotizacionPage = () => {
    const { local } = useFilters()
    const [cotizacion, setCotizacion] = useState<Cotizacion>([])

    const [search, setSearch] = useState<string>("")

    const [insumo, setInsumo] = useState<Insumo>()
    const [resultados, setResultados] = useState<Insumo[]>([])

    const handleSelect = async (insumo: Insumo) => {

        if (cotizacion.some(linea => linea.insumo.nombre === insumo.nombre)) {
            return toast.error("El insumo ya se encuentra en la lista")
        }

        setSearch("")
        setInsumo(undefined)
        setResultados([])

        const { data } = await api.get<ApiResponse<number>>(`/insumos/precio?nombre=${insumo.nombre}&local=${local}`)

        if (data.ok && data.data) {
            setCotizacion([...cotizacion, { insumo, cantidad: 1, precio: Number(data.data) }])
        } else if (data.error) {
            toast.error(data.error)
        }

    }

    const eliminarDeCotizacion = (insumo: Insumo) => {
        setCotizacion(cotizacion.filter(linea => linea.insumo.nombre !== insumo.nombre))
    }

    const cambiarCantidad = (insumo: Insumo, cantidad: number) => {
        setCotizacion(cotizacion.map(linea => linea.insumo.nombre === insumo.nombre ? { ...linea, cantidad } : linea))
    }

    const descargarExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotización');

        // Establecemos las columnas del Excel
        worksheet.columns = [
            { header: 'Insumo', key: 'insumo', width: 70 },
            { header: 'Cantidad', key: 'cantidad', width: 15 },
            { header: 'Último Precio', key: 'precio', width: 15 },
            { header: 'Total', key: 'total', width: 15 },
        ];

        // Agregamos las filas a la hoja de cálculo
        cotizacion.forEach(linea => {
            worksheet.addRow({
                insumo: linea.insumo.nombre,
                cantidad: linea.cantidad,
                precio: linea.precio,
                total: (linea.cantidad * linea.precio),
            });
        });

        // Añadir un total general al final
        worksheet.addRow({
            insumo: "Total",
            total: cotizacion.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0)
        });

        // Estilos opcionales

        const titulosRow = worksheet.getRow(1)
        titulosRow.font = { bold: true }

        const totalRow = worksheet.lastRow;
        totalRow!.font = { bold: true };

        // Generamos el archivo Excel y descargamos
        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Crear un enlace y hacer que el navegador descargue el archivo
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Cotizacion_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {

        if (search === "") {
            setResultados([])
            return
        }

        const buscarInsumo = setTimeout(async () => {
            const { data } = await api.get<ApiResponse<Insumo[]>>(`/insumos?nombre=${search}&local=${local}`)

            if (data.ok && data.data) {
                setResultados(data.data)
            }

        }, 300)

        return () => {
            clearTimeout(buscarInsumo)
        }
    }, [search])

    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Generador de cotización</h3>
            <div className="flex items-center gap-6">
                <FiltroLocal />
            </div>
        </div>

        <div className="border rounded-md shadow-md p-4 text-sm flex flex-col gap-4 mb-4">
            <p className="font-semibold mb-2">Seleccina un insumo:</p>
            <label className="flex items-center gap-3 relative">
                <p className="font-medium min-w-fit">Insumo:</p>

                {insumo
                    ? <div className="flex items-center gap-4 text-sm"><p>{insumo.nombre}</p><X className="size-5 cursor-pointer bg-gray-300 stroke-[3] stroke-gray-700 rounded-full p-1" onClick={(() => setInsumo(undefined))} /></div>
                    : <input className="outline-none border border-gray-300 rounded-md px-4 py-2 shadow-sm w-full" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                }

                {resultados.length > 0 && <ul className="absolute top-full mt-2 left-24 z-20 bg-white border rounded-md p-2 flex flex-col gap-1">
                    {resultados.map(insumo => <li onClick={() => handleSelect(insumo)} className="hover:bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:font-medium" key={insumo.nombre}>
                        {insumo.nombre}
                    </li>)}
                </ul>}
            </label>
        </div>

        <Table titulos={["Insumo", "Cantidad", "Último precio", "Total", "Opciones"]}>
            {cotizacion.map(linea => <TableRow key={linea.insumo.nombre}>
                <TableData espacio tam="lg">{linea.insumo.nombre}</TableData>
                <TableData><input className="outline-none w-16 bg-transparent" type="number" min={0} value={linea.cantidad} onChange={(e) => cambiarCantidad(linea.insumo, Number(e.target.value))} /></TableData>
                <TableData>{`S/ ${linea.precio.toFixed(2)}`}</TableData>
                <TableData>{`S/ ${(linea.cantidad * linea.precio).toFixed(2)}`}</TableData>
                <TableData><Trash onClick={() => eliminarDeCotizacion(linea.insumo)} className="size-4 cursor-pointer" /></TableData>
            </TableRow>)}
        </Table>

        <div className="border rounded-md shadow-md mt-4 ml-auto flex items-center gap-8 px-4 py-2.5 text-sm w-fit">
            <p><span className="font-semibold mr-2">Total:</span>S/ {cotizacion.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0).toFixed(2)}</p>
            <button onClick={descargarExcel} className="flex items-center gap-2 bg-emerald-900 text-white px-3 py-1.5 shadow-md rounded-md hover:bg-emerald-800"><Download className="size-4" />Descargar en excel</button>
        </div>
    </section>
}
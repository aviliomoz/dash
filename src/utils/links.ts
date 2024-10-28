import { format } from "date-fns";
import { Local } from "./types";
import { UnsecuredJWT } from 'jose'

export const generarLinkCompras = (local: Local, fechaInicial: Date, fechaFinal: Date) => {

    const payload = {
        "pagina": 1,
        "locales": "1",
        "proveedor_id": "-1",
        "tipodoc": 0,
        "monedafacturacion_id": -1,
        "estado": "1",
        "tipoLista": 1,
        "soloServicios": "0",
        "orden": "1",
        "local_id": "1",
        "fecha_inicio": `${format(fechaInicial, "yyyy-MM-dd")} 00:00:00`,
        "fecha_fin": `${format(fechaFinal, "yyyy-MM-dd")} 23:59:59`,
        "registros": 20,
        "serie": "",
        "numero": "",
        "searchCodUnico": "",
        "filtroPorFechaCompra": "1",
        "itemIdList": "",
        "itemTipoList": ""
    }

    const parametros = new UnsecuredJWT(payload).encode().split(".")[1]

    return `http://${local.toLowerCase()}.restaurant.pe/restaurant/logistica/reportslogistica/reportlogistica.php?page=reportegenerico_generico&name=Informe_compras&or=L&parametros=${parametros}&c=ReporteCompras&m=reporteTodasLasCompres&token=F7imbCuXSB2U9X8ggsiGLfXE30pmh_ytys6c0uKt3RaYjd-3Zk2d6Uhq13yjKpW0X1viewk0K4cSO_QrptIxY_M6PyacPVoupNkAyNN7TV2bVZMLJIuUd5LikWQQ3EG6RgVQexF1ldsT-1BNZPxoWweHwpcUiJdtGiW0lFUJBDiMs3_YZv3uDmgAZHEaeH5a&type=excel&type=excel&detallado=1`
}


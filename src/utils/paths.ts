import { Building2, LayoutDashboard, ShoppingBag, UserCheck, Users } from "lucide-react";
import { PathGroup } from "./types";

export const PATHS: PathGroup[] = [
    {
        nombre: "MENU",
        paths: [
            { nombre: "Dashboard", url: "/dashboard", icono: LayoutDashboard },
            {
                nombre: "Compras", url: "/compras", icono: ShoppingBag, modules: [
                    {
                        nombre: "Comparador",
                        url: "/compras/comparador"
                    },
                    {
                        nombre: "Histórico",
                        url: "/compras/historico"
                    },
                    {
                        nombre: "Cotización",
                        url: "/compras/cotizacion"
                    },
                ]
            },
        ]
    },
    {
        nombre: "CLUB",
        paths: [
            { nombre: "Consulta", url: "/club/consulta", icono: UserCheck },
            { nombre: "Empresas", url: "/club/empresas", icono: Building2 },
            { nombre: "Empleados", url: "/club/empleados", icono: Users },
        ]
    }
]
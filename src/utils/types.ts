import { LucideIcon } from "lucide-react"
import { LOCALES } from "./constants"

export type Status = "activo" | "inactivo"

export type ApiResponse<T> = {
    ok: boolean,
    message: string,
    error?: string
    data?: T
}

export type Usuario = {
    documento: string,
    nombre: string,
    apellido: string,
    estado: Status
}

export type AuthResponse = {
    usuario: Usuario,
    accessToken: string
}

export type Path = {
    nombre: string,
    url: string,
    icono: LucideIcon,
    modules?: Module[]
}

export type PathGroup = {
    nombre: string,
    paths: Path[]
}

export type Module = {
    nombre: string,
    url: string
}

export type Local = typeof LOCALES[number]
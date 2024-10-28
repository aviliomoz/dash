import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"
import { Link, useLocation } from "react-router-dom"

export const AuthButton = () => {
    const location = useLocation()
    const { usuario, logout, checking } = useAuth()

    const hangleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    if (location.pathname === "/login" || checking) return <></>

    if (usuario) return <button onClick={hangleLogout} className="bg-gray-100 border shadow-sm rounded-md px-4 py-1.5 text-sm font-medium hover:bg-gray-200">Cerrar sesión</button>

    return <Link
        to={"/login"}
        className="bg-gray-900 text-white text-sm rounded-md px-4 py-1.5 hover:bg-gray-800 shadow-sm"
    >
        Iniciar sesión
    </Link>
}
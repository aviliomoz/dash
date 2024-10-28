import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const PrivateRoutesLayout = () => {

    const { usuario, checking } = useAuth()

    if (!usuario && !checking) return <Navigate to={"/login"} />

    return <Outlet />
}
import { Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Logo } from "../components/ui/Logo"
import { Menu } from "../components/ui/Menu";
import { AuthButton } from "../components/AuthButton";
import { UserWidget } from "../components/widgets/UserWidget";
import { Loading } from '../components/ui/Loading';

export const MainLayout = () => {

    const { usuario, checking } = useAuth()

    if (checking) return <Loading />

    return <>
        {usuario && <aside className="w-48 col-span-2 fixed bg-white border-r pr-4 z-50 h-screen">
            {<div className="h-24 flex items-center">
                <Logo />
            </div>}
            <Menu />
        </aside>}
        <main className={`${usuario && "pl-56"} pb-8`}>
            <header className="flex items-center justify-between h-24">
                {!usuario ? <Logo /> : <div></div>}
                <div className="flex items-center gap-8">
                    {usuario && <UserWidget usuario={usuario} />}
                    <AuthButton />
                </div>
            </header>
            <Outlet />
        </main>
    </>
}
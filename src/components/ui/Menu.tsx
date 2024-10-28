import { Link, useLocation } from "react-router-dom"
import { PATHS } from "../../utils/paths"
import { Circle } from "lucide-react"

export const Menu = () => {

    const location = useLocation()

    return <nav className="flex flex-col gap-4">
        {PATHS.map(group => <div key={group.nombre}>
            <h4 className="text-xs tracking-widest text-gray-500 mb-3">{group.nombre}</h4>
            <ul className="flex flex-col gap-1">
                {group.paths.map(path =>
                    <div key={path.nombre} className="flex flex-col gap-2">
                        <Link className={`flex items-center text-sm rounded-md gap-2 border border-transparent px-2 py-1 ${location.pathname.includes(path.url) ? "bg-gray-100 border-gray-200 font-medium" : "hover:border-gray-200 hover:bg-gray-100"}`} to={path.url}>
                            <path.icono className="size-4" />{path.nombre}
                        </Link>
                        {path.modules && <ul className="flex flex-col gap-2 pl-6 text-sm">
                            {path.modules.map(module => <Link key={module.nombre} className={`flex items-center gap-2 ${location.pathname === module.url && "font-medium"}`} to={module.url}><Circle className={`size-2 stroke-gray-900 ${location.pathname === module.url && "fill-gray-900"}`} />{module.nombre}</Link>)}
                        </ul>}
                    </div>)}
            </ul>
        </div>)}
    </nav>
}
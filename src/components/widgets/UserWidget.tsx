import { Usuario } from "../../utils/types"

type Props = {
    usuario: Usuario
}

export const UserWidget = ({ usuario }: Props) => {
    return <div className="flex items-center gap-3">
        <div className="bg-gray-900 size-6 rounded-full text-white flex justify-center items-center text-xs">{usuario.nombre.slice(0, 1)}</div>
        <p className="text-sm">{`${usuario.nombre} ${usuario.apellido}`}</p>
    </div>
}
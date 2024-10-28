import { Status } from "../../utils/types"

type Props = {
    status: Status,
    letraFinal?: "a" | "o",
}

export const StatusTag = ({ status, letraFinal = "o" }: Props) => {
    return <span className={`text-sm flex items-center gap-2 ${status === "activo" ? "text-green-700" : "text-red-700"}`}>
        <div className={`size-1.5 rounded-full ${status === "activo" ? "bg-green-700" : "bg-red-700"}`}></div>
        {status === "activo" ? `Activ${letraFinal}` : `Inactiv${letraFinal}`}
    </span>
}
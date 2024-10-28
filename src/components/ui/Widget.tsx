import { LoaderCircle } from "lucide-react"

type Props = {
    children: React.ReactNode
    titulo: string
    loading?: boolean
    x_scroll?: boolean
    y_scroll?: boolean
}

export const Widget = ({ children, titulo, loading = false, x_scroll = false, y_scroll = false }: Props) => {
    return <article className="border rounded-md p-4 shadow-md text-sm min-w-52 max-w-full">
        <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold">{titulo}</h5>
            {loading && <LoaderCircle className="size-4 animate-spin stroke-gray-400" />}
        </div>
        <div className={`${x_scroll && "overflow-x-scroll"} max-h-96 ${y_scroll && "overflow-y-scroll pr-4"}`}>
            {children}
        </div>
    </article>
}
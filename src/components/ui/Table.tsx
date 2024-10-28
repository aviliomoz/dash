type Props = {
    children: React.ReactNode,
    titulos: string[]
}

export const Table = ({ children, titulos }: Props) => {
    return <div className="border rounded-lg p-4">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-200">
                <tr className="h-8">
                    {titulos.map((titulo, index) => <th className={`${index === 0 && "rounded-l-md pl-4"} ${index === titulos.length - 1 && "rounded-r-md"}`} key={titulo}>{titulo}</th>)}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
}
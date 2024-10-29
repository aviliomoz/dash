type Props = {
    children: React.ReactNode
}

export const TableRow = ({ children }: Props) => {
    return <tr className="h-10 hover:bg-gray-100 border-b last:border-b-transparent">
        {children}
    </tr>
}
type Props = {
    children: React.ReactNode,
    espacio?: boolean,
    tam?: "sm" | "md" | "lg"
}

export const TableData = ({ children, espacio = false, tam = "sm" }: Props) => {
    return <td className={`pr-6 truncate ${espacio && "pl-4"} 
                            ${tam === "sm" && "max-w-24"}
                            ${tam === "md" && "max-w-60"}
                            ${tam === "lg" && "max-w-96"}
                          `}>
        {children}
    </td>
}
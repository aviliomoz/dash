type Props = {
    children: React.ReactNode,
    espacio?: boolean,
    tam?: "sm" | "md" | "lg" | "xl"
}

export const TableData = ({ children, espacio = false, tam = "sm" }: Props) => {
    return <td className={`pr-6 truncate text-xs ${espacio && "pl-4"} 
                            ${tam === "sm" && "max-w-24"}
                            ${tam === "md" && "max-w-36"}
                            ${tam === "lg" && "max-w-80"}
                            ${tam === "xl" && "max-w-96"}
                          `}>
        {children}
    </td>
}
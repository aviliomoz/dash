import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export const useSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState<string>("")

    useEffect(() => {
        const updateSearch = setTimeout(() => {
            const params = new URLSearchParams(searchParams)

            if (search === "") {
                params.delete("search")
            } else {
                params.set("search", search)
            }

            setSearchParams(params)
        }, 400)

        return () => {
            clearTimeout(updateSearch)
        }
    }, [search])

    return { search, setSearch }
}
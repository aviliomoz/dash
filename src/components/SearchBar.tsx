import { Search } from "lucide-react"
import { useSearch } from "../hooks/useSearch"

export const SearchBar = () => {

    const { search, setSearch } = useSearch()

    return <label className="flex items-center gap-2 border rounded-lg px-3 py-1.5 shadow-sm">
        <Search className="size-4 stroke-gray-400" />
        <input type="text" className="outline-none text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
    </label>
}
import { FiltroLocal } from "../components/FiltroLocal"
import { RangeDatePicker } from "../components/RangeDatePicker"
import { ComprasPorInsumoWidget } from "../components/widgets/ComprasPorInsumoWidget"
import { ComprasPorSemanaWidget } from "../components/widgets/ComprasPorSemanaWidget"
import { TotalComprasWidget } from "../components/widgets/TotalComprasWidget"

export const DashboardPage = () => {
    return <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Dashboard</h3>
            <div className="flex items-center gap-6">
                <FiltroLocal />
                <RangeDatePicker />
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <TotalComprasWidget />
            </div>
            <ComprasPorSemanaWidget />
            <ComprasPorInsumoWidget />
        </div>
    </section>
}
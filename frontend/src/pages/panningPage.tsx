import NavBar from "../components/navBar.tsx";
import "../css/global.css";

function PlanningPage(){
    return (
        <>
            <NavBar />
            <div className="pageBackground">
                <h1>Bienvenue sur Campfire</h1>
            </div>
        </>
    )
}
export default PlanningPage;

// import { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import { getPlanning } from "../services/planningService"
// import CalendarEngine from "../components/calendar/CalendarEngine"
// import { Planning } from "../types/planning"
//
// export default function PlanningPage() {
//
//     const { id } = useParams()
//     const [planning, setPlanning] = useState<Planning | null>(null)
//     const [loading, setLoading] = useState(true)
//
//     useEffect(() => {
//         async function load() {
//             if (!id) return
//             const data = await getPlanning(Number(id))
//             setPlanning(data)
//             setLoading(false)
//         }
//         load()
//     }, [id])
//
//     if (loading) return <div>Chargement...</div>
//     if (!planning) return <div>Planning introuvable</div>
//
//     return (
//         <div>
//             <h1>{planning.nom}</h1>
//
//             <CalendarEngine planning={planning} />
//         </div>
//     )
// }

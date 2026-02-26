import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import CalendarEngine from "../components/calendar/calendarEngine"
import { getPlanning } from "../services/planningService"

import CreatePlanningModal from "../components/calendar/createPlanningModal.tsx";
import NavBarConnecte from "../components/navBarConnecte.tsx";
import {getMyGroups} from "../services/groupService.ts";

import "../css/planningPage.css";
import "../css/global.css"

export default function PlanningPage() {

    const { id } = useParams()

    const [planning, setPlanning] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [groups, setGroups] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)

    // ======================
    // LOAD PLANNING
    // ======================

    const loadPlanning = async () => {

        if (!id) {
            setPlanning(null)
            setError(null)
            return
        }

        try {
            setLoading(true)

            const data = await getPlanning(Number(id))
            setPlanning(data)
            setError(null)

        } catch (err: any) {

            if (err.response?.status === 401) {
                setError("Authentification requise")
            } else if (err.response?.status === 403) {
                setError("Accès refusé")
            } else {
                setError( "Planning introuvable ou tu n'es rattaché à aucun planning")
            }

            setPlanning(null)

        } finally {
            setLoading(false)
        }
    }

    // ======================
    // LOAD GROUPS
    // ======================

    const loadGroups = async () => {

        try {
            const data = await getMyGroups()

            // On garde seulement les ORGANISATEUR
            const organisateurGroups =
                data.filter((g: any) =>
                    g.role === "ORGANISATEUR"
                )

            setGroups(organisateurGroups)

        } catch (error) {
            console.log("Erreur récupération groupes")
        }
    }

    useEffect(() => {
        loadPlanning()
        loadGroups()
    }, [id])

    return (
        <>
            <NavBarConnecte />
            <div className="planning-page">
                <div className="planning-header">
                    <div>
                        <h1 className="planning-title">
                            {planning ? planning.nom : "Planning"}
                        </h1>

                        {planning && (
                            <span
                                className={`planning-badge ${
                                    planning.calendar.type === "GREGORIEN"
                                        ? "badge-gregorien"
                                        : "badge-diegetique"
                                }`}
                            >

                                {planning.calendar.type}

                            </span>
                        )}
                    </div>

                    <div className="planning-actions">
                        <button
                            className="planning-btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            Créer un planning
                        </button>
                    </div>
                </div>

                <div className="calendar-container">

                    {loading && (
                        <div className="planning-loading">
                            Chargement...
                        </div>
                    )}
                    {!loading && error && (
                        <div className="planning-error">
                            {error}
                        </div>
                    )}
                    {!loading && planning && (
                        <CalendarEngine planning={planning} />
                    )}

                </div>

                {showModal && (
                    <CreatePlanningModal
                        groups={groups}
                        onClose={() => setShowModal(false)}
                    />
                )}

            </div>
        </>
    )
}
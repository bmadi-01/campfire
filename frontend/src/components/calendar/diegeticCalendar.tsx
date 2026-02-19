import { useState } from "react"
import { advanceTime } from "../../services/calendarService"

export default function DiegeticCalendar({ planning }: any) {

    const { config, state } = planning.calendar

    const [currentState, setCurrentState] = useState(state)

    const currentMonth =
        config.mois[currentState.mois - 1]

    const dayOfWeek =
        config.jours_semaine[
        (currentState.jour - 1) %
        config.jours_semaine.length
            ]

    const handleAdvance = async () => {
        const newState = await advanceTime(
            planning.id_planning,
            { heures: 1 }
        )
        setCurrentState(newState)
    }

    if (!config || !state) {
        return <div>Configuration manquante</div>
    }
    return (
        <div>

            <h2>
                {dayOfWeek} —
                {currentMonth.nom} {currentState.jour} —
                Année {currentState.annee}
            </h2>

            <p>
                {currentState.heure}h /
                {config.heures_par_jour}h
                {" — "}
                {currentState.minute}m /
                {config.minutes_par_heure}m
            </p>

            <button onClick={handleAdvance}>
                +1 heure
            </button>

        </div>
    )
}

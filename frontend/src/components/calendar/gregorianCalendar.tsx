import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import {
    getEventsByPlanning,
    createEvent,
    deleteEvent
} from "../../services/eventService"

interface Props {
    planning: any
}

export default function GregorianCalendar({ planning }: Props) {

    const [events, setEvents] = useState<any[]>([])

    const loadEvents = async () => {
        const data =
            await getEventsByPlanning(planning.id_planning)

        const mapped = data.map((event: any) => ({
            id: event.id_evenement,
            title: event.titre,
            start: event.date_debut,
            end: event.date_fin
        }))

        setEvents(mapped)
    }

    useEffect(() => {
        loadEvents()
    }, [planning.id_planning])

    // Création rapide au clic
    const handleDateClick = async (info: any) => {

        const titre = prompt("Titre de l'événement")
        if (!titre) return

        await createEvent({
            titre,
            description: "",
            id_planning: planning.id_planning,
            date_debut: info.dateStr
        })

        loadEvents()
    }

    // Suppression au clic
    const handleEventClick = async (info: any) => {

        if (confirm("Supprimer cet événement ?")) {
            await deleteEvent(info.event.id)
            loadEvents()
        }
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
        />
    )
}
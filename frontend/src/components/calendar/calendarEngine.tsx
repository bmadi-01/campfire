//import { Planning } from "../../types/planning"
import GregorianCalendar from "./gregorianCalendar"
import DiegeticCalendar from "./diegeticCalendar"

interface Props {
    planning: any
}

export default function CalendarEngine({ planning }: Props) {

    if (planning.calendar.type === "GREGORIEN") {
        return <GregorianCalendar planning={planning} />
    }

    if (planning.calendar.type === "DIEGETIQUE") {
        return <DiegeticCalendar planning={planning} />
    }

    return <div>Type de calendrier inconnu</div>
}
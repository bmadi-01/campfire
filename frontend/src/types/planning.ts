import {type DiegeticConfig, type DiegeticState} from "./calendar.ts"

export interface Planning {
    id_planning: number
    nom: string
    public: boolean
    id_calendrier: number
    calendar: {
        type: "GREGORIEN" | "DIEGETIQUE"
        config?: DiegeticConfig
        state?: DiegeticState
    }
}

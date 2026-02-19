export interface DiegeticConfig {
    jours_semaine: string[]
    mois: { nom: string; jours: number }[]
    heures_par_jour: number
    minutes_par_heure: number
    jours_par_annee: number
    annee_debut: number
}

export interface DiegeticState {
    annee: number
    mois: number
    jour: number
    heure: number
    minute: number
}

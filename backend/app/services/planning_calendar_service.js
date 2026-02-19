const calendrierRepository = require('../repositories/calendrier_repository');
const planningRepository = require('../repositories/planning_repository');
const calendarConfigRepo = require('../repositories/planning_calendar_config_repository');
const calendarStateRepo = require('../repositories/planning_calendar_state_repository');

/**
 * Vérifie que :
 * 1. Le planning existe
 * 2. Le planning utilise un calendrier de type DIEGETIQUE
 *
 * Cette fonction centralise la validation métier afin d'éviter
 * la duplication de logique dans chaque méthode.
 *
 * @param {number} id_planning
 * @returns {Object} planning valide
 * @throws Error si planning inexistant ou non diégétique
 */
async function ensureDiegeticPlanning(id_planning) {

    const planning =
        await planningRepository.findById(id_planning);

    if (!planning) {
        throw new Error('Planning introuvable');
    }

    const calendrier =
        await calendrierRepository.findById(
            planning.id_calendrier
        );

    if (!calendrier || calendrier.type !== 'DIEGETIQUE') {
        throw new Error(
            'Opération autorisée uniquement pour calendrier diégétique'
        );
    }

    return planning;
}

/**
 * Récupère la configuration structurelle du monde diégétique
 * associé à un planning.
 *
 * Cette configuration décrit :
 * - Les jours de la semaine
 * - Les mois (nom + nombre de jours)
 * - Le nombre d’heures par jour
 * - Le nombre de minutes par heure
 * - Les paramètres d’année.
 *
 * Accessible uniquement si le planning est DIEGETIQUE.
 *
 * @param {number} id_planning
 * @returns {Object} configuration du monde
 * @throws Error si planning non diégétique ou config absente
 */
exports.getConfig = async (id_planning) => {

    await ensureDiegeticPlanning(id_planning);

    const config =
        await calendarConfigRepo.findByPlanning(id_planning);

    if (!config) {
        throw new Error('Configuration inexistante');
    }

    return config;
};

/**
 * Met à jour la configuration structurelle du monde diégétique.
 *
 * Permet de modifier :
 * - jours_semaine
 * - mois
 * - jours_par_annee
 * - annee_debut
 * - heures_par_jour
 * - minutes_par_heure
 *
 * Seules les propriétés autorisées peuvent être modifiées.
 * Ne modifie PAS l’état courant du monde.
 *
 * @param {number} id_planning
 * @param {Object} updates
 * @returns {Object} configuration mise à jour
 * @throws Error si planning non diégétique ou données invalides
 */
exports.updateConfig = async (id_planning, updates) => {

    await ensureDiegeticPlanning(id_planning);

    const allowedFields = [
        'jours_semaine',
        'mois',
        'jours_par_annee',
        'annee_debut',
        'heures_par_jour',
        'minutes_par_heure'
    ];

    const safeUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await calendarConfigRepo.update(
        id_planning,
        safeUpdates
    );
};

/**
 * Récupère l’état actuel du monde diégétique.
 *
 * L’état correspond à la date actuelle dans le monde :
 * - année
 * - mois
 * - jour
 * - heure
 * - minute
 *
 * Accessible uniquement si le planning est DIEGETIQUE.
 *
 * @param {number} id_planning
 * @returns {Object} état courant du monde
 * @throws Error si planning non diégétique ou état absent
 */
exports.getState = async (id_planning) => {

    await ensureDiegeticPlanning(id_planning);

    const state =
        await calendarStateRepo.findByPlanning(id_planning);

    if (!state) {
        throw new Error('État inexistant');
    }

    return state;
};

/**
 * Met à jour manuellement l’état courant du monde diégétique.
 *
 * Permet de modifier :
 * - annee
 * - mois
 * - jour
 * - heure
 * - minute
 *
 * Ne modifie pas la structure du monde.
 * Doit respecter les contraintes définies dans la configuration.
 *
 * @param {number} id_planning
 * @param {Object} updates
 * @returns {Object} état mis à jour
 * @throws Error si planning non diégétique ou données invalides
 */
exports.updateState = async (id_planning, updates) => {

    await ensureDiegeticPlanning(id_planning);

    const allowedFields = [
        'annee',
        'mois',
        'jour',
        'heure',
        'minute'
    ];

    const safeUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide');
    }

    return await calendarStateRepo.update(
        id_planning,
        safeUpdates
    );
};

/**
 * Avance automatiquement le temps du monde diégétique.
 *
 * Gère intelligemment :
 * - Overflow des minutes → heures
 * - Overflow des heures → jours
 * - Overflow des jours → mois
 * - Overflow des mois → années
 *
 * Utilise la configuration du monde pour déterminer :
 * - minutes_par_heure
 * - heures_par_jour
 * - nombre de jours par mois
 *
 * @param {number} id_planning
 * @param {Object} delta { minutes?, heures?, jours? }
 * @returns {Object} nouvel état du monde
 * @throws Error si planning non diégétique ou données invalides
 */
exports.advanceTime = async (id_planning, delta) => {

    await ensureDiegeticPlanning(id_planning);
    const config =
        await calendarConfigRepo.findByPlanning(id_planning);

    const state =
        await calendarStateRepo.findByPlanning(id_planning);

    if (!config || !state) {
        throw new Error('Configuration ou état manquant');
    }

    let { annee, mois, jour, heure, minute } = state;

    minute += delta.minutes || 0;
    heure += delta.heures || 0;
    jour += delta.jours || 0;

    // Minutes → heures
    while (minute >= config.minutes_par_heure) {
        minute -= config.minutes_par_heure;
        heure++;
    }

    // Heures → jours
    while (heure >= config.heures_par_jour) {
        heure -= config.heures_par_jour;
        jour++;
    }

    const moisConfig = config.mois;

    // Jours → mois
    while (jour > moisConfig[mois - 1].jours) {
        jour -= moisConfig[mois - 1].jours;
        mois++;
    }

    // Mois → année
    while (mois > moisConfig.length) {
        mois = 1;
        annee++;
    }

    return await calendarStateRepo.update(
        id_planning,
        { annee, mois, jour, heure, minute }
    );
};

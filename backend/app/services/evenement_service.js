const evenementRepository = require('../repositories/evenement_repository');
const planningRepository = require('../repositories/planning_repository');
const calendrierRepository = require('../repositories/calendrier_repository');

/**
 * =========================================
 *             CREATE ÉVÉNEMENT
 * =========================================
 * Règles :
 * - L’événement appartient à un planning via id_planning
 * - L’événement possède sa propre date
 * - Le planning ne contient PAS la date des événements
 * - Le planning définit seulement moteur / monde / permissions
 */
exports.create = async ({
                            titre,
                            description,
                            id_planning,
                            date_debut = null,
                            date_fin = null,
                            annee = null,
                            mois = null,
                            jour = null,
                            heure = null,
                            minute = null
                        }) => {

    // Vérifier planning
    const planning =
        await planningRepository.findById(id_planning);

    if (!planning) {
        throw new Error('Planning introuvable');
    }

    // Vérifier moteur calendrier
    const calendrier =
        await calendrierRepository.findById(
            planning.id_calendrier
        );

    if (!calendrier) {
        throw new Error('Calendrier introuvable');
    }

    // =================================
    //  GREGORIEN
    // =================================
    if (calendrier.type === 'GREGORIEN') {

        if (!date_debut) {
            throw new Error(
                'date_debut requis pour événement grégorien'
            );
        }

        // Vérifier conflit
        if (evenementRepository.existsGregorianConflict) {
            const conflict =
                await evenementRepository.existsGregorianConflict(
                    id_planning,
                    date_debut
                );

            if (conflict) {
                throw new Error('Conflit horaire détecté');
            }
        }

        return await evenementRepository.create({
            titre,
            description,
            id_planning,
            date_debut,
            date_fin
        });
    }

    // =================================
    //  DIEGETIQUE
    // =================================
    if (calendrier.type === 'DIEGETIQUE') {

        if (
            annee == null ||
            mois == null ||
            jour == null
        ) {
            throw new Error('Date diégétique incomplète');
        }

        if (evenementRepository.existsDiegeticConflict) {
            const conflict =
                await evenementRepository.existsDiegeticConflict(
                    id_planning,
                    annee,
                    mois,
                    jour,
                    heure,
                    minute
                );

            if (conflict) {
                throw new Error('Conflit horaire détecté');
            }
        }

        return await evenementRepository.create({
            titre,
            description,
            id_planning,
            annee,
            mois,
            jour,
            heure,
            minute
        });
    }

    throw new Error('Type calendrier inconnu');
};

/**
 * Récupère les événements d’un planning
 */
exports.getByPlanning = async (id_planning) => {

    const planning =
        await planningRepository.findById(id_planning);

    if (!planning) {
        throw new Error('Planning introuvable');
    }

    return await evenementRepository.findByPlanning(
        id_planning
    );
};
/**
 * Récupère les événements vis à son ID
 */
exports.getById = async (id_evenement) => {

    const evenement =
        await evenementRepository.findById(id_evenement);

    if (!evenement) {
        throw new Error('Événement introuvable');
    }

    return evenement;
};

/**
 * Met à jour un événement
 */
exports.update = async (id_evenement, updates) => {

    const allowedFields = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
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
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await evenementRepository.update(
        id_evenement,
        safeUpdates
    );
};

/**
 * Supprime un événement
 */
exports.delete = async (id_evenement) => {
    return await evenementRepository.delete(id_evenement);
};

const evenementRepository = require('../repositories/evenement_repository');
const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');
const identiteRepository = require('../repositories/identite_repository');

/**
 * Crée un événement
 * - personnel
 * - ou synchronisé avec un groupe
 */
exports.create = async ({
                            titre,
                            description,
                            id_planning,
                            id_identite = null
                        }) => {
    // 1️ Vérifier planning
    const planning = await planningRepository.findById(id_planning);
    if (!planning) {
        throw new Error('Planning introuvable');
    }

    // 2️ Création événement personnel (toujours)
    const eventPersonnel = await evenementRepository.create({
        titre,
        description,
        id_planning
    });

    // 3️ Vérifier si le planning appartient à un groupe
    const planningsGroupe = await possedeRepository.findPlanningsByGroupe;
    let isGroupPlanning = false;

    // ⚠️ La détection réelle se fait via le service appelant
    // Ici on suppose que id_identite != null => contexte groupe

    if (!id_identite) {
        return { personnel: eventPersonnel };
    }

    // 4️ Vérifier identité
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    // 5️ Récupérer rôle dans le groupe
    const role = await roleGroupeRepository.findOne(
        planning.id_groupe,
        id_identite
    );

    if (!role || !['ORGANISATEUR', 'MEMBRE'].includes(role.level_nom)) {
        throw new Error('Permission insuffisante pour créer un événement');
    }

    // 6️ Vérifier conflit horaire dans le groupe
    const conflict = await evenementRepository.existsAtSameTime(
        planning.id_planning,
        planning.date_,
        planning.heure
    );

    if (conflict) {
        throw new Error('Conflit : un événement existe déjà à ce créneau');
    }

    // 7️ Créer événement groupe
    const eventGroupe = await evenementRepository.create({
        titre,
        description,
        id_planning
    });

    return {
        personnel: eventPersonnel,
        groupe: eventGroupe
    };
};

/**
 * Récupère les événements d’un planning
 */
exports.getByPlanning = async (id_planning) => {
    return await evenementRepository.findByPlanning(id_planning);
};

/**
 * Met à jour un événement
 */
exports.update = async (id_evenement, updates) => {
    const allowedFields = ['titre', 'description'];

    const safeUpdates = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await evenementRepository.update(id_evenement, safeUpdates);
};

/**
 * Supprime un événement
 */
exports.delete = async (id_evenement) => {
    return await evenementRepository.delete(id_evenement);
};

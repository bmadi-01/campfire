const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');

const calendarConfigRepo = require('../repositories/planning_calendar_config_repository');
const calendarStateRepo = require('../repositories/planning_calendar_state_repository');
const calendrierRepository = require('../repositories/calendrier_repository');


/**
 * Récupère un planning par ID avec vérification de visibilité
 */
exports.getById = async ({ id_planning, id_utilisateur = null, isVisitor = false }) => {
    const planning = await planningRepository.findFullById(id_planning);
    if (!planning) {
        throw new Error('Planning introuvable');
    }

    // Public → visible par tous
    if (planning.public) {
        return planning;
    }

    // Privé + visiteur → interdit
    if (isVisitor) {
        throw new Error('Accès refusé');
    }

    // Planning personnel
    if (planning.id_utilisateur === id_utilisateur) {
        return planning;
    }

    // Planning de groupe → vérifier appartenance
    // Gestion groupe à compléter si nécessaire

    const groupes = await possedeRepository.findPlanningsByGroupe;

    // L'appartenance sera vérifiée côté service appelant (événement / groupe)

    throw new Error('Accès refusé');
};

/**
 * Liste les plannings personnels d’un utilisateur
 */
exports.getPersonnalPlannings = async (id_utilisateur) => {
    return await planningRepository.findByUtilisateur(id_utilisateur);
};

/**
 * Liste les plannings d’un groupe
 */
exports.getGroupPlannings = async (id_groupe) => {
    return await planningRepository.findByGroupe(id_groupe);
};

/**
 * Création d’un planning personnel
 */
exports.createPersonalPlanning = async (planningData, id_utilisateur) => {
    return await planningRepository.createForUtilisateur({
        ...planningData,
        id_utilisateur
    });
};


/**
 * Création config si DIEGETIQUE.
 */
exports.createPlanning = async (planningData, id_utilisateur) => {

    const planning = await planningRepository.createForUtilisateur({
        ...planningData,
        id_utilisateur
    });

    // Récupérer type du calendrier
    const calendrier = await calendrierRepository.findById(
        planning.id_calendrier
    );

    if (calendrier.type === 'DIEGETIQUE') {

        if (!planningData.config) {
            throw new Error('Configuration requise pour calendrier diégétique');
        }

        await calendarConfigRepo.create(
            planning.id_planning,
            planningData.config
        );

        await calendarStateRepo.create(
            planning.id_planning,
            {
                annee: planningData.config.annee_debut || 1,
                mois: 1,
                jour: 1,
                heure: 0,
                minute: 0
            }
        );
    }

    return planning;
};

/**
 * Vérifie si une identité a le droit de modifier un planning de groupe
 */
exports.canEditGroupPlanning = async (id_groupe, id_identite) => {
    const role = await roleGroupeRepository.findOne(id_groupe, id_identite);
    if (!role) {
        throw new Error('Accès refusé');
    }

    return ['ORGANISATEUR', 'MEMBRE'].includes(role.level_nom);
};

/**
 * Mise à jour d’un planning
 */
exports.update = async (id_planning, updates) => {
    const allowedFields = ['nom', 'public', 'date_', 'heure'];

    const safeUpdates = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await planningRepository.update(id_planning, safeUpdates);
};

/**
 * Suppression d’un planning
 * ⚠️ À sécuriser par permissions
 */
exports.delete = async (id_planning) => {
    return await planningRepository.delete(id_planning);
};

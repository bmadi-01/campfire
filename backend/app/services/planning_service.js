const planningRepository = require('../repositories/planning_repository');
const possedeRepository = require('../repositories/possede_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');

const calendarConfigRepo = require('../repositories/planning_calendar_config_repository');
const calendarStateRepo = require('../repositories/planning_calendar_state_repository');
const calendrierRepository = require('../repositories/calendrier_repository');


/**
 * Récupère un planning avec vérification visibilité
 */
exports.getById = async ({
                             id_planning,
                             id_utilisateur = null,
                             isVisitor = false
                         }) => {

    const planning =
        await planningRepository.findFullById(id_planning);

    if (!planning) {
        throw new Error('Planning introuvable');
    }

    // =========================
    // PUBLIC → tout le monde
    // =========================
    if (planning.public) {
        return planning;
    }

    // =========================
    // VISITEUR → refus
    // =========================
    if (isVisitor) {
        throw new Error('Accès refusé');
    }

    // =========================
    // PLANNING PERSONNEL
    // =========================
    if (planning.id_utilisateur === id_utilisateur) {
        return planning;
    }

    // =========================
    // PLANNING DE GROUPE
    // =========================

    const lien =
        await possedeRepository.findGroupeByPlanning(
            id_planning
        );

    if (!lien) {
        throw new Error('Accès refusé');
    }

    const role =
        await roleGroupeRepository.findByUser(
            lien.id_groupe,
            id_utilisateur
        );

    if (!role) {
        throw new Error('Accès refusé : non membre du groupe');
    }

    // MEMBRE ou ORGANISATEUR peuvent lire
    return planning;
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

    const {
        nom,
        public: isPublic,
        type,
        id_groupe = null,
        config = null
    } = planningData;

    if (!nom) {
        throw new Error('Nom requis');
    }

    // =========================
    // Trouver calendrier
    // =========================

    const calendrier = await calendrierRepository.findByType(type);

    if (!calendrier) {
        throw new Error('Type calendrier invalide');
    }

    // =========================
    // Si groupe → vérifier ORGANISATEUR
    // =========================

    if (id_groupe) {

        const role = await roleGroupeRepository.findByUser(
            id_groupe,
            id_utilisateur
        );

        if (!role || role.level_nom !== 'ORGANISATEUR') {
            throw new Error(
                'Seul un ORGANISATEUR peut créer un planning de groupe'
            );
        }
    }

    // =========================
    // Créer planning
    // =========================

    const planning = await planningRepository.createForUtilisateur({
        nom,
        public: false,
        date_: new Date(),
        heure: new Date(),
        id_calendrier: calendrier.id_calendrier,
        id_utilisateur
    });

    // =========================
    // Si groupe → créer liaison possede
    // =========================

    if (id_groupe) {

        await possedeRepository.create(
            {
                id_groupe,
                id_planning: planning.id_planning
            }
        );
    }

    // =========================
    // Si DIEGETIQUE → créer config + state
    // =========================

    if (calendrier.type === 'DIEGETIQUE') {

        if (!config) {
            throw new Error(
                'Configuration requise pour calendrier diégétique'
            );
        }

        await calendarConfigRepo.create(
            planning.id_planning,
            config
        );

        await calendarStateRepo.create(
            planning.id_planning,
            {
                annee: config.annee_debut || 1,
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

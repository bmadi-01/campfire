const possedeRepository = require('../repositories/possede_repository');
const planningRepository = require('../repositories/planning_repository');
const groupeRepository = require('../repositories/groupe_repository');

/**
 * Lie un planning à un groupe
 * (réservé aux plannings de groupe)
 */
exports.addPlanningToGroupe = async (id_groupe, id_planning) => {
    // 1️ Vérifier groupe
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }

    // 2️ Vérifier planning
    const planning = await planningRepository.findById(id_planning);
    if (!planning) {
        throw new Error('Planning introuvable');
    }

    // 3️ Empêcher liaison planning personnel → groupe
    if (planning.id_utilisateur) {
        throw new Error('Un planning personnel ne peut pas être lié à un groupe');
    }

    // 4️ Vérifier non-doublon
    const exists = await possedeRepository.exists(id_groupe, id_planning);
    if (exists) {
        throw new Error('Ce planning est déjà lié à ce groupe');
    }

    return await possedeRepository.create({
        id_groupe,
        id_planning
    });
};

/**
 * Récupère les plannings d’un groupe
 */
exports.getPlanningsByGroupe = async (id_groupe) => {
    const groupe = await groupeRepository.findById(id_groupe);
    if (!groupe) {
        throw new Error('Groupe introuvable');
    }

    return await possedeRepository.findPlanningsByGroupe(id_groupe);
};

/**
 * Supprime le lien entre un planning et un groupe
 * ⚠️ Très sensible (normalement rare)
 */
exports.removePlanningFromGroupe = async (id_groupe, id_planning) => {
    const exists = await possedeRepository.exists(id_groupe, id_planning);
    if (!exists) {
        throw new Error('Lien groupe / planning inexistant');
    }

    return await possedeRepository.delete(id_groupe, id_planning);
};

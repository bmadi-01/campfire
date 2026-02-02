const identiteRepository = require('../repositories/identite_repository');
const utilisateurRepository = require('../repositories/utilisateur_repository');

/**
 * Crée une identité pour un utilisateur
 * (ex: identité dans un groupe ou organisation)
 */
exports.create = async ({ nom, id_utilisateur }) => {
    // Vérifier que l'utilisateur existe
    const utilisateur = await utilisateurRepository.findById(id_utilisateur);
    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    return await identiteRepository.create({
        nom,
        id_utilisateur
    });
};

/**
 * Récupère une identité par son ID
 */
exports.getById = async (id_identite) => {
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    return identite;
};

/**
 * Récupère toutes les identités d’un utilisateur
 */
exports.getByUtilisateur = async (id_utilisateur) => {
    // Sécurité : vérifier que l'utilisateur existe
    const utilisateur = await utilisateurRepository.findById(id_utilisateur);
    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    return await identiteRepository.findByUtilisateur(id_utilisateur);
};

/**
 * Récupère toutes les identités d’un groupe
 */
exports.getByGroupe = async (id_groupe) => {
    return await identiteRepository.findByGroupe(id_groupe);
};

/**
 * Met à jour une identité
 * (ex: renommer une identité)
 */
exports.update = async (id_identite, updates) => {
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    const allowedFields = ['nom'];
    const safeUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    return await identiteRepository.update(id_identite, safeUpdates);
};

/**
 * Supprime une identité
 * ⚠️ La cascade métier (disponibilités, rôles de groupe)
 * doit être gérée dans les services appelants
 */
exports.delete = async (id_identite) => {
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    return await identiteRepository.delete(id_identite);
};

/**
 * Vérifie qu’une identité appartient bien à un utilisateur
 * (utile pour les permissions)
 */
exports.checkOwnership = async (id_identite, id_utilisateur) => {
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    if (identite.id_utilisateur !== id_utilisateur) {
        throw new Error('Accès interdit : identité non liée à l’utilisateur');
    }

    return true;
};

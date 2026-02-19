const identiteRepository = require('../repositories/identite_repository');
const utilisateurRepository = require('../repositories/utilisateur_repository');
const roleGroupeRepository = require('../repositories/role_groupe_repository');
const disponibiliteRepository = require('../repositories/disponibilite_repository');

/**
 * Crée une identité pour un utilisateur
 * (ex: identité dans un groupe ou organisation)
 */
exports.create = async (userId, nom) => {
    console.log('DEBUG userId reçu:', userId);

    if (!userId) {
        throw new Error('Utilisateur non authentifié');
    }

    if (!nom) {
        throw new Error('Nom de l’identité requis');
    }

    const utilisateur = await utilisateurRepository.findById(userId);
    if (!utilisateur) {
        throw new Error('Crée une identité pour un utilisateur: Utilisateur introuvable');
    }

    return await identiteRepository.create({
        nom,
        id_utilisateur: userId
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

    return await identiteRepository.findWithGroupStatus(id_utilisateur);
};

/**
 * Récupère toutes les identités d’un groupe
 */
exports.getByGroupe = async (id_groupe) => {
    return await identiteRepository.findByGroupe(id_groupe);
};

/**
 * Met à jour une identité
 * (uniquement si elle appartient à l'utilisateur connecté)
 */
exports.update = async (id_identite, updates, userId) => {
    if (!userId) {
        throw new Error('Utilisateur non authentifié');
    }

    // Vérifier l'identité
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    // Ownership
    if (identite.id_utilisateur !== userId) {
        throw new Error('Accès interdit : cette identité ne vous appartient pas');
    }

    // Champs autorisés
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

    // Mise à jour
    return await identiteRepository.update(id_identite, safeUpdates);
};


/**
 * Supprime une identité
 * ⚠️ La cascade métier (disponibilités, rôles de groupe)
 * doit être gérée dans les services appelants
 */
exports.delete = async (id_identite, userId) => {
    if (!userId) {
        throw new Error('Utilisateur non authentifié');
    }

    // Vérifier l'identité
    const identite = await identiteRepository.findById(id_identite);
    if (!identite) {
        throw new Error('Identité introuvable');
    }

    // Ownership
    if (identite.id_utilisateur !== userId) {
        throw new Error('Accès interdit : cette identité ne vous appartient pas');
    }

    // Cascade métier
    await roleGroupeRepository.deleteByIdentite(id_identite);
    await disponibiliteRepository.deleteByIdentite(id_identite);

    // Suppression finale
    return await identiteRepository.delete(id_identite);
};
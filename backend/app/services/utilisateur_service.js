const utilisateurRepository = require('../repositories/utilisateur_repository');
const roleRepository = require('../repositories/role_repository');
const passwordUtils = require('../utils/password');

/**
 * Récupère le profil d’un utilisateur
 */
exports.getById = async (id_utilisateur) => {
    const utilisateur = await utilisateurRepository.findById(id_utilisateur);

    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    const role = await roleRepository.findById(utilisateur.id_role);

    return {
        id: utilisateur.id_utilisateur,
        prenom: utilisateur.prenom,
        pseudo: utilisateur.pseudo,
        email: utilisateur.email,
        actif: utilisateur.actif,
        role: role ? role.nom : null,
        date_creation: utilisateur.date_creation
    };
};

/**
 * Mise à jour du profil utilisateur (utilisateur connecté)
 * @param {number} userId - ID de l'utilisateur connecté (req.user.id)
 * @param {Object} data - champs à mettre à jour
 */
exports.update = async (userId, data) => {
    if (!userId) {
        throw new Error('Utilisateur non authentifié');
    }

    // Champs autorisés uniquement
    const allowedFields = ['prenom', 'pseudo', 'email', 'actif'];

    const updates = {};

    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    // Aucun champ valide fourni
    if (Object.keys(updates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
    }

    // Vérifier que l'utilisateur existe
    const utilisateur = await utilisateurRepository.findById(userId);
    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    // Mise à jour via le repository
    const updatedUser = await utilisateurRepository.update(
        userId,
        updates
    );

    return {
        id: updatedUser.id_utilisateur,
        prenom: updatedUser.prenom,
        pseudo: updatedUser.pseudo,
        email: updatedUser.email,
        actif: updatedUser.actif
    };
};

/**
 * Changement du mot de passe utilisateur (utilisateur connecté)
 * @param {number} userId - ID utilisateur connecté
 * @param {string} oldPassword - ancien mot de passe
 * @param {string} newPassword - nouveau mot de passe
 */
exports.changePassword = async (userId, oldPassword, newPassword) => {
    if (!userId) {
        throw new Error('Utilisateur non authentifié');
    }

    if (!oldPassword || !newPassword) {
        throw new Error('Ancien et nouveau mot de passe requis');
    }

    //  Récupérer l'utilisateur
    const utilisateur = await utilisateurRepository.findById(userId);
    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    //  Vérifier l'ancien mot de passe
    const isValid = await passwordUtils.verifyPassword(
        oldPassword,
        utilisateur.mot_de_passe
    );

    if (!isValid) {
        throw new Error('Ancien mot de passe incorrect');
    }

    //  Hasher le nouveau mot de passe
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    //  Mise à jour
    await utilisateurRepository.update(userId, {
        mot_de_passe: hashedPassword
    });

    return {
        message: 'Mot de passe mis à jour avec succès'
    };
};

/**
 * Désactive un compte utilisateur
 */
exports.deactivate = async (id_utilisateur) => {
    const updated = await utilisateurRepository.update(id_utilisateur, {
        actif: false
    });

    if (!updated) {
        throw new Error('Impossible de désactiver le compte');
    }

    return { message: 'Compte désactivé' };
};

/**
 * Réactive un compte utilisateur (admin)
 */
exports.activate = async (id_utilisateur) => {
    const updated = await utilisateurRepository.update(id_utilisateur, {
        actif: true
    });

    if (!updated) {
        throw new Error('Impossible de réactiver le compte');
    }

    return { message: 'Compte réactivé' };
};

/**
 * Supprime définitivement un utilisateur
 * ⚠️ À protéger par permissions ADMIN
 */
exports.delete = async (id_utilisateur) => {
    const deleted = await utilisateurRepository.delete(id_utilisateur);

    if (!deleted) {
        throw new Error('Suppression impossible');
    }

    return { message: 'Utilisateur supprimé' };
};

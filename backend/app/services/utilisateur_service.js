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
 * Met à jour les informations du profil utilisateur
 * (hors mot de passe)
 */
exports.updateProfile = async (id_utilisateur, updates) => {
    const allowedFields = [
        'prenom',
        'pseudo',
        'email',
        'cle_dfa'
    ];

    const safeUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            safeUpdates[key] = updates[key];
        }
    }

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
    }

    const updatedUser = await utilisateurRepository.update(
        id_utilisateur,
        safeUpdates
    );

    if (!updatedUser) {
        throw new Error('Mise à jour impossible');
    }

    return {
        id: updatedUser.id_utilisateur,
        prenom: updatedUser.prenom,
        pseudo: updatedUser.pseudo,
        email: updatedUser.email
    };
};

/**
 * Changement de mot de passe
 */
exports.changePassword = async (
    id_utilisateur,
    ancienMotDePasse,
    nouveauMotDePasse
) => {
    const utilisateur = await utilisateurRepository.findById(id_utilisateur);

    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    const isValid = await passwordUtils.verifyPassword(
        ancienMotDePasse,
        utilisateur.mot_de_passe
    );

    if (!isValid) {
        throw new Error('Ancien mot de passe incorrect');
    }

    const hashedPassword = await passwordUtils.hashPassword(
        nouveauMotDePasse
    );

    await utilisateurRepository.update(id_utilisateur, {
        mot_de_passe: hashedPassword
    });

    return { message: 'Mot de passe mis à jour avec succès' };
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

const utilisateurRepository = require('../repositories/utilisateur_repository');
const passwordUtils = require('../utils/password');

/**
 * Changement de mot de passe utilisateur
 * @param {number} id_utilisateur - ID de l'utilisateur connecté
 * @param {string} ancienMotDePasse - mot de passe actuel
 * @param {string} nouveauMotDePasse - nouveau mot de passe
 */
exports.changePassword = async (id_utilisateur, ancienMotDePasse, nouveauMotDePasse) => {
    // 1️ Vérifier que l'utilisateur existe
    const utilisateur = await utilisateurRepository.findById(id_utilisateur);
    if (!utilisateur) {
        throw new Error('Utilisateur introuvable');
    }

    // 2️ Vérifier l'ancien mot de passe
    const isValid = await passwordUtils.verifyPassword(
        ancienMotDePasse,
        utilisateur.mot_de_passe
    );

    if (!isValid) {
        throw new Error('Ancien mot de passe incorrect');
    }

    // 3️ Hasher le nouveau mot de passe
    const nouveauHash = await passwordUtils.hashPassword(nouveauMotDePasse);

    // 4️ Mettre à jour le mot de passe
    await utilisateurRepository.update(
        id_utilisateur,
        { mot_de_passe: nouveauHash }
    );

    return { success: true };
};

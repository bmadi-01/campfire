const utilisateurService = require('../services/utilisateur_service');

/**
 * Récupérer le profil de l'utilisateur connecté
 * GET /utilisateurs/me
 */
exports.getMe = async (req, res) => {
    try {
        const utilisateur = await utilisateurService.getById(req.user.id);

        res.status(200).json({
            utilisateur
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Mettre à jour le profil utilisateur
 * PUT /utilisateurs/me
 */
exports.updateMe = async (req, res) => {
    try {
        const updates = req.body;

        const utilisateur = await utilisateurService.update(
            req.user.id,
            updates
        );

        res.status(200).json({
            message: 'Profil mis à jour',
            utilisateur
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Changer le mot de passe
 * PUT /utilisateurs/me/password
 */
exports.changePassword = async (req, res) => {
    try {
        const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

        if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
            return res.status(400).json({
                error: 'Ancien et nouveau mot de passe requis'
            });
        }

        await utilisateurService.changePassword(
            req.user.id,
            ancien_mot_de_passe,
            nouveau_mot_de_passe
        );

        res.status(200).json({
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

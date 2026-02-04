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
            req.body
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
 * Changement du mot de passe utilisateur connecté
 * PUT /utilisateurs/me/password
 */
exports.changePassword = async (req, res) => {
    try {
        const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

        const result = await utilisateurService.changePassword(
            req.user.id,
            ancien_mot_de_passe,
            nouveau_mot_de_passe
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

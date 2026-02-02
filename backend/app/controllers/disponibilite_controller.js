const disponibiliteService = require('../services/disponibilite_service');

/**
 * Inviter un utilisateur à un événement
 * POST /evenements/:id_evenement/invitations
 */
exports.invite = async (req, res) => {
    try {
        const { id_identite } = req.body;

        const invitation = await disponibiliteService.invite(
            req.params.id_evenement,
            id_identite,
            req.user.id
        );

        res.status(201).json({
            message: 'Invitation envoyée',
            invitation
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Répondre à une invitation
 * POST /evenements/:id_evenement/reponse
 */
exports.respond = async (req, res) => {
    try {
        const { id_identite, id_presence } = req.body;

        const disponibilite = await disponibiliteService.respond(
            req.params.id_evenement,
            id_identite,
            id_presence
        );

        res.status(200).json({
            message: 'Réponse enregistrée',
            disponibilite
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Modifier une disponibilité
 * PUT /evenements/:id_evenement/disponibilite
 */
exports.update = async (req, res) => {
    try {
        const { id_identite, id_presence } = req.body;

        const disponibilite = await disponibiliteService.update(
            req.params.id_evenement,
            id_identite,
            id_presence
        );

        res.status(200).json({
            message: 'Disponibilité mise à jour',
            disponibilite
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer une disponibilité
 * DELETE /evenements/:id_evenement/disponibilite/:id_identite
 */
exports.delete = async (req, res) => {
    try {
        await disponibiliteService.delete(
            req.params.id_evenement,
            req.params.id_identite
        );

        res.status(200).json({
            message: 'Disponibilité supprimée'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

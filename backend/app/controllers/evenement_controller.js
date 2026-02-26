const evenementService = require('../services/evenement_service');

/**
 * Lire un événement
 * GET /evenements/:id_evenement
 */
exports.getById = async (req, res) => {
    try {
        const evenement = await evenementService.getById(
            req.params.id_evenement
        );

        res.status(200).json({evenement});
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Créer un événement
 * POST /evenements
 */
exports.create = async (req, res) => {
    try {
        const evenement = await evenementService.create(
            req.body,
        );

        res.status(201).json({
            message: 'Événement créé avec succès',
            evenement
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Modifier un événement
 * PUT /evenements/:id_evenement
 */
exports.update = async (req, res) => {
    try {
        const evenement = await evenementService.update(
            req.params.id_evenement,
            req.body
        );

        res.status(200).json({
            message: 'Événement mis à jour',
            evenement
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer un événement
 * DELETE /evenements/:id_evenement
 */
exports.delete = async (req, res) => {
    try {
        await evenementService.delete(
            req.params.id_evenement
        );

        res.status(200).json({
            message: 'Événement supprimé avec succès'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

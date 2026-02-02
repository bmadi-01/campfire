const presenceService = require('../services/presence_service');

/**
 * Lister toutes les présences
 * GET /presences
 */
exports.getAll = async (req, res) => {
    try {
        const presences = await presenceService.getAll();

        res.status(200).json({
            presences
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Récupérer une présence par ID
 * GET /presences/:id_presence
 */
exports.getById = async (req, res) => {
    try {
        const presence = await presenceService.getById(
            req.params.id_presence
        );

        res.status(200).json({
            presence
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Créer un état de présence
 * POST /presences
 */
exports.create = async (req, res) => {
    try {
        const presence = await presenceService.create(
            req.body
        );

        res.status(201).json({
            message: 'Présence créée',
            presence
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Modifier un état de présence
 * PUT /presences/:id_presence
 */
exports.update = async (req, res) => {
    try {
        const presence = await presenceService.update(
            req.params.id_presence,
            req.body
        );

        res.status(200).json({
            message: 'Présence mise à jour',
            presence
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer un état de présence
 * DELETE /presences/:id_presence
 */
exports.delete = async (req, res) => {
    try {
        await presenceService.delete(
            req.params.id_presence
        );

        res.status(200).json({
            message: 'Présence supprimée'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

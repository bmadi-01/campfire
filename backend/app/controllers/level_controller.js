const levelService = require('../services/level_service');

/**
 * Lister tous les niveaux
 * GET /levels
 */
exports.getAll = async (req, res) => {
    try {
        const levels = await levelService.getAll();

        res.status(200).json({
            levels
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Récupérer un niveau par ID
 * GET /levels/:id_level
 */
exports.getById = async (req, res) => {
    try {
        const level = await levelService.getById(
            req.params.id_level
        );

        res.status(200).json({
            level
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Créer un niveau
 * POST /levels
 */
exports.create = async (req, res) => {
    try {
        const level = await levelService.create(
            req.body
        );

        res.status(201).json({
            message: 'Niveau créé avec succès',
            level
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Modifier un niveau
 * PUT /levels/:id_level
 */
exports.update = async (req, res) => {
    try {
        const level = await levelService.update(
            req.params.id_level,
            req.body
        );

        res.status(200).json({
            message: 'Niveau mis à jour',
            level
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Supprimer un niveau
 * DELETE /levels/:id_level
 */
exports.delete = async (req, res) => {
    try {
        await levelService.delete(
            req.params.id_level
        );

        res.status(200).json({
            message: 'Niveau supprimé'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

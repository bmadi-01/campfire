const calendrierService = require('../services/calendrier_service');

/**
 * Lister les calendriers
 * GET /calendriers
 */
exports.getAll = async (req, res) => {
    try {
        const calendriers = await calendrierService.getAll();

        res.status(200).json({ calendriers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Récupérer un calendrier
 * GET /calendriers/:id_calendrier
 */
exports.getById = async (req, res) => {
    try {
        const calendrier = await calendrierService.getById(
            req.params.id_calendrier
        );

        res.status(200).json({ calendrier });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/**
 * Créer un calendrier
 * POST /calendriers
 */
exports.create = async (req, res) => {
    try {
        const calendrier = await calendrierService.create(
            req.body
        );

        res.status(201).json({
            message: 'Calendrier créé',
            calendrier
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Supprimer un calendrier
 * DELETE /calendriers/:id_calendrier
 */
exports.delete = async (req, res) => {
    try {
        await calendrierService.delete(
            req.params.id_calendrier
        );

        res.status(200).json({
            message: 'Calendrier supprimé'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

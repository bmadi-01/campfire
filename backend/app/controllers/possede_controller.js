const possedeService = require('../services/possede_service');

/**
 * Lister les plannings d’un groupe
 * GET /groupes/:id_groupe/plannings
 */
exports.getPlanningsByGroup = async (req, res) => {
    try {
        const plannings = await possedeService.getPlanningsByGroup(
            req.params.id_groupe
        );

        res.status(200).json({ plannings });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lier un planning à un groupe
 * POST /groupes/:id_groupe/plannings
 */
exports.attachPlanning = async (req, res) => {
    try {
        const { id_planning } = req.body;

        await possedeService.attach(
            req.params.id_groupe,
            id_planning
        );

        res.status(201).json({
            message: 'Planning rattaché au groupe'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Détacher un planning d’un groupe
 * DELETE /groupes/:id_groupe/plannings/:id_planning
 */
exports.detachPlanning = async (req, res) => {
    try {
        await possedeService.detach(
            req.params.id_groupe,
            req.params.id_planning
        );

        res.status(200).json({
            message: 'Planning détaché du groupe'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

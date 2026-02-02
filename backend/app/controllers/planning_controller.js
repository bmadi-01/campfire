const planningService = require('../services/planning_service');

/**
 * Lire un planning
 * GET /plannings/:id_planning
 */
exports.getById = async (req, res) => {
    try {
        const planning = await planningService.getById(
            req.params.id_planning
        );

        res.status(200).json({
            planning
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

/**
 * Mettre à jour un planning
 * PUT /plannings/:id_planning
 */
exports.update = async (req, res) => {
    try {
        const updates = req.body;

        const planning = await planningService.update(
            req.params.id_planning,
            updates
        );

        res.status(200).json({
            message: 'Planning mis à jour',
            planning
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Lister les plannings de l'utilisateur connecté
 * GET /plannings/me
 */
exports.getMyPlannings = async (req, res) => {
    try {
        const plannings = await planningService.getByUser(
            req.user.id
        );

        res.status(200).json({
            plannings
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Lister les plannings d’un groupe
 * GET /groupes/:id_groupe/plannings
 */
exports.getGroupPlannings = async (req, res) => {
    try {
        const plannings = await planningService.getByGroup(
            req.params.id_groupe
        );

        res.status(200).json({
            plannings
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

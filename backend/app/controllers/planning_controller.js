const planningService = require('../services/planning_service');
const planningCalendarService = require('../services/planning_calendar_service');

/**
 * Lire un planning
 * GET /plannings/:id_planning
 */
exports.getById = async (req, res) => {
    try {

        const planning = await planningService.getById({
            id_planning: req.params.id_planning,
            id_utilisateur: req.user?.id || null,
            isVisitor: !req.user
        });

        res.status(200).json({ planning });

    } catch (error) {
        res.status(403).json({
            error: error.message
        });
    }
};

/**
 * Crée un planning
 * POST /plannings
 */
exports.create = async (req, res) => {
    try {

        const planning =
            await planningService.createPlanning(
                req.body,
                req.user.id
            );

        res.status(201).json({
            message: 'Planning créé avec succès',
            planning
        });

    } catch (error) {
        res.status(400).json({
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
 * GET /plannings/me/list
 */
exports.getMyPlannings = async (req, res) => {
    try {
        const plannings = await planningService.getPersonnalPlannings(
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
        const plannings = await planningService.getGroupPlannings(
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

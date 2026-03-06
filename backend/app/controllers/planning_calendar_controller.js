const planningCalendarService =
    require('../services/planning_calendar_service');

/**
 * Lire la configuration du monde
 * GET /plannings/:id_planning/calendar/config
 */
exports.getConfig = async (req, res) => {
    try {

        const { id_planning } = req.params;

        const config =
            await planningCalendarService.getConfig(id_planning);

        res.status(200).json({ config });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


/**
 * Modifier la configuration
 * PUT /plannings/:id_planning/calendar/config
 */
exports.updateConfig = async (req, res) => {
    try {

        const { id_planning } = req.params;

        const updated =
            await planningCalendarService.updateConfig(
                id_planning,
                req.body
            );

        res.status(200).json({
            message: 'Configuration mise à jour',
            config: updated
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


/**
 * Lire l’état courant du monde
 * GET /plannings/:id_planning/calendar/state
 */
exports.getState = async (req, res) => {
    try {

        const { id_planning } = req.params;

        const state =
            await planningCalendarService.getState(id_planning);

        res.status(200).json({ state });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


/**
 * Modifier l’état courant
 * PUT /plannings/:id_planning/calendar/state
 */
exports.updateState = async (req, res) => {
    try {

        const { id_planning } = req.params;

        const updated =
            await planningCalendarService.updateState(
                id_planning,
                req.body
            );

        res.status(200).json({
            message: 'État du monde mis à jour',
            state: updated
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};


/**
 * Avancer le temps du monde
 * POST /plannings/:id_planning/calendar/advance
 */
exports.advanceTime = async (req, res) => {
    try {

        const { id_planning } = req.params;
        const { minutes = 0, heures = 0, jours = 0 } = req.body;

        const updated =
            await planningCalendarService.advanceTime(
                id_planning,
                { minutes, heures, jours }
            );

        res.status(200).json({
            message: 'Temps avancé avec succès',
            state: updated
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

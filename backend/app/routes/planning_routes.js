const express = require('express');
const router = express.Router();

const planningController = require('../controllers/planning_controller');
const planningCalendarController = require('../controllers/planning_calendar_controller');

const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { requireGroupMember } = require('../middlewares/requireGroupMember');
const {requirePlanningAccess} = require('../middlewares/requirePlanningAccess');

/**
 *   ROUTES CALENDRIER DIÉGÉTIQUE PLANNING
 * Lire configuration diégétique
 */
router.get('/:id_planning/calendar/config', requirePlanningAccess('read'),
    planningCalendarController.getConfig
);

/**
 * Modifier configuration diégétique
 */
router.put('/:id_planning/calendar/config', authenticate, requirePlanningAccess('write'),
    planningCalendarController.updateConfig
);

/**
 * Lire état courant du monde
 */
router.get('/:id_planning/calendar/state', requirePlanningAccess('read'),
    planningCalendarController.getState
);

/**
 * Modifier état courant
 */
router.put('/:id_planning/calendar/state', authenticate, requirePlanningAccess('write'),
    planningCalendarController.updateState
);

/**
 * Avancer le temps
 */
router.post('/:id_planning/calendar/advance', authenticate, requirePlanningAccess('write'),
    planningCalendarController.advanceTime
);


/**
 *   ROUTES PLANNING CLASSIQUES
 */
router.get('/me/list', authenticate, planningController.getMyPlannings);
router.get('/groupe/:id_groupe', authenticate, requireGroupMember, planningController.getGroupPlannings);
router.get('/:id_planning', requirePlanningAccess('read'), planningController.getById);
router.put('/:id_planning', authenticate, requirePlanningAccess('write'), planningController.update);

module.exports = router;
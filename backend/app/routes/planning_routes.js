const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planning_controller');

const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { requireGroupMember } = require('../middlewares/requireGroupMember');
const {requirePlanningAccess} = require('../middlewares/requirePlanningAccess');

router.get('/:id_planning',requirePlanningAccess('read'), planningController.getById);
router.put('/:id_planning',authenticate, requirePlanningAccess('write'), planningController.update);

router.get('/me/list', authenticate,planningController.getMyPlannings);
router.get('/groupe/:id_groupe', authenticate, requireGroupMember, planningController.getGroupPlannings);

module.exports = router;
const express = require('express');
const router = express.Router();

const evenementController = require('../controllers/evenement_controller');
const evenementService = require("../services/evenement_service");
const { authorize } = require('../middlewares/authorizeRoles');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const {requireEventAccess} = require('../middlewares/requireEventAccess');
const {requirePlanningAccess} = require('../middlewares/requirePlanningAccess');


router.get('/:id_evenement', requireEventAccess('read'),evenementController.getById)
router.get(
    '/planning/:id_planning', requirePlanningAccess('read'),
    async (req, res) => {
        try {
            const events =
                await evenementService.getByPlanning(
                    req.params.id_planning
                );

            res.status(200).json({
                evenements: events
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);
router.post('/', authenticate,authorize('USER'), evenementController.create);
router.put('/:id_evenement', authenticate,requireEventAccess('write'), evenementController.update);
router.delete('/:id_evenement', authenticate, requireEventAccess('write'), evenementController.delete);

module.exports = router;
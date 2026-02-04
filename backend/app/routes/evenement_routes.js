const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenement_controller');

const { authorize } = require('../middlewares/authorizeRoles');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const {requireEventAccess} = require('../middlewares/requireEventAccess');

router.get('/:id_evenement', requireEventAccess('read'),evenementController.getById)
router.post('/', authenticate,authorize('USER'), evenementController.create);
router.put('/:id_evenement', authenticate,requireEventAccess('write'), evenementController.update);
router.delete('/:id_evenement', authenticate, requireEventAccess('write'), evenementController.delete);

module.exports = router;
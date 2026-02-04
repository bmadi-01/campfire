const express = require('express');
const router = express.Router();
const calendrierController = require('../controllers/calendrier_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { authorize } = require('../middlewares/authorizeRoles');

router.get('/', calendrierController.getAll);
router.get('/:id_calendrier', calendrierController.getById);
router.post('/', authenticate, authorize('ADMIN'), calendrierController.create);
router.delete('/:id_calendrier', authenticate, authorize('ADMIN'), calendrierController.delete);

module.exports = router;

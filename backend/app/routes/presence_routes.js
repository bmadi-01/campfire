const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { authorize } = require('../middlewares/authorizeRoles');

router.get('/', presenceController.getAll);
router.get('/:id_presence', presenceController.getById);
router.post('/', authenticate, authorize('ADMIN'), presenceController.create);
router.put('/:id_presence', authenticate, authorize('ADMIN'), presenceController.update);
router.delete('/:id_presence', authenticate, authorize('ADMIN'), presenceController.delete);

module.exports = router;

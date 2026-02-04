const express = require('express');
const router = express.Router();
const levelController = require('../controllers/level_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');
const { authorize } = require('../middlewares/authorizeRoles');

router.get('/', levelController.getAll);
router.get('/:id_level', levelController.getById);
router.post('/', authenticate, authorize('ADMIN'), levelController.create);
router.put('/:id_level', authenticate, authorize('ADMIN'), levelController.update);
router.delete('/:id_level', authenticate, authorize('ADMIN'), levelController.delete);

module.exports = router;

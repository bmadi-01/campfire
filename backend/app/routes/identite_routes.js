const express = require('express');
const router = express.Router();
const identiteController = require('../controllers/identite_controller');
const { authenticate } = require('../middlewares/auth_jwt_middleware');

router.post('/', authenticate, identiteController.create);
router.get('/me', authenticate, identiteController.getMyIdentites);
router.get('/:id_identite', authenticate, identiteController.getById);
router.delete('/:id_identite', authenticate, identiteController.delete);

module.exports = router;

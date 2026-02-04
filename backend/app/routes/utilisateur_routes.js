const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur_controller');
const {authenticate} = require('../middlewares/auth_jwt_middleware')

router.get('/me', authenticate, utilisateurController.getMe)
router.put('/me', authenticate, utilisateurController.updateMe)
router.put('/me/password', authenticate, utilisateurController.changePassword)

module.exports = router;
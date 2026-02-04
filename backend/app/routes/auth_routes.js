const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// Route Inscription
router.post('/register', authController.register);
//Route Connexion
router.post('/login', authController.login);

module.exports = router;
